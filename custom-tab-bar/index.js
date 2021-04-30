import create from '../utils/create'
import store from '../store/index'

create.Component(store, {
  use: [
    "systemInfo",
  ],

  properties: {

  },

  data: {
    pagePath: "",
    tabList: [
      {
        index: 0,
        pagePath: "/pages/home/index",
        name: "首页",
        iconPath: "http://dev-yeahgo-oss.waiad.icu/common/barIcon/home@3x.png",
        selectedIconPath: "http://dev-yeahgo-oss.waiad.icu/common/barIcon/actHome@3x.png"
      },{
        index: 1,
        pagePath: "/pages/community/index",
        name: "社区",
        iconPath: "http://dev-yeahgo-oss.waiad.icu/common/barIcon/community@3x.png",
        selectedIconPath: "http://dev-yeahgo-oss.waiad.icu/common/barIcon/actCommunity@3x.png"
      },{
        index: 2,
        pagePath: "/pages/cart/index",
        name: "购物车",
        iconPath: "http://dev-yeahgo-oss.waiad.icu/common/barIcon/cart@3x.png",
        selectedIconPath: "http://dev-yeahgo-oss.waiad.icu/common/barIcon/actCart@3x.png"
      },{
        index: 3,
        pagePath: "/pages/user/index",
        name: "我的",
        iconPath: "http://dev-yeahgo-oss.waiad.icu/common/barIcon/me@3x.png",
        selectedIconPath: "http://dev-yeahgo-oss.waiad.icu/common/barIcon/actMe@3x.png"
      }
    ]
  },

  ready() {
    const pages = getCurrentPages();
    if(!pages.length) return; 
    const pagePath = `/${pages[pages.length - 1].route}`;
    this.setData({
      pagePath
    });
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onToPath(event) {
      const url = event.currentTarget.dataset.path;
      if(url === this.data.pagePath) return;
      wx.switchTab({
        url,
      });
    }
  }
})
