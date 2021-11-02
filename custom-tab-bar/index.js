import create from '../utils/create'
import store from '../store/index'
import { IMG_CDN } from '../constants/common';
import lottie from 'lottie-miniapp'

create.Component(store, {
  use: [
    "systemInfo",
  ],

  properties: {

  },

  data: {
    pagePath: "",
    selectedIndex: 0,
    animationPath: "https://uat-yeahgo-oss.yeahgo.com/miniprogram/home/intensiveIcon/yesgo.json",
    tabList: [
      {
        index: 0,
        pagePath: "/pages/home/index",
        name: "首页",
        // iconPath: `${IMG_CDN}common/barIcon/home@3x.png`,
        // selectedIconPath: `${IMG_CDN}common/barIcon/actHome@3x.png`,
        iconPath: `../images/tabbar/home@3x.png`,
        selectedIconPath: `../images/tabbar/actHome@3x.png`,
      },{
      //   index: 1,
      //   pagePath: "/pages/community/index",
      //   name: "社区",
      //   iconPath: `${IMG_CDN}common/barIcon/community@3x.png`,
      //   selectedIconPath: `${IMG_CDN}common/barIcon/actCommunity@3x.png`
      // },{
      //   index: 2,
      //   pagePath: "/pages/cart/index",
      //   name: "购物车",
      //   iconPath: `${IMG_CDN}common/barIcon/cart@3x.png`,
      //   selectedIconPath: `${IMG_CDN}common/barIcon/actCart@3x.png`
      // },{
        index: 2,
        pagePath: "/pages/intensive/index",
        name: "",
        special: "intensive",
        iconPath: `../images/tabbar/intensive.png`,
        selectedIconPath: `../images/tabbar/intensive.png`
      },{
        index: 3,
        pagePath: "/pages/user/index",
        name: "我的",
        iconPath: `../images/tabbar/me@3x.png`,
        selectedIconPath: `../images/tabbar/actMe@3x.png`
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
    
    return
    const animationPath = "https://uat-yeahgo-oss.yeahgo.com/miniprogram/home/intensiveIcon/yesgo.json"
    // console.log(this);
    const canvasContext = wx.createCanvasContext("canvasIcon"); 
    console.log("🚀 ~ file: index.js ~ line 78 ~ ready ~ canvasContext", canvasContext)
    //  请求到的lottie json数据
    const animationData = {};
    // 请求lottie的路径。注意开启downloadFile域名并且返回格式是json
    
    // 指定canvas大小
    canvasContext.canvas = {
      width: 100,
      height: 100,
    };
    // 如果同时指定 animationData 和 path， 优先取 animationData
    lottie.loadAnimation({
      renderer: "canvas", // 只支持canvas
      loop: true,
      autoplay: true,
      // animationData: animationData,
      path: animationPath,
      rendererSettings: {
        context: canvasContext,
        clearCanvas: true,
      },
    });

    // const query = this.createSelectorQuery();
    // query
    //   .select("#canvasIcon")
    //   .fields({ node: true, size: true })
    //   .exec((res) => {
    //     const canvas = res[0].node;
    //     console.log("🚀 ~ file: index.js ~ line 106 ~ .exec ~ res[0]", res[0])
    //     const ctx = canvas.getContext("2d");

    //     const dpr = wx.getSystemInfoSync().pixelRatio;
    //     canvas.width = res[0].width * dpr;
    //     canvas.height = res[0].height * dpr;
    //     ctx.scale(dpr, dpr);

    //     lottie.loadAnimation({
    //       that: this,
    //       renderer: "canvas", // 只支持canvas
    //       loop: true,
    //       autoplay: true,
    //       // animationData: animationData,
    //       path: animationPath,
    //       rendererSettings: {
    //         // 这里需要填 canvas
    //         canvas: canvas,
    //         context: canvasContext,
    //         clearCanvas: true,
    //       },
    //     });
    //   });
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
