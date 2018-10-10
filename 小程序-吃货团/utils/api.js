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
				'title': '@ctitle(3,8)',
				'text': '@cparagraph(3)',
				'img': [
					{
						src: "@image('200x100', '#4A7BF7','#fff','pic')"
					},
					{
						src: "@image('200x100', '#000','#fff','pic')"
					},
					{
						src: "@image('200x100', '#f00','#fff','pic')"
					}
				],
				'detailText': '@cparagraph(10)'
			}]
		})
		// 输出结果
		// console.log(JSON.stringify(res, null, 2))
		fn(res);
	}
}
module.exports = {
	ajax: ajax
}