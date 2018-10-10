var app = getApp()
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		list: "",
		recommend: "",
		id: "",
		page: 1,
		hasMore: true,
		hiddenLoad: true,
		pageFlag: true,
		indicatorDots: true,
		indicatorColor: '#fff',
		indicatorActiveColor: '#d2d2d2',
		autoplay: true,
		interval: 3000,
		duration: 500,
		focusImgs: "",
		flexQrcodes: []
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		var that = this;


		wx.showLoading({
			title: '加载中...',
			mask: true
		});



		//列表
		wx.request({
			url: 'https://mini-gl.binglue.com/article/list',
			data: {
				id: 3,
				page: that.data.page,
				pageSize: 10
			},
			header: {
				'content-type': 'application/json' // 默认值
			},
			success: function (res) {
				/**
				 * code=1时有数据
				 * code=0时已经加载所有数据
				 * 加载成功后给page加1, 为分页做准备
				 */
				if (res.data.code === 1) {
					that.setData({
						list: res.data.data,
						page: that.data.page + 1
					})
					setTimeout(function () {
						wx.hideLoading()
					}, 500);
				} else {
					console.log("没有新的数据")
				}
			}
		});

		//焦点图
		wx.request({
			url: 'https://mini-gl.binglue.com/focus/list',
			data:{
				id: 3
			},
			header: {
				'content-type': 'application/json' // 默认值
			},
			success: function (res) {
				let data = res.data.data;
				that.setData({
					focusImgs: data
				})

				for (let i in data) {
					that.setData({
						focusQrcodes: data[i].wx_qrcode.concat(that.data.focusQrcodes)
					})
				}

				//如果就一张图,取消小点
				if (that.data.focusImgs.length == 1) {
					that.setData({
						indicatorDots: false
					})
				}
			}
		});

		//悬浮球
		wx.request({
			url: 'https://mini-gl.binglue.com/ball/setting',
			data:{
				id: 3
			},
			header: {
				'content-type': 'application/json' // 默认值
			},
			success: function (res) {
				let data = res.data;
				console.log(data)
				that.setData({
					flexQrcodes: data.wx_qrcode
				})
			}
		});


		//获取系统信息
		wx.getSystemInfo({
			success: function (res) {
				that.setData({
					clientHeight: res.windowHeight //设备的高度等于scroll-view内容的高度
				})
			}
		})
	},

	toDetail: function (e) {
		//点击跳转内页
		wx.navigateTo({
			url: `../detail/detail?url=${e.currentTarget.dataset.contentid}`
		})
	},
	previewImage: function (e) {
		var viewImg = e.currentTarget.dataset.src;
		wx.previewImage({
			urls: viewImg
		})
	},
	previewFlexImage: function (e) {
		wx.previewImage({
			urls: this.data.focusQrcodes
		})
	},
	onShareAppMessage: function (res) {
		if (res.from === 'button') {
			// 来自页面内转发按钮
			console.log(res.target)
		}
		return {
			title: '成语百科',
			path: '/pages/list/list'
		}
	},
	//上拉加载更多
	loadMore: function (e) {

		var that = this;

		if (!that.data.pageFlag) return

		that.setData({
			pageFlag: false
		});
		let url = 'https://mini-gl.binglue.com/article/list';

		wx.request({
			url: url,
			data: {
				id: 3,
				page: that.data.page,
				pageSize: 10
			},
			header: {
				'content-type': 'application/json' // 默认值
			},
			success: function (res) {
				console.log(res)
				if (res.data.code === 1) {
					that.setData({
						//向list追加数据
						list: that.data.list.concat(res.data.data),
						page: that.data.page + 1,
						pageFlag: true
					})
				}
				if (res.data.code === 0) {
					that.setData({
						hasMore: false
					})
					return
				}

			}
		});
	}
})