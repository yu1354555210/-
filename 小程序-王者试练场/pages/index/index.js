var app = getApp()
var API = require('../../utils/api.js')
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		isHideLoadMore: true,
		scrollHeight: 300
			
	},
	selectStar: function (e) {
		
		var key = e.currentTarget.dataset.key;
		var dataKey = this.data.starsList[0].key;
		var todo = "starsList[0].key";
		
		if (dataKey == 1 && key == 1) {
			key = 0
		}
		this.setData({
			[todo] : key
		})
		console.log(key + " " + dataKey)
	},
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		var that = this;
		API.ajax('', function (res) {
			//   console.log(res)
			that.setData({
				list: res.data
			})
		});
	},

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function () {
		
	},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function () {
		var that = this;
		wx.getSystemInfo({ //获取系统信息
			success: function (res) {
				// console.log(res)
				var height = res.windowHeight;
				that.setData({
					scrollHeight: height+'px'
				});
			}
		})
	},

	/**
	 * 生命周期函数--监听页面隐藏
	 */
	onHide: function () {

	},

	/**
	 * 生命周期函数--监听页面卸载
	 */
	onUnload: function () {

	},

	/**
	 * 页面相关事件处理函数--监听用户下拉动作
	 */
	onPullDownRefresh: function () {
		wx.stopPullDownRefresh()
	},

	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom: function () {

	},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function () {

	},
	/**
	* 生命周期函数--监听页面加载
	*/
	scroll: function (e) {
		// console.log(e)
	},
	lower: function (e) {
		console.log('到底啦')
	},
})