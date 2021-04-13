import create from '../../../utils/create'
import store from '../../../store/index'
import routes from '../../../constants/routes'


create.Page(store, {
  use: [
    "systemInfo"
  ],

  /**
   * 页面的初始数据
   */
  data: {
    stock: 0,
    backTopHeight: 56,
    swiperCurrent: 1,
    imgUrls: [
      1,1,1
    ],
    parameterList: [
      {
        name: "品种",
        value: "番茄"
      },{
        name: "品牌",
        value: "新奇儿"
      },{
        name: "供应商",
        value: "山东青岛"
      },{
        name: "净含量",
        value: "500g"
      },{
        name: "储存条件",
        value: "500g"
      },
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let { systemInfo } = this.data.$;
    let backTopHeight = (systemInfo.navBarHeight - 56) / 2 + systemInfo.statusHeight;
    this.setData({
      backTopHeight
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  // 返回按钮
  onToBack() {
    const pages = getCurrentPages();
    if(pages.length > 2) {
      wx.navigateBack({
        delta: 1
      });
    } else {
      wx.reLaunch({
        url: routes.home.path,
      });
    }
  },

  // 监听swiper当前轮播图
  handleSwiperChange({ detail }) {
    this.setData({
      swiperCurrent: detail.current + 1
    })
  },

  addStock() {
    let stock = this.data.stock;
    stock += 1;
    this.setData({
      stock
    });
  },

  reduceStock() {
    let stock = this.data.stock;
    if(stock === 1) return
    stock -= 1;
    this.setData({
      stock
    })
  },

})