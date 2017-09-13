//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    imgsrc:"http://owindow.cn/007search/images/p_sign.png",
    input_focus:false,
    inputclear: false,
    inputdata:"",
    savehistory: [],
    history: ["95820102100－宝马", "95820102102－保时捷", "95820102103－保时捷", "95820102104－保时捷"],
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  // bindViewTap: function() {
  //   wx.navigateTo({
  //     url: '../logs/logs'
  //   })
  // },
  focusInputEvent: function (e) {  // input  获得焦点。 可填写内容
    this.setData({
      input_focus: true
    });
  },
  blurInputEvent:function(e){
    this.setData({
      input_focus: false
    });
  },
  inputchange: function (e) {
    let s_input = e.detail.value
    let s_show = e.detail.value.replace(/\W/g, "").length !=0 ? true : false
    this.setData({
      inputdata: s_input,
      inputclear: s_show
    })
  },

  inputClear: function () {
    this.setData({
      inputdata: "",
      inputclear:false
    })
  },
  goSearch: function (e) {
    let search_input = this.data.inputdata.replace(/\W/g, "")
    let that = this
    if (search_input.length < 1) {
      console.log("is kongge ")
      return
    }

    let _savehistory = this.data.savehistory
    let ishav = _savehistory.indexOf(search_input)
    if (ishav == -1) {
      this.data.savehistory.unshift(search_input)
      if (this.data.savehistory.length > 5) {
        this.data.savehistory = this.data.savehistory.slice(0, 5)
      }
      wx.setStorage({
        key: 'savehistory',
        data: this.data.savehistory
      });
    }
    that.setData({
      history: this.data.savehistory,
      input_focus: false
    })
    wx.navigateTo({
      url: '../resule/index',
    })
  },

  getpartnum: function (e) {
    let message = e.currentTarget.dataset.world
    // let _mess = message.split("－")
    // let newmun = _mess[0]
    // wx.navigateTo({
    //   url: '../resule/index',
    // })
    this.setData({
      history: this.data.savehistory,
      input_focus: false,
      inputdata:message,
      inputclear:true
    })
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }

  var that = this;
    wx.getStorage({
      key: 'savehistory',
      success: function (res) {
        let _data = res.data
        that.setData({
          history: _data,
          savehistory: _data
        });
      }
    });
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
