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
    this.dataGet(options.fortdata, options.pid)
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
            that.setData({
              clickid: _clickid,
              headlist: _data,
              dataMes: res.data.partdetail,
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
  
  }
})