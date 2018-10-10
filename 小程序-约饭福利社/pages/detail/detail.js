var WxParse = require('../../wxParse/wxParse.js')
var detailAPI = 'https://m.cht.tvhome.com?r=article/info&id=';
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		title: "",
		text: "",
		author: "",
		isFooter: false
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
				let data = res.data.data;
				// console.log(data)
				that.setData({
					title: decodeURIComponent(data.title),  //decodeURIComponent用来防止转发乱码
					source_type: decodeURIComponent(data.source_type),
					text: WxParse.wxParse('article', 'html', data.content, that, 15)
				})
				
				//尾部声明1.5秒后显示 避免进入页面直接看见
				setTimeout(()=>{
					that.setData({
						isFooter: true
					})
				},1500)
			}
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