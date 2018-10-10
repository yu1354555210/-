let API_HOST = "http://xxx.com/xxx";
let DEBUG = true;//切换数据入口
var Mock = require('mock-min.js')
function ajax(data = '', fn, method = "get", header = {}) {
	if (!DEBUG) {
		wx.request({
			url: config.API_HOST + data,
			method: method ? method : 'get',
			data: {},
			header: header ? header : { "Content-Type": "application/json" },
			success: function (res) {
				fn(res);
			}
		});
	} else {
		// 模拟数据
		var res = Mock.mock({
			'error_code': '',
			'error_msg': '',
			'data|5': [{
				'id|+1': 1,
				'name': '@cname()',
				'time': '@time(H:m)',
				'text': '@csentence(4)'
			}],
			'serviceList': [
				{'text':'微信','value':'wx'},
				{'text':'QQ','value':'qq'}
			],
			'gradeList': [
				{ 'text': '王者21-30星', 'value': '1' },
				{ 'text': '王者11-20星', 'value': '2' },
				{ 'text': '王者0-10星', 'value': '3' },
				{ 'text': '至尊星耀', 'value': '4' },
				{ 'text': '永恒钻石', 'value': '5' },
				{ 'text': '尊贵铂金', 'value': '6' },
				{ 'text': '荣耀黄金', 'value': '7' },
				{ 'text': '秩序白银', 'value': '8' },
				{ 'text': '倔强青铜', 'value': '9' }
			]
		})
		// 输出结果
		// console.log(JSON.stringify(res, null, 2))
		fn(res);
	}
}
module.exports = {
	ajax: ajax
}