var app = getApp()
var apiId = 11;
var game_id = 5;
var version = '1.0.3';
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
		flexQrcodes: [],
		onlineStatus: false,
		name1: '传奇单机',
		name2: '传奇变态私服',
		name3: '传奇单机-关闭按钮',
		appid1: 'wx79ade44c39cefc7f',
		path1: '?chid=2068&subchid=CQLE_DJ',
		appid2: 'wxefe8997276c7a7d4',
		path2: '?from=1473',
	},
	beginGame(event) {
		var toAppid = event.currentTarget.dataset.appid;
		var toPath = event.currentTarget.dataset.path;
		var viewName = event.currentTarget.dataset.name;
		wx.navigateToMiniProgram({
			appId: toAppid,
			path: toPath,
			// envVersion: 'develop',
			success(res) {
				// 打开成功
			}
		})
		
		app.aldstat.sendEvent('点击', {
			'按钮点击统计': viewName
		})
	},
	music(){
		const innerAudioContext = wx.createInnerAudioContext();
		innerAudioContext.autoplay = true;
		innerAudioContext.loop = true;
		innerAudioContext.src = 'http://wawa.binglue.com/xiaochengxu/chuanqi/chuanqi.mp3?1';
		innerAudioContext.onPlay(() => {
			console.log('开始播放')
		})
		innerAudioContext.onError((res) => {
			console.log(res.errMsg)
			console.log(res.errCode)
		})
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		var that = this;

		

		wx.request({
			url: 'https://wawash.paopaoren.cn/api/xiaoyouxi/get_status',
			data: {
				game_id: game_id,
				version: version
			},
			method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
			// header: {}, // 设置请求的 header
			success: function (res) {
				if (res.data.data.status == 2) {
					that.setData({
						onlineStatus: true
					})
					that.music();
				}else{
					wx.showLoading({
						title: '加载中...',
						mask: true
					});
				}
			},
		})


		//列表
		wx.request({
			url: 'https://mini-gl.binglue.com/article/list',
			data: {
				id: apiId,
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
			data: {
				id: apiId
			},
			header: {
				'content-type': 'application/json' // 默认值
			},
			success: function (res) {
				let data = res.data.data;
				console.log(data)
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
		// wx.request({
		// 	url: 'https://mini-gl.binglue.com/ball/setting',
		// 	data: {
		// 		id: apiId
		// 	},
		// 	header: {
		// 		'content-type': 'application/json' // 默认值
		// 	},
		// 	success: function (res) {
		// 		let data = res.data;
		// 		console.log(data)
		// 		that.setData({
		// 			flexQrcodes: data.wx_qrcode
		// 		})
		// 	}
		// });


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
			title: '传奇单机',
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
				id: apiId,
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