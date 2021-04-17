import create from '../../../utils/create'
import store from '../../../store/index'

create.Component(store, {
  use: [
    "systemInfo",
  ],
  
  properties: {

  },

  /**
   * 页面的初始数据
   */
  data: {
    showClassPopup: false,
    classIndex: 0,
    classList: [
      {
        index: 0,
        icon: "https://dev-yeahgo.oss-cn-shenzhen.aliyuncs.com/miniprogram/common/logo.png",
        name: "水果蔬菜"
      },
      {
        index: 1,
        icon: "https://dev-yeahgo.oss-cn-shenzhen.aliyuncs.com/miniprogram/common/logo.png",
        name: "粮油调味"
      },
      {
        index: 2,
        icon: "https://dev-yeahgo.oss-cn-shenzhen.aliyuncs.com/miniprogram/common/logo.png",
        name: "酒水饮料"
      },
      {
        index: 3,
        icon: "https://dev-yeahgo.oss-cn-shenzhen.aliyuncs.com/miniprogram/common/logo.png",
        name: "乳饮保健"
      },
      {
        index: 4,
        icon: "https://dev-yeahgo.oss-cn-shenzhen.aliyuncs.com/miniprogram/common/logo.png",
        name: "乳饮保健"
      },
      {
        index: 5,
        icon: "https://dev-yeahgo.oss-cn-shenzhen.aliyuncs.com/miniprogram/common/logo.png",
        name: "乳饮保健"
      },
      {
        index: 6,
        icon: "https://dev-yeahgo.oss-cn-shenzhen.aliyuncs.com/miniprogram/common/logo.png",
        name: "乳饮保健"
      },
      {
        index: 7,
        icon: "https://dev-yeahgo.oss-cn-shenzhen.aliyuncs.com/miniprogram/common/logo.png",
        name: "乳饮保健"
      },
      {
        index: 8,
        icon: "https://dev-yeahgo.oss-cn-shenzhen.aliyuncs.com/miniprogram/common/logo.png",
        name: "乳饮保健"
      },
      {
        index: 9,
        icon: "https://dev-yeahgo.oss-cn-shenzhen.aliyuncs.com/miniprogram/common/logo.png",
        name: "乳饮保健"
      },
    ]
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onOpenClass() {
      this.setData({
        showClassPopup: true,
      })
      this.handlePopupshow(true)
    },
  
    onCloseClass() {
      this.setData({
        showClassPopup: false,
      })
      this.handlePopupshow(false)
    },

    handlePopupshow(state) {
      this.triggerEvent("popupShow", { state });
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
    }
  }
})
