var app = getApp()
var apiUrl = "https://mini-gl.binglue.com/dh2/index";
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		list: "",
		recommend: "",
		id: "",
		indicatorDots: true,
		indicatorColor: '#fff',
		indicatorActiveColor: '#d2d2d2',
		autoplay: true,
		interval: 6000,
		duration: 500,
		focusImgs: "",
		swiperCurrent: 0,
		ads: "",
		focusQrcodes: [],
		shareArr: [{
			title: "小时后玩过的游戏虽然简单，但真有意思",
			shareImg: "/images/share_img4.jpg"
		}, {
			title: "你的21个好友都在玩的游戏，就差你了",
			shareImg: "/images/share_img5.jpg"
		}, {
			title: "这是在玩什么游戏？求加入",
			shareImg: "/images/share_img2.jpg"
		}, {
			title: "美女夜店归来，游戏没玩够，还想接着玩",
			shareImg: "/images/share_img1.jpg"
		}, {
			title: "这游戏太低俗了吧，不过我喜欢",
			shareImg: "/images/share_img3.jpg"
		}]
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

		this.getData();
	},
	getData() {
		//列表
		var that = this;
		wx.request({
			url: apiUrl,
			header: {
				'content-type': 'application/json' // 默认值
			},
			success: function (res) {
				if (res.data.code === 1) {
					that.setData({
						list: res.data.catetory,
						focusImgs: res.data.focus,
						ads: res.data.ads
					});

					if (that.data.focusImgs.length == 1) {
						that.setData({
							indicatorDots: false,
						})
					}

					setTimeout(function () {
						wx.hideLoading()
					}, 500);
				}
			}
		});
	},
	//下拉刷新
	onPullDownRefresh: function () {
		wx.showNavigationBarLoading() //在标题栏中显示加载
		//模拟加载
		setTimeout(() => {
			this.getData();
			this.setData({
				swiperCurrent: 0
			})
			// complete
			wx.hideNavigationBarLoading() //完成停止加载
			wx.stopPullDownRefresh() //停止下拉刷新
		}, 1500);
	},
	focusPreviewImage: function (e) {
		var viewImg = e.currentTarget.dataset.src;
		var wxAppid = e.currentTarget.dataset.appid;
		var viewTitle = e.currentTarget.dataset.title;
		let viewPath = e.currentTarget.dataset.path;
		if (e.currentTarget.dataset.appid == "" || e.currentTarget.dataset.appid == undefined) {
			wx.previewImage({
				urls: viewImg
			})
		} else {
			if(viewPath == undefined || viewPath == 'undefined' || viewPath == ''){
				wx.navigateToMiniProgram({
					appId: wxAppid,
					success(res) {
					}
				})
			}else{
				wx.navigateToMiniProgram({
					appId: wxAppid,
					path: viewPath,
					success(res) {
					}
				})
			}
		}
		app.aldstat.sendEvent('点击', {
			'游戏点击统计-焦点图': viewTitle
		})
	},
	listPreviewImage: function (e) {
		let wxAppid = e.currentTarget.dataset.appid;
		let viewTitle = e.currentTarget.dataset.title;
		let viewImg = e.currentTarget.dataset.img;
		let viewAd = e.currentTarget.dataset.ad;
		let viewPath = e.currentTarget.dataset.path;
		if (wxAppid == "" || wxAppid == undefined) {
			wx.previewImage({
				urls: viewImg
			})
		} else {
			if(viewPath == undefined || viewPath == 'undefined' || viewPath == ''){
				wx.navigateToMiniProgram({
					appId: wxAppid,
					success(res) {
						// console.log("无path")
					}
				})
			}else{
				wx.navigateToMiniProgram({
					appId: wxAppid,
					path: viewPath,
					success(res) {
						// console.log("有path")
					}
				})
			}
		}

		// 阿拉丁统计
		if(viewAd == "广告"){
			app.aldstat.sendEvent('点击', {
				'游戏点击统计-广告位': viewTitle
			})
		}else{
			app.aldstat.sendEvent('点击', {
				'游戏点击统计': viewTitle
			})
		}
	},
	onShareAppMessage: function (res) {

		var shareArr = this.data.shareArr;

		let shareIndex = Math.floor((Math.random() * shareArr.length));
		
		if (res.from === 'button') {
			// 来自页面内转发按钮
			console.log(res.target)
		}

		return {
			title: shareArr[shareIndex].title,
			imageUrl: shareArr[shareIndex].shareImg,
			path: '/pages/list/list'
		}
	},
})