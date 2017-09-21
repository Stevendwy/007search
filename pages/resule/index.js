// pages/resule/index.js
var mdfive = require('../../utils/md5.js');
var util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    clickindex:0,
    clickid: ["gomessage", "goprice", "goreplace", "gomodule","goteach","gotechnology"],

    dataMes:[],
    dataPrice:[],
    dataReplace:[],
    dataModule:[],
    dataTeach:[],
    dataTechnology:[],

    leftlist: ["零件类型:", "厂家:", "备注:", "进价(未含税):", "进价(含税):", "销售价:"],
    rightlist: ["parttype", "mill", "remark", "eot_price", "cost_price", "prices"],

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

    input_focus: true,
    inputclear: false,
    inputdata: "",
    savehistory: [],
    history: ["95820102100", "64319313519", "23001222887","3350433090E1"],

    searched:false,
    getresult:false,
  },
  inputchange: function (e) {
    let s_input = e.detail.value.replace(/[^a-zA-Z0-9]/g, '').toLocaleUpperCase()
    let s_show = e.detail.value.replace(/\W/g, "").length != 0 ? true : false
    this.setData({
      inputdata: s_input,
      inputclear: s_show,
    })
  },

  inputClear: function () {
    this.setData({
      inputdata: "",
      inputclear: false
    })
  },
  goSearch: function (e) {
    // let search_input = this.data.inputdata.replace(/\W/g, "")
    let search_input = this.data.inputdata
    let that = this
    if (search_input.length < 1) {
      that.setData({
        searched: false,
        getresult: false,
      })
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
        if (res.data.data[0].status == 0 || res.data.code == 6) {
          that.setData({
            searched: true,
            getresult: false,
          })
          // wx.showToast({
          //   title: '无此零件信息',
          //   icon: 'loading',
          //   duration: 1000
          // })
          // setTimeout(function () {
          //   wx.hideToast()
          // }, 1000)
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
            input_focus: false
          })
          that.dataGet(res.data.brand, search_input)
        }
      }
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
        // console.log(res.data)
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
  },
  dataGet(date,pid) { 
    let that = this  
    let _obj = util.headAdd("/ppys/partssearchs")
        _obj.part = pid
        _obj.brand = date
      wx.request({
        url: 'https://beta.007vin.com/ppys/partssearchs',
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
                _clickid.push(that.data.clickid[_haveindex])
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
      url: 'https://beta.007vin.com/' + urllist[index],
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

  }
})