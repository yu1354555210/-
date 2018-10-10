var app = getApp()
var apiId = 7;
var appName = "挂机游戏盒子";
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
		focusQrcodes: []
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		var that = this;
		if(this.data.focusImgs.length == 1){
			this.setData({
				indicatorDots: false
			})
		}

		wx.showLoading({
			title: '加载中...',
			mask: true
		});

		//列表
		wx.request({
			url: 'https://mini-gl.binglue.com/dh-game/list',
			data: {
				id: apiId,
				page: that.data.page,
				pageSize: 10
			},
			header: {
				'content-type': 'application/json' // 默认值
			},
			success: function (res) {
				let data = res.data.data
				/**
				 * code=1时有数据
				 * code=0时已经加载所有数据
				 * 加载成功后给page加1, 为分页做准备
				 */
				if (res.data.code === 1) {
					console.log(res.data.data)
					that.setData({
						list: res.data.data,
						page: that.data.page + 1,
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
			url: 'https://mini-gl.binglue.com/dh-focus/list',
			data:{
				id: apiId
			},
			header: {
				'content-type': 'application/json' // 默认值
			},
			success: function (res) {
				let data = res.data.data;
				that.setData({
					focusImgs: data
				})
				
				//如果就一张图,取消小点
				if(that.data.focusImgs.length == 1){
					that.setData({
						indicatorDots: false
					})
				}
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

	previewImage: function (e) {
		var viewImg = e.currentTarget.dataset.src;
		wx.previewImage({
			urls: viewImg
		})
	},
	listPreviewImage: function (e) {
		let img = e.currentTarget.dataset.img;
		wx.previewImage({
			urls: img
		})
	},
	onShareAppMessage: function (res) {
		if (res.from === 'button') {
			// 来自页面内转发按钮
			console.log(res.target)
		}
		return {
			title: '这些经典的小游戏能让你找回失去的青春',
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
		let url = 'https://mini-gl.binglue.com/dh-game/list';

		wx.request({
			url: url,
			data: {
				id: apiId,
				page: that.data.page,
				pageSize: 10
			},
			header: {
				'content-type': 'application/json' // 默认值
			},
			success: function (res) {

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