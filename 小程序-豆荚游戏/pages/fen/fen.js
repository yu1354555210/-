Page({

  /**
   * 页面的初始数据
   */
  data: {
    btnList: '',
    openid: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
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
            success: res => {
              var openid = res.data.openid //返回openid
              this.setData({
                openid: openid
              })
            }
          })
        }
      }
    })
    wx.request({
      url: 'https://mini-gl.binglue.com/share/list',
      data: {
        page: 1
      },
      method: 'GET',
      success: res => {
        if (res.data.code == 1) {
          this.setData({
            btnList: res.data.data
          })
        }
      }
    });

  },

  clip(){
    wx.setClipboardData({
      data: this.data.openid,
      success: function(res) {
        wx.getClipboardData({
          success: function(res) {
            // console.log(res.data) // data
          }
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },
  

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      var data = res.target.dataset;
      var openid1 = this.data.openid;
      // 来自页面内转发按钮
      if (data.path == "" || data.path == undefined || data.path == 'undefined') {
        return {
          title: data.dec,
          path: "pages/list/list?openid1=" + openid1 + "&appid=" + data.appid + "&id=" + data.id,
          imageUrl: data.img,
          success: function (res) {
            // 转发成功
          },
          fail: function (res) {
            // 转发失败
          }
        }
      } else {
        return {
          title: data.dec,
          path: "pages/list/list" + data.path + "&openid1=" + openid1 + "&appid=" + data.appid + "&id=" + data.id,
          imageUrl: data.img,
          success: function (res) {
            // 转发成功
          },
          fail: function (res) {
            // 转发失败
          }
        }
      }

    }

    return {
      title: 'fen',
      path: '/pages/fen/fen',
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
})