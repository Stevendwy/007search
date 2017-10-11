//index.js
//获取应用实例
var mdfive = require('../../utils/md5.js') ;
var util = require('../../utils/util.js')
const app = getApp()

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),

    selectid:-1,
    branddata: {} 
  },
  setSelectid(e){
    let _id = e.currentTarget.dataset.id
    this.setData({
      selectid: _id
    })
  },
  randomWord(randomFlag, min, max) {
    let str = "";
    let  range = min;
    let  arr =['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

    // 随机产生
    if(randomFlag) {
      range = Math.round(Math.random() * (max - min)) + min;
    }
  for (let i = 0; i<range; i++) {
    let pos = Math.round(Math.random() * (arr.length - 1));
    str += arr[pos];
  }
  return str;
},
  payBtn(){
    let _selectid = this.data.selectid
    if (_selectid==-1){
      console.log("wrong")
      wx.showToast({
        title: '请选择购买种类',
        icon: 'loading',
        duration: 1000
      })
      setTimeout(function () {
        wx.hideToast()
      }, 1000)
    }else{
      var that = this
      let _usercode = getApp().globalData.usercode; 
      console.log(_usercode)
      //统一支付
          let _obj = util.headAdd("/pays/wx")
            _obj.type = _selectid,
            _obj.device = 'pc'
          // var pay = res.data
          // //发起支付
          // var timeStamp = pay[0].timeStamp;
          // var packages = pay[0].package;
          // var paySign = pay[0].paySign;
          // var nonceStr = pay[0].nonceStr;
          // var param = { "timeStamp": timeStamp, "package": packages, "paySign": paySign, "signType": "MD5", "nonceStr": nonceStr };
          wx.request({
            url: "https://beta.007vin.com/pays/wx",
            data: _obj,
            method: 'POST',
            header: {
              'Cookie': 'language="languageCode=zh-CN"; real_ip="2|1:0|10:1506664524|7:real_ip|16:NTkuNjMuMjQ4LjQy|32f5eb64daa034d6ff44b438a752d6d4b13f907de38bd943f84bcfe5bfb86ee8"; JSESSIONID=30dd4292eb8fe1bf0461227588f0cbe4; SessionId="2|1:0|10:1506664524|9:SessionId|20:IjE1MDY2NjQ1MjQuNjIi|e3cecc00fd283be16c9c33a8ac9597aa1e5dbb47a86041fca1150700825c4b37"; Authorization="2|1:0|10:1506664524|13:Authorization|20:IjE4MzM3MTI1OTg3Ig==|4997ff325afd75914c06f99390e89c25ddcf750afa29985a2511770e457471c4"', "Content-Type": "application/x-www-form-urlencoded"},
            success: function (resp) {
              console.log(resp)
            }}
          )
            // that.pay()
    }
  },
  /* 支付   */
  pay: function () {
    console.log("支付")
    let _noncestr = this.randomWord(false,31);
    let _timestamp = ""+Date.parse(new Date())+"";
    wx.requestPayment(
      {
        'timeStamp': _timestamp,
        'nonceStr': _noncestr,
        'package': 'prepay_id=wx20170613225827f7b3ae0eb50671866580',
        'signType': 'MD5',
        'paySign': '66469A4C01431A4FCED2E7E78449B44A',
        'success': function (res) { 
          console.log("aaa")
          console.log(res)
        },
        'fail': function (res) { 
          console.log("bbb")
        },
        'complete': function (res) {
          console.log("ccc")
         }
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
    // https://007vin.com/order/commodity
    let that = this
    let _obj = util.headAdd("/order/commodity")
    wx.request({
      url: 'https://beta.007vin.com/order/commodity',
      data: _obj,
      method: 'get',
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      success: function (res) {
        // console.log(res)
        that.setData({
          branddata:res.data
        })
      }})
  },
  getUserInfo: function(e) {
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
