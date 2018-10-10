// pages/zhifuchenggong/zhifuchenggong.js
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		clock: ''
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		count_down(this);
		wx.setStorage({
			key: "key",
			data: "value"
		})
	},
	onReady: function (res) {
		this.videoContext = wx.createVideoContext('myVideo')
	},
	inputValue: '',
	bindInputBlur: function (e) {
		this.inputValue = e.detail.value
	},
	bindSendDanmu: function () {
		this.videoContext.sendDanmu({
			text: this.inputValue,
			color: getRandomColor()
		})
	},
	onShareAppMessage: function (res) {
		console.log(res)
		if (res.from === 'button') {
			// 来自页面内转发按钮
			console.log(res.target)
		}
		return {
			title: '王者试练场',
			path: '/pages/zhifuchenggong/zhifuchenggong',
			imageUrl: 'https://ss0.baidu.com/6ONWsjip0QIZ8tyhnq/it/u=3178933941,460287815&fm=58',
			success: function (res) {
				console.log('成功')
			},
			fail: function (res) {
				console.log('失败')
			}
		}
	}
})
var total_micro_second = 300 * 1000;
function count_down(that) {
	// 渲染倒计时时钟
	that.setData({
		clock: date_format(total_micro_second)
	});
	if (total_micro_second <= 0) {
		that.setData({
			clock: "已经截止"
		});
		// timeout则跳出递归
		return;
	}
	setTimeout(function () {
		// 放在最后--
		total_micro_second -= 10;
		count_down(that);
	}
		, 10)
}

function date_format(micro_second) {
	// 秒数
	var second = Math.floor(micro_second / 1000);
	// 小时位
	var hr = Math.floor(second / 3600);
	// 分钟位
	var min = fill_zero_prefix(Math.floor((second - hr * 3600) / 60));
	// 秒位
	var sec = fill_zero_prefix((second - hr * 3600 - min * 60));// equal to => var sec = second % 60;
	// 毫秒位，保留2位
	var micro_sec = fill_zero_prefix(Math.floor((micro_second % 1000) / 10));
	return min + ":" + sec;
	// return hr + ":" + min + ":" + sec + " " + micro_sec;
}


function fill_zero_prefix(num) {
	return num < 10 ? "0" + num : num
}

function getRandomColor() {
	var rgb = [];
	for (var i = 0; i < 3; i++) {
		var color = Math.floor(Math.random() * 256).toString(16);
		color = color.length == 1 ? '0' + color : color;
		rgb.push(color)
	}
	console.log(rgb)
	return '#' + rgb.join("");
}