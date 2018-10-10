// pages/stars/stars.js
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		stars: [0, 1, 2, 3, 4],
		starDefault: "https://api-yxdl.binglue.com/img/star.png",
		starActive: "https://api-yxdl.binglue.com/img/star-on.png",
		key: 0
	},
	selectStar: function (e) {

		var key = e.currentTarget.dataset.key;
		var dataKey = this.data.key;

		if (dataKey == 1 && key == 1) {
			key = 0
		}
		this.setData({
			key : key
		})
		console.log(key + " " + dataKey)
	}
	
})