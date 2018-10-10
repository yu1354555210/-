var WxParse = require('../../wxParse/wxParse.js')
var detailAPI = 'https://mini-gl.binglue.com/article/content?id=';
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		title: "",
		text: "",
		author: "",
		ctime: "",
		isFooter: false,
		wx_qrcode: [],
		game_title: "",
		icon: "",
		isFloatShow: true,
		appid: "",
		path: "",
		extra: ""
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

		setTimeout(function () {
			wx.hideLoading()
		}, 1000);

		wx.request({
			url: detailAPI + options.url,
			header: {
				'content-type': 'application/json' // 默认值
			},
			success: function (res) {
				let data = res.data;
				console.log(data)
				WxParse.wxParse('article', 'html', data.content, that, 15);
				that.setData({
					title: decodeURIComponent(data.title), //decodeURIComponent用来防止转发乱码
					source_type: decodeURIComponent(data.source_type),
					ctime: decodeURIComponent(data.create_time),
					wx_qrcode: data.wx_qrcode || "",
					game_title: decodeURIComponent(data.game_title) || "",
					icon: decodeURIComponent(data.icon) || "",
					appid: data.wx_appid,
					path: data.wx_path,
					extra: data.wx_extra
				})
				if(that.data.game_title == "" || that.data.game_title == "undefined"){
					that.setData({
						isFloatShow: false
					})
				}
			}
		})
	},
	previewImage: function (e) {
		wx.previewImage({
			urls: this.data.wx_qrcode
		})
	},
	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function (res) {
		// console.log(res)
		if (res.from === 'button') {
			// 来自页面内转发按钮
			console.log("来自页面内转发按钮")
		}
		return {
			title: this.data.title,
			// path: '/pages/detail/detail',
			success: function (res) {
				// console.log("转发成功")
				// 转发成功
			},
			fail: function (res) {
				console.log("转发失败")
				// 转发失败
			}
		}
	}
})