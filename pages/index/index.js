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
    history: [],
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
      inputclear: s_show,
    })
    // that.setData({
    //   savehistory: _savehistory,
    //   history: _savehistory,
      
    // })
  },

  inputClear: function () {
    this.setData({
      inputdata: "",
      inputclear:false
    })
  },
  goSearch: function (e) {
    // let search_input = this.data.inputdata.replace(/\W/g, "")
    let search_input = this.data.inputdata
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
    let _obj = util.headAdd("/parts/search")
        _obj.parts = search_input
    wx.request({
      url: 'https://beta.007vin.com/parts/search',
      data: _obj,
      method: 'post',
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      success: function (res) {
        if (res.data.data[0].status == 0 || res.data.code == 6){
          wx.showToast({
            title: '无此零件信息',
            icon: 'loading',
            duration: 1000
          })
          setTimeout(function () {
            wx.hideToast()
          }, 1000)
        }else{
          let _savehistory = that.data.savehistory
          let ishav = _savehistory.indexOf(search_input)
          if (ishav == -1) {
            _savehistory.unshift(search_input)
            if (_savehistory.length > 5) {
              _savehistory = _savehistory.slice(0, 5)
            }
            wx.setStorage({
              key: 'savehistory',
              data: _savehistory
            });
          }
          that.setData({
            savehistory: _savehistory,
            history: _savehistory,
            input_focus: false
          })
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
    },()=>{
      this.goSearch()
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

    wx.getClipboardData({
      success: function (res) {
        console.log(res.data)
        let _data = res.data
        var reg = new RegExp("^[A-Za-z0-9]+$")
        if (reg.test(_data)) {
          wx.showModal({
            title: '提示',
            content: '是否粘贴剪切板内容',
            success: function (ress) {
              if (ress.confirm) {
                that.setData({
                  input_focus: false,
                  inputdata: res.data,
                  inputclear: true
                }, () => {
                  that.goSearch()
                })
              } else {
                console.log('用户点击取消')
              }
            }
          })
        } 
      }
    })
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
