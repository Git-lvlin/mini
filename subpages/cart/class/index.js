import create from '../../../utils/create'
import store from '../../../store/index'

create.Page(store, {
  use: [
    "systemInfo",
  ],

  /**
   * 页面的初始数据
   */
  data: {
    classPopupState: false,
    classScrollHeight: 521,
    showClassPopup: false,
    classIndex: 0,
    treeData: [
      {
        index: 0,
        text: "水果蔬菜"
      },
      {
        index: 1,
        text: "粮油调味"
      },
      {
        index: 2,
        text: "酒水饮料"
      },
      {
        index: 3,
        text: "乳饮保健"
      },
      {
        index: 4,
        text: "乳饮保健"
      },
      {
        index: 5,
        text: "乳饮保健"
      },
      {
        index: 6,
        text: "乳饮保健"
      },
      {
        index: 7,
        text: "乳饮保健"
      },
      {
        index: 8,
        text: "乳饮保健"
      },
      {
        index: 9,
        text: "乳饮保健"
      },
      {
        index: 9,
        text: "乳饮保健"
      },
      {
        index: 9,
        text: "乳饮保健"
      },
      {
        index: 9,
        text: "乳饮保健"
      },
      // {
      //   index: 9,
      //   text: "乳饮保健"
      // },
      // {
      //   index: 9,
      //   text: "乳饮保健"
      // },
      // {
      //   index: 9,
      //   text: "乳饮保健"
      // },
      // {
      //   index: 9,
      //   text: "乳饮保健"
      // },
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let classScrollHeight = this.data.$.systemInfo.screenHeight * this.data.$.systemInfo.rpxRatio - this.data.$.systemInfo.navTotalHeight - 172 - 16;
    this.setData({
      classScrollHeight
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },

  onOpenClass() {
    this.setData({
      showClassPopup: true,
    })
  },

  onCloseClass() {
    this.setData({
      showClassPopup: false,
    })
  },

  onSelectClass(event) {
    let {
      showClassPopup
    } = this.data;
    if(showClassPopup) showClassPopup = false;
    this.setData({
      showClassPopup,
      classIndex: event.currentTarget.dataset.index,
    })
  },

  handleNum({ detail }) {
  // console.log("🚀 ~ file: index.js ~ line 139 ~ handleNum ~ detail", detail)

  },

  handleClassPopupShow({ detail }) {
    this.setData({
      classPopupState: detail.state
    })
  }
})