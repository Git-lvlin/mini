
import create from '../../../utils/create'
import store from '../../../store/index'
import router from '../../../utils/router'

create.Component(store, {
  options: {
    // 在组件定义时的选项中启用多slot支持
    multipleSlots: true,
    addGlobalClass: true,
  },
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
    // 导航栏文字颜色
    fontColor: {
      type: String,
      value: "#fff"
    },
    // 状态栏背景颜色 只支持十六进制 #FA0D1E 主题色
    background: {
      type: String,
      value: '#FA0D1E'
    },
    // 状态栏文字颜色 支持 white / black
    statusColor: {
      type: String,
      value: 'white',
      observer(now, old) {
        if(now != old) this.setStatusBarColor();
      }
    },
    // 导航栏标题
    title: {
      type: String,
      value: "约购"
    },
    // 导航栏是否显示搜索框
    titleIsSearch: {
      type: Boolean,
      value: false
    },
    // 是否自定义背景
    useCustomBack: {
      type: Boolean,
      value: false
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
    },
    // 返回层数
    delta: {
      type: Number,
      value: 1
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
    let navTotalHeight = this.data.$.systemInfo.navTotalHeight;
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
      const delta = this.data.delta;
      router.go(delta);
    },

    // 点击返回首页
    onClickHome() {
      router.goTabbar();
    },

    onToSearch() {
      router.push({
        name: 'search'
      })
    }
  }
})
