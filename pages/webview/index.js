import router from "../../utils/router";

Page({

  data: {
    link: "http://192.168.3.140:8080/menu",
    // link: "http://dev-yeahgo-publicmobile.waiad.icu/user-appointment",
    // link: "http://baidu.com",
  },

  onLoad(options) {
    if(!options.url) {
      router.go();
      return;
    }
    const link = decodeURIComponent(options.url);
    this.setData({
      link,
    });
  },

  onShow() {

  },

  onHide() {

  },

  handlePostMsg(event) {
  console.log("🚀 ~ file: index.js ~ line 21 ~ handlePostMsg ~ event", event)
    
  },
})