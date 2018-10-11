var aldstat = require("./utils/ald-stat.js");
var system = wx.getSystemInfoSync(); //获取设备信息
//app.js
App({
  onLaunch: function (options) {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    if (system.platform == "android") {
      if (options.scene === 1037) {
        this.jump(options);
      }
    }
  },
  onShow: function (options) {
    let allGameArray = {};
    var appId = options.query.appid;
    var openid1 = options.query.openid1;
    var _this = this;
    if (system.platform == "ios") {
      //如果是小程序跳小程序
      if (options.scene === 1037) {
        this.jump(options);
      }
    }
    //如果是公众号自定义菜单进入
    console.log(options.scene)
    if(options.scene === 1035 || options.scene === 1074){
      var cdid = options.query.cdid;
      console.log(cdid)
      if (system.platform == "ios") {
        this.jump(options, cdid);
      }
      if (system.platform == "android") {
        var value = wx.getStorageSync('flag')
        if (value == 'false') {
          wx.removeStorageSync('flag')
          return;
        } else {
          this.jump(options, cdid);
        }
      }
    }
    // 如果是分享卡片进入
    if (options.scene === 1007 || options.scene === 1008) {
      wx.request({
        url: 'https://mini-gl.binglue.com/dh2/index',
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: res => {
          if (res.data.code === 1) {
            let cateArray = res.data.catetory;
            for (let i in cateArray) {
              let gameList = cateArray[i].games;
              for (let game of gameList) {
                if (game.wx_appid) {
                  allGameArray[game.wx_appid] = game;
                }
              }
            }
            //找到地址中appid相等的一条数据
            if (allGameArray[appId]) {
              var path = allGameArray[appId].wx_path;
              if (system.platform == "ios") {
                _this.jump(options, appId, path);
              }
              if (system.platform == "android") {
                var value = wx.getStorageSync('flag')
                if (value == 'false') {
                  wx.removeStorageSync('flag')
                  return;
                } else {
                  _this.jump(options, appId, path);
                }
              }
            }
          }
        }
      });

      // 登录
      wx.login({
        success: res => {
          let code = res.code;
          if (res.code) {
            // 发送 res.code 到后台换取 openId, sessionKey, unionId
            wx.request({
              url: 'https://mini-gl.binglue.com/share/openid?code=' + code,
              header: {
                'content-type': 'application/json'
              },
              // method: 'post',
              success: function (res) {
                var openid2 = res.data.openid; //返回openid
                var id = options.query.id;
                // 统计
                if(openid1 !== openid2 && openid1 != undefined){
                  wx.request({
                    url: 'https://mini-gl.binglue.com/share/save',
                    data: {
                      openid: openid1,
                      openid2: openid2,
                      id: id
                    },
                    method: 'GET',
                    success: function (res) {
                      // console.log("登录后的"+openid1);
                      // console.log('openid1'+' '+openid1)
                      // console.log('openid2'+' '+openid2)
                    }
                  })
                }

              }
            })
          }
        }
      })
    }
  },
  jump(options, appId = '', path = '') {
    var toAppId;
    if (appId == '') {
      toAppId = options.referrerInfo.extraData.appid;
    } else {
      toAppId = appId;
      wx.setStorageSync('flag', 'false')
    }

    if (path == '') {
      wx.navigateToMiniProgram({
        appId: toAppId,
        // envVersion: 'develop',
        success(res) {
          // 打开成功
        }
      })
    } else {
      wx.navigateToMiniProgram({
        appId: toAppId,
        path: path,
        // envVersion: 'develop',
        success(res) {
          // 打开成功
        }
      })
    }
  },

  globalData: {
    userInfo: null
  }
})