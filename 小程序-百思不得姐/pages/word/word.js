Page({
	data: {
		list: [],
		maxtime: '',
		loadingHidden: false
	},
	onLoad: function (options) {
		// 页面初始化 options为页面跳转所带来的参数
		//加载最新
		this.requestData('newlist');
		wx.getSystemInfo({
			success: (res) => { // 用这种方法调用，this指向Page
				this.setData({
					winH: res.windowHeight
				});
			}
		});
	},

	/**
	 * 上拉刷新
	 */
	bindscrolltoupper: function () {
		console.log('到顶部')
		//加载最新
		this.requestData('newlist');
	},

	/**
	 * 加载更多
	 */
	bindscrolltolower: function () {
		console.log('到底部')
		//加载更多
		this.requestData('list');
	},

	/**
	 * 请求数据
	 */
	requestData: function (a) {
		var that = this;
		console.log(that.data.maxtime)
		wx.request({
			url: 'https://api.budejie.com/api/api_open.php',
			data: {
				a: a,
				c: 'data',
				maxtime: that.data.maxtime,
				type: '29',
			},
			method: 'GET',
			success: function (res) {
				console.log(res)
				console.log('上一页', that.data.list)
				that.setData({
					// 拼接数组
					list: that.data.list.concat(res.data.list),
					loadingHidden: true,
					maxtime: res.data.info.maxtime
				})

			}
		})
	},
	onReady: function () {
		// 页面渲染完成
	},
	onShow: function () {
		// 页面显示
	},
	onHide: function () {
		// 页面隐藏
	},
	onUnload: function () {
		// 页面关闭
	}
})