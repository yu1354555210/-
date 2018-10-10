// pages/importStars/importStars.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
	  starsList: [{
		  stars: [0, 1, 2, 3, 4],
		  starDefault: "https://api-yxdl.binglue.com/img/star.png",
		  starActive: "https://api-yxdl.binglue.com/img/star-on.png",
		  key: 0
	  }]
  },
  selectStar: function (e) {

	  var key = e.currentTarget.dataset.key;
	  var dataKey = this.data.starsList[0].key;
	  var todo = "starsList[0].key";

	  if (dataKey == 1 && key == 1) {
		  key = 0
	  }
	  this.setData({
		  [todo]: key
	  })
	  console.log(key + " " + dataKey)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
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
  
  }
})