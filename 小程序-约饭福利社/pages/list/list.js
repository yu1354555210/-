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
		hiddenLoad: false,
		pageFlag: true
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		var that = this;

		//2.5秒后首页加载动画消失
		setTimeout(() => {
			this.setData({
				hiddenLoad: true
			})
		}, 2500);

		wx.request({
			url: 'https://m.cht.tvhome.com/index.php?r=article/list',
			data: {
				page: that.data.page
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
					// console.log(res.data.data)
					that.setData({
						list: res.data.data,
						page: that.data.page + 1
					})
				} else {
					console.log("没有新的数据")
				}
			}
		});
		wx.request({
			url: 'https://m.cht.tvhome.com/index.php?r=article/recommend',
			header: {
				'content-type': 'application/json' // 默认值
			},
			success: function (res) {
				// console.log(res.data.data)
				let data = res.data.data;
				that.setData({
					title: data.title,
					id: data.id,
					cover_img: data.cover_img[0],
					source_type: data.source_type
				})
			}
		});
		//获取系统信息
		wx.getSystemInfo({
			success: function (res) {
				that.setData({
					clientHeight: res.windowHeight   //设备的高度等于scroll-view内容的高度
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
	//上拉加载更多
	loadMore: function (e) {

		var that = this;

		if (!that.data.pageFlag) return

		that.setData({
			pageFlag: false
		});
		let url = 'https://m.cht.tvhome.com/index.php?r=article/list';

		wx.request({
			url: url,
			data: {
				page: that.data.page
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


				} else {
					that.setData({
						hasMore: false
					})
					return
				}

			}
		});
	}
})