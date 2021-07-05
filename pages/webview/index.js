import router from "../../utils/router";

Page({

  data: {
    link: "https://publicmobile-uat.yeahgo.com/web/user-appointment",
    // link: "http://baidu.com",
  },

  onLoad(options) {
    // if(!options.url) {
    //   router.go();
    //   return;
    // }
    // const link = decodeURIComponent(options.url);
    // this.setData({
    //   link,
    // });
  },

  onShow() {

  },

  onHide() {

  },

  handlePostMsg(event) {
  console.log("🚀 ~ file: index.js ~ line 21 ~ handlePostMsg ~ event", event)
    
  },
})