// pages/resule/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    clickindex:0,
    clickid: ["gomessage", "goprice", "goreplace", "gomodule","gotechnology"],
    toView: "gomessage",
    headlist: ["基础信息", "渠道价格", "替换件", "组件","技术信息"],
    leftlist: ["品牌:", "零件号:", "车型:", "型号:", "件数:","参考价格:"],
    rightlist: ["pid", "advise", "ptype", "origin", "haschild","price"],
    logoimg:"",
    mesdata: [{ "value": "\u5fae\u5c18\u6ee4\u6e05\u5668/\u6d3b\u6027\u78b3\u8fc7\u6ee4\u5668", "key": "\u539f\u5382\u540d\u79f0" }, { "value": "64319313519", "key": "\u539f\u5382OE\u53f7" }, { "value": "2017-02-19", "key": "\u66f4\u65b0\u65f6\u95f4" }],
    pricedata: [{ "origin": "--", "remark": "--", "parttype": "\u539f\u5382\u4ef6 ", "pid": "1141598", "factory": "\u539f\u5382", "prices": "\u00a5889.0", "mill": "\u8def\u864e" },],
    replacedata: [{ "lable": "", "haschild": 1, "price": "\u00a5294.0", "pid": "64316962549", "ptype": "Y", "num": 4, "parentnum": 3, "counts": "", "level": 3, "is_show": "", "is_last": 1, "advise": "" }, { "lable": "", "haschild": 0, "price": "\u00a5324.0", "pid": "64316946628", "ptype": "Y", "num": 5, "parentnum": 4, "counts": "", "level": 4, "is_show": "", "is_last": 1, "advise": "" }],
    techdata: ["\u6750\u6599:", "\u5207\u65ad\u6807\u8bb0:N", "\u4ea7\u54c1\u7ea7\u522b:62", "\u6807\u51c6\u7f16\u53f7:", "\u96f6\u4ef6\u7c7b\u578b:1", "\u6570\u91cf\u5355\u4f4d:00", "PPQ:1", "RPQ:1", "CPQ:111", "\u91cd\u91cf:0.23"],
  },

// 滚动视图
  scrollToViewFn: function (e) {
    let  _id = e.target.dataset.id;
    let _index = e.target.dataset.index;
    this.setData({
      toView:_id,
      clickindex: _index
    })
    console.log(this.data.toView)
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