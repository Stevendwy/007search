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
    canIUse: wx.canIUse('button.open-type.getUserInfo'),

    selectid:-1,
    branddata: {
      "msg": "",
      "code": 1,
      "data": [
        {
          "data": [
            {
              "id": 13,
              "contents": [
                "试用全部品牌",
                "当日",
                "¥ 10.0"
              ],
              "showHot": false
            }
          ],
          "title": "试用一天"
        },
        {
          "data": [
            {
              "id": 14,
              "contents": [
                "全部品牌",
                "一年",
                "¥ 2800.0"
              ],
              "showHot": true
            }
          ],
          "title": "一年全品牌"
        },
        {
          "data": [
            {
              "id": 16,
              "contents": [
                "大众、奥迪、斯柯达、西雅特",
                "一年",
                "¥ 1800.0"
              ],
              "showHot": false
            },
            {
              "id": 18,
              "contents": [
                "大众、斯柯达、西雅特",
                "一年",
                "¥ 1500.0"
              ],
              "showHot": false
            },
            {
              "id": 19,
              "contents": [
                "奥迪",
                "一年",
                "¥ 1500.0"
              ],
              "showHot": false
            },
            {
              "id": 24,
              "contents": [
                "兰博基尼",
                "一年",
                "¥ 1500.0"
              ],
              "showHot": false
            },
            {
              "id": 25,
              "contents": [
                "宾利",
                "一年",
                "¥ 1000.0"
              ],
              "showHot": false
            },
            {
              "id": 23,
              "contents": [
                "保时捷",
                "一年",
                "¥ 900.0"
              ],
              "showHot": false
            },
            {
              "id": 26,
              "contents": [
                "斯柯达",
                "一年",
                "¥ 600.0"
              ],
              "showHot": false
            }
          ],
          "title": "大众集团"
        },
        {
          "data": [
            {
              "id": 27,
              "contents": [
                "劳斯莱斯",
                "一年",
                "¥ 500.0"
              ],
              "showHot": false
            },
            {
              "id": 21,
              "contents": [
                "宝马、MINI",
                "一年",
                "¥ 100.0"
              ],
              "showHot": false
            }
          ],
          "title": "宝马集团"
        },
        {
          "data": [
            {
              "id": 20,
              "contents": [
                "奔驰、Smart",
                "一年",
                "¥ 200.0"
              ],
              "showHot": false
            }
          ],
          "title": "戴姆勒集团"
        },
        {
          "data": [
            {
              "id": 17,
              "contents": [
                "玛莎拉蒂",
                "一年",
                "¥ 2000.0"
              ],
              "showHot": false
            },
            {
              "id": 28,
              "contents": [
                "法拉利",
                "一年",
                "¥ 1500.0"
              ],
              "showHot": false
            }
          ],
          "title": "菲亚特集团"
        },
        {
          "data": [
            {
              "id": 15,
              "contents": [
                "路虎",
                "一年",
                "¥ 2000.0"
              ],
              "showHot": false
            },
            {
              "id": 29,
              "contents": [
                "捷豹",
                "一年",
                "¥ 1000.0"
              ],
              "showHot": false
            }
          ],
          "title": "塔塔集团"
        },
        {
          "data": [
            {
              "id": 30,
              "contents": [
                "丰田",
                "一年",
                "¥ 200.0"
              ],
              "showHot": false
            },
            {
              "id": 31,
              "contents": [
                "雷克萨斯",
                "一年",
                "¥ 200.0"
              ],
              "showHot": false
            }
          ],
          "title": "丰田集团"
        },
        {
          "data": [
            {
              "id": 22,
              "contents": [
                "沃尔沃",
                "一年",
                "¥ 1000.0"
              ],
              "showHot": false
            }
          ],
          "title": "吉利集团"
        }
      ],
      "time": 1506395298
    }
  },
  setSelectid(e){
    let _id = e.currentTarget.dataset.id
    this.setData({
      selectid: _id
    })
  },
  payBtn(){
    let _selectid = this.data.selectid
    if (_selectid==-1){
      console.log("wrong")
    }
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
  // var that = this;
  //   wx.getStorage({
  //     key: 'savehistory',
  //     success: function (res) {
  //       let _data = res.data
  //       that.setData({
  //         history: _data,
  //         savehistory: _data
  //       });
  //     }
  //   });
  },
  getUserInfo: function(e) {
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
