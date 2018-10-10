let API_HOST = "https://m.cht.tvhome.com/index.php?r=article/list";
let DEBUG = true;//切换数据入口
var Mock = require('mock-min.js')
function ajax(data = '', fn, method = "get", header = {}) {
	if (!DEBUG) {
		wx.request({
			url: API_HOST,
			method: method ? method : 'get',
			data: {},
			header: header ? header : { "Content-Type": "application/json" },
			success: function (res) {
				fn(res);
				console.log(res)
			}
		});
	} else {
		// 模拟数据
		var res = Mock.mock({
			'error_code': '',
			'error_msg': '',
			'data|5': [{
				'title': '@ctitle(10,28)',
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
				'detailText': '<div style="color:red">我是<br>HTML代码</div>'
			}]
		})
		// 输出结果
		// console.log(JSON.stringify(res, null, 2));
		fn(res);
	}
}
module.exports = {
	ajax: ajax
}