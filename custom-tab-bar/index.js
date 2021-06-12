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
    selectedIndex: 0,
    tabList: [
      {
        index: 0,
        pagePath: "/pages/home/index",
        name: "首页",
        iconPath: "http://dev-yeahgo-oss.waiad.icu/common/barIcon/home@3x.png",
        selectedIconPath: "http://dev-yeahgo-oss.waiad.icu/common/barIcon/actHome@3x.png"
      },{
      //   index: 1,
      //   pagePath: "/pages/community/index",
      //   name: "社区",
      //   iconPath: "http://dev-yeahgo-oss.waiad.icu/common/barIcon/community@3x.png",
      //   selectedIconPath: "http://dev-yeahgo-oss.waiad.icu/common/barIcon/actCommunity@3x.png"
      // },{
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

  
  // {
  //   "pagePath": "pages/community/index",
  //   "text": "社区",
  //   "iconPath": "/images/tabbar/community@3x.png",
  //   "selectedIconPath": "/images/tabbar/actCommunity@3x.png"
  // },

  ready() {
    const tabList = this.data.tabList;
    const pages = getCurrentPages();
    const currPage = pages[pages.length - 1].route
    const tabIndex = tabList.findIndex(item => `/${currPage}` === item.pagePath);
    if(tabIndex < 0) return;
    this.setData({
      selectedIndex: tabList[tabIndex].index
    })
  },

  methods: {
    onToPath(event) {
      const url = event.currentTarget.dataset.path;
      const pages = getCurrentPages();
      const currPage = pages[pages.length - 1].route
      const index = event.currentTarget.dataset.index;
      if(url === `/${currPage}`) return;
      wx.switchTab({
        url,
      });
    }
  }
})
