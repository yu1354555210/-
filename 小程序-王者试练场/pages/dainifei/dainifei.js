var app = getApp()
var API = require('../../utils/api.js')
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		scrollHeight: 300,
		isCoupons: false,
		isFlyContent: true,
		activeServiceListIndex: 0, //选择区服
		activeGradeListIndex: 0, //选择段位
		isFlyGoInput: true, //显示微信还是QQ输入框
		multiArray: [['固定星级', '固定时段'], ['1星', '2星', '3星']],
		multiIndex: [0, 0, 0],
		pickerDetail: true,
		isTimeText: false,
		isStarText: false
	},

	/**
	   * 生命周期函数--监听页面加载
	   */
	onLoad: function (options) {
		var that = this;
		API.ajax('', function (res) {
			that.setData({
				list: res.serviceList,
				gradeList: res.gradeList
			})
		});
	},

	onReady: function(){
		
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
					scrollHeight: height + 200 + 'px'
				});
			},
		})
	},
	couponsIsShow: function () {
		this.setData({
			isCoupons: true,
			isFlyContent: false
		})
	},
	couponsIsHide: function(){
		this.setData({
			isCoupons: false,
			isFlyContent: true
		})
		
	},
	getServiceList: function (e) {
		this.setData({
			activeServiceListIndex: e.currentTarget.dataset.idx
		})
		if (e.currentTarget.dataset.value === 'qq') {
			this.setData({
				isFlyGoInput: false
			})
		} else {
			this.setData({
				isFlyGoInput: true
			})
		}
		// console.log(this.data.isFlyGoInput)
	},
	getGrateList: function (e) {
		// console.log(e.currentTarget.dataset.value)
		this.setData({
			activeGradeListIndex: e.currentTarget.dataset.idx
		})
	},
	bindMultiPickerChange: function (e) {
		console.log('picker发送选择改变，携带值为', e.detail.value)
		this.setData({
			multiIndex: e.detail.value,
			pickerDetail: false
		})

		if (e.detail.value[0] == 0){
			this.setData({
				isTimeText: false,
				isStarText: true
			})
		}else{
			this.setData({
				isStarText: false,
				isTimeText: true
			})
		}
	},
	bindMultiPickerColumnChange: function (e) {
		console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
		var data = {
			multiArray: this.data.multiArray,
			multiIndex: this.data.multiIndex
		};
		data.multiIndex[e.detail.column] = e.detail.value;
		switch (e.detail.column) {
			case 0:
				switch (data.multiIndex[0]) {
					case 0:
						data.multiArray[1] = ['1星', '2星', '3星'];
						break;
					case 1:
						data.multiArray[1] = ['1小时', '2小时', '3小时'];
						break;
				}
				data.multiIndex[1] = 0;
				data.multiIndex[2] = 0;
				break;
		}
		this.setData(data);
	},

})