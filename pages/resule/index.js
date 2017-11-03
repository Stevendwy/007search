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
    phoneNumber:"",               //拨打电话
    textareavalue: "",            //textarea 输入内容
    storehas:[],                  //是否新加仓库
    ajaxallow:false,              //是否允许再次请求数据

    sellmarket: [],         //供货市场
    selllefttitle: ["供应商", "联系电话","库存"],
    sellrightlist: ["merchant_name", "merchant_phone", "stock_status"],
    selldataend:1,                  //供货市场数据是否最后页码
    selldatapage:1,                //默认供货市场请求页码

    buymarket: [],                  //需求市场
    buylefttitle: ["客户", "求购零件号", "联系电话"],
    buyrightlist: ["buyer_name", "pid", "buyer_phone"],
    buydataend: 1,            //需求市场数据是否最后页码
    buydatapage:1,                //默认默认需求请求页码

    userInfo: {},
    hasUserInfo: false,
    hasuid:"",                    //存储openid
    hasphone:0,                    //存储手机号
    brandlist:[],                   //存储的品牌
    storebrand:"",
    newbrand:"",                     //仅供发参数
    toView: "gomessage",            //判断显示那个页面
    clickindex:0,                   //判断显示那个页面 index

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

    headlist: [],
    logoimg:"",
    imgbrand:"",                          //品牌图片
    imgbottom: "../../images/p_img.png",
    
    input_focus: true,
    inputclear: false,
    inputdata: "",
    savehistory: ["95820102100", "64319313519", "24007621038", "12317605061","12317605478"],
    history: ["95820102100", "64319313519", "24007621038", "12317605061","12317605478"],
    bookmark: ['速度慢', '价格不准确', '需要添加供应商信息', '数据不全','需要添加求购零件信息','数据错误','联系方式不准确'],

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
  inputfeed: function (e) {
    let s_input = e.detail.value
    // let _data = this.data.textareavalue + s_input
    this.setData({
      textareavalue: s_input
    })
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
    //先获取用户信息
    if (this.data.hasuid == "" || this.data.hasphone == 0) {
      this.whetherlogin()    //获取用户 登录信息
    }
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

        sellmarket:[],
        selldatapage:1,

        buymarket:[],
        buydatapage:1,
        toView: "gomessage",
        clickindex: 0,
      })
      let _obj = util.headAdd("/parts/search")
        _obj.parts = search_input
        _obj.brand = that.data.storebrand
        // that.data.storebrand
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
              storebrand: '',
              newbrand:res.data.brand
            })
            that.dataGet(res.data.brand, search_input)
              //录入数据库
              let _obj = util.headAdd("/wechattool/buyer_history_record")
                  _obj.uid_auth = that.data.hasuid            //openid
                  _obj.pid = search_input                     //零件号
                  _obj.brandCode = res.data.brand               //品牌
                  _obj.nickName = that.data.userInfo.nickName   //用户名
                  _obj.city = that.data.userInfo.city           //城市
                  _obj.province = that.data.userInfo.province   //省份

              wx.request({
                url: 'https://union.007vin.com/wechattool/buyer_history_record',
                data: _obj,
                method: 'post',
                header: { "Content-Type": "application/x-www-form-urlencoded" },
                success: function (res) {
                  // console.log('储存信息完成'+ res)
                }
              })
          }
        }
      })
    }

    
  },
  //调用微信登录接口 获取手机号 和 openid
  whetherlogin: function (types = "login", phone = "", uid = "", iv=""){
    let that = this
    wx.login({
      success: function (loginCode) {
        if(types=="phone"){
          let _objs = util.headAdd("/wechattool/userphone_record")
          _objs.phone_auth = phone
          _objs.uid_auth = uid
          _objs.iv = iv
          _objs.js_code = loginCode.code             //loginCode

          _objs.nickName = that.data.userInfo.nickName   //用户名
          _objs.city = that.data.userInfo.city           //城市
          _objs.province = that.data.userInfo.province   //省份
          wx.request({
            url: 'https://union.007vin.com/wechattool/userphone_record',
            data: _objs,
            method: 'post',
            header: { "Content-Type": "application/x-www-form-urlencoded" },
            success: function (res) {
              // console.log('获取手机号结果' + res.data)
              // that.whetherlogin()
              that.setData({
                hasphone: res.data.phone_verified,           //存储手机号
              },
                  that.getSellMarket() //默认再次请求
              )
            }
          })
        }else{
          //获取openId
          let _obj = util.headAdd("/wechattool/userinfo")
              _obj.js_code = loginCode.code             //loginCode
          wx.request({
            url: 'https://union.007vin.com/wechattool/userinfo',
            data: _obj,
            method: 'post',
            header: { "Content-Type": "application/x-www-form-urlencoded" },
            success: function (res) {
              // console.log('获取手机号状态 uid'+res)
              that.setData({
                hasuid: res.data.uid_auth,                   //存储openid
                hasphone: res.data.phone_verified,           //存储手机号
              })
            }
          })
        }
      }
    })
  },

  //提交反馈信息
  inputmark:function(e){
    let _data = this.data.textareavalue + e.target.dataset.values +" ，"
    this.setData({
      textareavalue: _data
    })
  },
  feedBackBtn:function(e){
    // console.log(e.detail.value.textarea)
    if (e.detail.value.textarea.replace(/\s+/g, "").length > 0){
      let that = this
      let _obj = util.headAdd("/wechattool/feedback")
      _obj.uid_auth = that.data.hasuid
      // _obj.phone = "" || ""  选填手机号
      _obj.uid_auth = that.data.hasuid
      _obj.feedback_content = e.detail.value.textarea
      _obj.nickName = that.data.userInfo.nickName

      wx.request({
        url: 'https://union.007vin.com/wechattool/feedback',
        data: _obj,
        method: 'post',
        header: { "Content-Type": "application/x-www-form-urlencoded" },
        success: function (res) {
          // console.log('提交反馈信息完成'+res.data)
          wx.showToast({
            title: '问题已经反馈',
            icon: '',
            duration: 2000
          })
        }
      })
      that.setData({
        textareavalue: ''
      })
      // 延时 完善微信bug 
      setTimeout(_ => {
        that.setData({
          textareavalue: ''
        })
      }, 300)
    }
  },
  //获取用户手机号
  getPhoneNumber: function (e) { 
    let that = this  
    if (e.detail.errMsg != 'getPhoneNumber:fail user deny') {
      // console.log("agree")
      // console.log(e.detail.errMsg)
      // console.log(e.detail.iv)
      // console.log(e.detail.encryptedData)
      that.whetherlogin("phone", e.detail.encryptedData, that.data.hasuid, e.detail.iv)
    }   
  },
  //点击获取更多
  getMoreSellMarket:function(){
    let that = this 
    let _page = 1 + that.data.selldatapage
    that.getSellMarket(_page)
  },
  // 拨打电话
  phoneNumTap:function(e){
    let phonenum = e.target.dataset.phone;
    wx.makePhoneCall({
      phoneNumber: phonenum,
    })
  },

  //获取品牌
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
    if (_index == 11 ){
      //获取卖方市场信息
      that.getSellMarket()
    } else if (_index == 12) {
       //获取买方市场数据
      that.getBuyMarket()
    }
    that.setData({
      toView: _id,
      clickindex: _index
    })   
  },

  //获取卖方市场信息
  getSellMarket:function(page=1){
    let that = this
    that.setData({
      selldatapage: 1,
      selldataend: 1
    })
    let _obj = util.headAdd("/wechattool/merchant_list")
    _obj.uid_auth = that.data.hasuid
    _obj.brandCode = that.data.newbrand
    _obj.page = page
    wx.request({
      url: 'https://union.007vin.com/wechattool/merchant_list',
      data: _obj,
      method: 'post',
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      success: function (res) {
        // console.log('获取供应商信息'+res.data)
        // console.log(res.data.last_page)
        that.setData({
          ajaxallow:false,
          sellmarket: res.data.data,
          selldatapage: res.data.page,
          selldataend: res.data.last_page
        })
      }
    })
  },

  //上拉加载 更多数据
  bindSellMore:function(){
    let that = this
    if (that.data.ajaxallow){return}
    that.setData({
      ajaxallow: true
    })
    if (that.data.clickindex == 12 && that.data.buydataend == 0){
      let _pages = 1 + that.data.buydatapage 
      that.getBuyMarket(_pages)
    } 
  //为获取手机号 供应商 下拉不刷新
  //  if (that.data.clickindex == 11 && that.data.selldataend == 0){
  //     let _page = 1 + that.data.selldatapage
  //     that.getSellMarket(_page)
  //   }
  },

  //获取买方市场数据
  getBuyMarket:function(page=1){
    let that = this
    let _obj = util.headAdd("/wechattool/buyer_list")
    _obj.uid_auth = that.data.hasuid
    _obj.page = page
    wx.request({
      url: 'https://union.007vin.com/wechattool/buyer_list',
      data: _obj,
      method: 'post',
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      success: function (res) {
        // console.log('获取买方信息' + res.data)
        that.setData({
          ajaxallow: false,
          storehas: res.data.data,
          buymarket: res.data.data,
          buydatapage: res.data.page,
          buydataend: res.data.last_page
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this.dataGet(options.fortdata, options.pid) 
    let that = this;  
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
    that.newgetuserInfo()  //获取用户信息
    that.whetherlogin()    //获取用户 登录信息
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