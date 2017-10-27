// pages/resule/index.js
var Bmob = require('../../utils/bmob.js');
var mdfive = require('../../utils/md5.js');
var util = require('../../utils/util.js')
var sellData = require('../../locationdata/sellmarket.js')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sellmarket: sellData, //供货市场
    selllefttitle: ["库存", "供应商","联系电话"],
    sellrightlist: ["remark", "name","phone"],

    buymarket: [], //需求市场
    buylefttitle: ["客户", "需求", "联系电话"],
    buyrightlist: ["name", "pid", "phone"],

    userInfo: {},
    hasUserInfo: false,

    brandlist:[],
    storebrand:"",
    clickindex:0,
    clickid: ["gomessage", "goprice", "goreplace", "gomodule","goteach","gotechnology"],

    dataMes:[],
    dataPrice:[],
    dataReplace:[],
    dataModule:[],
    dataTeach:[],
    dataTechnology:[],

    leftlist: ["零件类型:", "厂家:", "说明:", "地区:", "库存:", "销售价:","供货商:"],
    rightlist: ["parttype", "mill", "remark", "location", "amount", "prices", "supplier"],

    replacelist: ["品牌:", "零件号:", "车型:", "件数:", "型号:", "参考价格:"],
    replacerightlist: ["brandcn", "pid", "ptype", "counts", "lable", "prices"],

    modulelist: ["位置:", "零件号:", "名称:", "型号:", "备注:", "件数:"],
    modulerightlist: ["id", "pid", "label", "model", "remark", "num"],

    technologylist: ["车型:", "市场:", "年份:","零件组:"],
    technologyrightlist: ["cars_model", "market", "year", "group_name"],

    toView: "gomessage",
    headlist: [],
    logoimg:"",
    imgbrand:"",  //品牌图片
    imgbottom: "../../images/p_img.png",
    
    input_focus: true,
    inputclear: false,
    inputdata: "",
    savehistory: ["95820102100", "64319313519", "24007621038", "12317605061","12317605478"],
    history: ["95820102100", "64319313519", "24007621038", "12317605061","12317605478"],

    searched:false,
    getresult:false,
    manybrand:false,
  },
  inputchange: function (e) {
    let s_input = e.detail.value.replace(/[^a-zA-Z0-9]/g, '').toLocaleUpperCase()
    let s_show = e.detail.value.replace(/\W/g, "").length != 0 ? true : false
    this.setData({
      inputdata: s_input,
      inputclear: s_show,
    })
    if (s_show == false){
      this.setData({
        searched: false,
        getresult: false,
      })
    }
  },

  inputClear: function () {
    this.setData({
      inputdata: "",
      inputclear: false,
      searched: false,
      getresult: false,
    })
  },
  goSearch: function (e) {
    // 获取用户资料 二次添加需用
    if (this.data.hasUserInfo != true) {
      let that = this
      wx.showToast({
        title: '请点击用户信息',
        icon: 'loading',
        duration: 2000
      })

      setTimeout(function () {
        wx.hideToast()
        wx.openSetting({
          success: function (data) {
            if (data.authSetting["scope.userInfo"] == true) {
              wx.getUserInfo({
                success: function (datw) {
                  console.info(datw.userInfo);
                  app.globalData.userInfo = datw.userInfo
                  that.setData({
                    userInfo: datw.userInfo,
                    hasUserInfo: true
                  })
                },
                fail: function () {
                  console.info("2授权失败返回数据");
                }
              })
            }
          }
        })
      }, 2000)
    }else{
      let search_input = this.data.inputdata.replace(/[^\w\n]/g, "")
      let that = this
      if (search_input.length < 1) {
        that.setData({
          searched: false,
          getresult: false,
        })
        return
      }
      this.setData({
        dataMes: [],
        dataPrice: [],
        dataReplace: [],
        dataModule: [],
        dataTeach: [],
        dataTechnology: [],
        toView: "gomessage",
        clickindex: 0,
      })
      let _obj = util.headAdd("/parts/search")
      _obj.parts = search_input
      _obj.brand = that.data.storebrand
      wx.request({
        url: 'https://007vin.com/parts/search',
        data: _obj,
        method: 'post',
        header: { "Content-Type": "application/x-www-form-urlencoded" },
        success: function (res) {
          if (res.data.code == 0) {
            that.setData({
              searched: true,
              getresult: false,
              manybrand: false,
            })
          } else if (res.data.code == 6) {
            that.setData({
              searched: true,
              getresult: false,
              manybrand: true,
              brandlist: res.data.data
            })
          } else {
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
              searched: true,
              getresult: true,
              savehistory: _savehistory,
              history: _savehistory,
              input_focus: false,
              storebrand: ""
            })
            that.dataGet(res.data.brand, search_input)
            // 添加表 录入数据库
            var Diary = Bmob.Object.extend("factory");
            var diary = new Diary();
            diary.set("pid", search_input);
            diary.set("name", that.data.userInfo.nickName);
            diary.set("phone", "******");
            diary.set("remark", "******");
            diary.set("role", "buy");

            //添加数据，第一个入口参数是null
            diary.save(null, {
              success: function (result) {
                // 添加成功，返回成功之后的objectId（注意：返回的属性名字是id，不是objectId），你还可以在Bmob的Web管理后台看到对应的数据
                // console.log("日记创建成功, objectId:" + result.id);
              },
              error: function (result, error) {
                // 添加失败
                // console.log('创建日记失败');

              }
            });


          }
        }
      })
    }

    
  },
  //获取用户手机号
  getPhoneNumber: function (e) {
    // console.log(e.detail.errMsg)
    // console.log(e.detail.iv)
    // console.log(e.detail.encryptedData)
    // if (e.detail.errMsg == 'getPhoneNumber:fail user deny') {
    //   wx.showModal({
    //     title: '提示',
    //     showCancel: false,
    //     content: '未授权',
    //     success: function (res) { }
    //   })
    // } else {
    //   wx.showModal({
    //     title: '提示',
    //     showCancel: false,
    //     content: '同意授权',
    //     success: function (res) { }
    //   })
    // }
  },

  getbrand:function(e){
    let _brand = e.currentTarget.dataset.brand
    let that = this
    that.setData({
      storebrand: _brand
    },()=>{
      that.goSearch()
    })
  },

  getpartnum: function (e) {
    let message = e.currentTarget.dataset.world
    this.setData({
      history: this.data.savehistory,
      input_focus: false,
      inputdata: message,
      inputclear: true
    }, () => {
      this.goSearch()
    })
  },

// 滚动视图
  scrollToViewFn: function (e) {
    let  _id = e.target.dataset.id;
    let _index = e.target.dataset.index;
    this.setData({
      toView:_id,
      clickindex: _index
    })
  },
// 获取需求市场数据
  scrollToViewFnBtn: function (e) {
    let _id = e.target.dataset.id;
    let _index = e.target.dataset.index;
    let that = this
    if (this.data.buymarket.length < 1){
      var Diary = Bmob.Object.extend("factory");
      var query = new Bmob.Query(Diary);    
      // query.limit(10);
      query.find({
        success: function (object) {
          let _cleardata = []
          if (object.length>10){
            _cleardata = object.reverse().slice(0,9)
          }
          that.setData({
            buymarket: _cleardata,
            toView: _id,
            clickindex: _index
          })
          // 查询成功
        },
        error: function (error) {
          console.log("查询失败: " + error.code + " " + error.message);
        }
      });
    }else{
      that.setData({
        toView: _id,
        clickindex: _index
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this.dataGet(options.fortdata, options.pid) 
    var that = this;  
    if (options.bindpid){
      that.setData({
        inputdata: options.bindpid,
        inputclear: true
      }, () => {
        that.goSearch()
      })
    }
    if (that.data.inputdata.length>0){
      wx.getClipboardData({
        success: function (res) {
          let _data = res.data
          var reg = new RegExp("^[A-Za-z0-9]+$")
          if (reg.test(_data)) {
            wx.showModal({
              title: '提示',
              content: '是否粘贴剪切板内容',
              success: function (ress) {
                if (ress.confirm) {
                  let _data = res.data.toLocaleUpperCase()
                  that.setData({
                    input_focus: false,
                    inputdata: _data,
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
    }
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
    this.newgetuserInfo() 
  },
  newgetuserInfo:function(){
    //获取用户信息
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
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
  },
  dataGet(date,pid) { 
    let that = this  
    let _obj = util.headAdd("/ppys/partssearchs")
        _obj.part = pid
        _obj.brand = date
      wx.request({
        url: 'https://007vin.com/ppys/partssearchs',
        data: _obj,
        method: 'get',
        header: { "Content-Type": "application/x-www-form-urlencoded" },
        success: function (res) { 
            let _titlelist = ["基础信息", "渠道价格", "替换件", "组件", "技术信息", "适用车型"]
            let _data = res.data.headname || []
                _data.unshift("基础信息")
            let _clickid = []
            for (let o = 0; o < _data.length; o++) {
              let _haveindex = _titlelist.indexOf(_data[o])
              if (_haveindex != -1) {
                let _bugdata = ["gomessage", "goprice", "goreplace", "gomodule", "goteach", "gotechnology"]
                _clickid.push(_bugdata[_haveindex])
                if (_haveindex != 0 && _haveindex != 4 ){
                  // 第一组数据不处理
                  that.addDataGet(pid, date, _haveindex)
                }
              }
            }
            // 特殊数据处理
            let _datames = res.data.partdetail
            if (_datames.length>0){
              _datames.forEach(function (item, index, arr){
                arr[index].key = arr[index].key.replace(/&nbsp;/g, '')
                arr[index].value = arr[index].value.replace(/&nbsp;/g, '')
              })
            }
            that.setData({
              clickid: _clickid,
              headlist: _data,
              dataMes: _datames,
              imgbrand: res.data.img,
              dataTeach: res.data.showmessage||[]
            })
        }
      }) 
    
  },

  addDataGet(pid, date, index) {
    let that = this
    let urllist = ["ppys/partssearchs", "ppys/partprices", "ppys/searchreplace", "ppys/partcompt", "不用该参数", "ppys/partcars"];
    let _obj = util.headAdd(urllist[index]) 
      _obj.part = pid
      _obj.brand = date
    wx.request({
      url: 'https://007vin.com/' + urllist[index],
      data: _obj,
      method: 'get',
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      success: function (res) {
        if (index==1){
          that.setData({
            dataPrice: res.data.data[0].data||[] 
          })
        } else if (index == 2){
          if (res.data.data!=[]){
            that.setData({
              dataReplace: res.data.data || []
            })
          }
          
        } else if (index == 3){
          that.setData({
            dataModule: res.data.data || []
          })
        } else {
          that.setData({
            dataTechnology: res.data.data || []
          })
        }
      }
    })
  },
  

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
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
  onShareAppMessage: function () {
   return {
     title: '零零汽零件号查询',
     path: '/pages/resule/index?bindpid=' + this.data.inputdata,
     success: function (res) {
       // 转发成功
     },
     fail: function (res) {
       // 转发失败
     }
   }

  },
  getUserInfo: function (e) {
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})