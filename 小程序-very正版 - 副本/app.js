var aldstat = require("./utils/ald-stat.js");
var res = wx.getSystemInfoSync(); //获取设备信息
var path;
//app.js
App({
  onLaunch: function (options) {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

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
              var openid = res.data.openid //返回openid
              wx.setStorageSync('openid1', openid)
            }
          })
        }
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })

    // var appId = options.query.id;
    if (res.platform == "android") {
      if (options.scene === 1037) {
        this.jump(options);
      }
      // if(options.scene === 1007){
      //   this.jump(options,appId);
      // }
    }
  },
  onShow: function (options) {
    var appId = options.query.appid;
    var openid1 = options.query.openid1;
    //如果是小程序跳小程序
    if (res.platform == "ios") {
      if (options.scene === 1037) {
        this.jump(options);
      }
    }
    // 如果是分享卡片进入
    if (options.scene === 1007 || options.scene === 1008) {
      if(options.query.chid != '' && options.query.chid != undefined){
        path = `?chid=${options.query.chid}&subchid=${options.query.subchid}`;
      }else{
        path = "";
      }
      if (res.platform == "ios"){
        this.jump(options, appId);
      }
      if (res.platform == "android") {
        var value = wx.getStorageSync('flag')
        if (value == 'false') {
          wx.removeStorageSync('flag')
          return;
        } else {
          this.jump(options, appId);
        }
      }
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
                var openid2 = res.data.openid //返回openid
                // console.log("openid1" + " " + openid1);
                // console.log("openid2" + " " + openid2);
                // 统计
                wx.request({
                  url: 'https://mini-gl.binglue.com/share/save',
                  data: {
                    openid: openid1,
                    openid2: openid2
                  },
                  method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
                  success: function(res){
                    // success
                  },
                  fail: function() {
                    // fail
                  },
                  complete: function() {
                    // complete
                  }
                })

              }
            })
          }
        }
      })
    }

    // Do something initial when launch.
  },
  jump(options, appId = '') {
    var toAppId;
    if (appId == '') {
      toAppId = options.referrerInfo.extraData.appid;
    } else {
      toAppId = appId;
      wx.setStorageSync('flag', 'false')
    }

    if(path == ''){
      wx.navigateToMiniProgram({
        appId: toAppId,
        // envVersion: 'develop',
        success(res) {
          // 打开成功
        }
      })
    }else{
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