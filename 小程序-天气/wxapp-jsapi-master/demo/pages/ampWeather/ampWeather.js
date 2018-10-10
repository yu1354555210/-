var amapFile = require('../../libs/amap-wx.js');//如：..­/..­/libs/amap-wx.js
// var hfkey2= "dee84c3b595042eaa46bc189b1ae2192";
var hfkey = "bff5cc9bcfdf46b0a0e9bf0c260ff14f"; //这个有权限
// pages/ampWeather/ampWeather.js
var markersData = [];
Page({
	data: {
		addressIp: "auto_ip",
		city: "", //城市
		district: "", //区域
		street: "", //街道
		qlty: "", //空气质量
		aqi: "", //空气指数
		condTxt: "", //天气描述
		windSc: "", //风向
		windDir: "", //风力
		otherDayList: [], //3天天气预报
		hourlyArr: [], //小时天气预报,
		lifeList: []
	},
	onLoad: function () {
		var that = this;
		that.getData();
	},

	getData: function () {
		var that = this;
		var myAmapFun = new amapFile.AMapWX({ key: '4c3a99185a9f960e8faeeeea1c049e70' });
		myAmapFun.getRegeo({
			success: function (data) {
				var posData = data[0].regeocodeData.addressComponent;
				var district = posData.district;
				var city = posData.city;
				var street = posData.streetNumber.street;
				var desc = data[0].desc;

				that.setData({
					city: `${district} ${street}`,
					loadingHidden: true
				})

				// console.log(`${city}${district}${desc}`)

			},
			fail: function (info) {
				console.log(info)
			}
		});

		//天气接口
		wx.request({
			url: 'https://free-api.heweather.com/s6/weather?parameters',
			data: {
				location: this.data.addressIp,
				key: hfkey
			},
			success: function (res) {
				var theData = res.data.HeWeather6[0];
				var life = theData.lifestyle;
				console.log(theData)
				that.setData({
					tmp: theData.now.tmp,
					condTxt: theData.now.cond_txt,
					windSc: theData.now.wind_sc,
					windDir: theData.now.wind_dir,
					otherDayList: theData.daily_forecast,
					hourlyArr: theData.hourly,
					lifeList: life
				});
			}
		});

		//获取空气质量
		wx.request({
			url: 'https://free-api.heweather.com/s6/air/now?parameters',
			data: {
				location: this.data.addressIp,
				key: hfkey
			},
			success: function (res) {
				that.setData({
					qlty: res.data.HeWeather6[0].air_now_city.qlty, //空气质量
					aqi: res.data.HeWeather6[0].air_now_city.aqi //空气指数
				});
			}
		});
	},

	//高德获取具体位置
	changeAddress: function () {
		this.setData({
			addressIp: "116.40,39.9"
		})
		wx.request({
			url: 'https://free-api.heweather.com/s6/weather/forecast?parameters',
			data: {
				location: this.data.addressIp,
				key: "dee84c3b595042eaa46bc189b1ae2192"
			},
			success: function (res) {
				console.log(res.data)
			}
		});
	}

})
