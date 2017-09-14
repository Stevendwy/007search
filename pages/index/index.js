//index.js
//获取应用实例
var mdfive = require('../../utils/md5.js') ;
var util = require('../../utils/util.js')
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
      wx.showToast({
        title: '请输入零件号',
        icon: 'loading',
        duration: 1000
      })

      setTimeout(function () {
        wx.hideToast()
      }, 1000)
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
    let _obj = util.headAdd("/parts/search")
        _obj.parts = search_input
    wx.request({
      url: 'https://beta.007vin.com/parts/search',
      data: _obj,
      method: 'post',
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      success: function (res) {
        if (res.data.data[0].status == 0){
          wx.showToast({
            title: '无此零件信息',
            icon: 'loading',
            duration: 1000
          })

          setTimeout(function () {
            wx.hideToast()
          }, 1000)
        }else{
          wx.navigateTo({
            url: '../resule/index?fortdata=' + res.data.brand + "&pid=" + search_input ,
          })
        }       
      }
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
