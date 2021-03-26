
import create from '../../../utils/create'
import store from '../../../store/index'

create.Component(store, {
  use: [
    "systemInfo"
  ],

  /**
   * 组件的属性列表
   */
  properties: {
    isHome: {
      type: Boolean,
      value: false
    },
    fontColor: {
      type: String,
      value: "#fff"
    },
    // 状态栏背景颜色 只支持十六进制
    background: {
      type: String,
      value: '#ff0000'
    },
    // 状态栏文字颜色 支持 white / black
    statusColor: {
      type: String,
      value: 'white',
      observer(now, old) {
        if(now != old) this.setStatusBarColor();
      }
    },
    // 是否显示搜索框
    showSearch: {
      type: Boolean,
      value: false,
    },
    // 页面滚动高度
    pageScroll: {
      type: Number,
      value: 0
    }
  },

  data: {
    navTotalHeight: 60,
  },

  attached() {
    // 更新状态栏文字颜色
    this.setStatusBarColor(this.properties.statusColor);
  },

  ready() {
    // 设置nav区域占位高度
    let navTotalHeight = this.data.$.systemInfo.statusBarHeight + this.data.$.systemInfo.navBarHeight;
    navTotalHeight = this.properties.showSearch ? navTotalHeight + 54 : navTotalHeight
    this.setData({
      navTotalHeight
    })
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 设置状态栏文字颜色
    setStatusBarColor(color) {
      let frontColor = "#000000"
      if(color == "white") frontColor = "#ffffff";
      wx.setNavigationBarColor({
        frontColor: frontColor,
        backgroundColor: this.properties.background,
        animation: {
          duration: 400,
          timingFunc: 'easeIn'
        },
        complete(inf) {
          console.log(inf)
        }
      })
    },
    // 点击返回按钮
    onClickBack() {
      wx.navigateBack({
        delta: 1,
        success: (res) => {},
        fail: (res) => {},
        complete: (res) => {
          console.log(res);
        },
      })
    },

    // 点击返回首页
    onClickHome() {
      wx.switchTab({
        url: 'url',
        success: (res) => {},
        fail: (res) => {},
        complete: (res) => {
          console.log(res);
        },
      })
    },
  }
})
