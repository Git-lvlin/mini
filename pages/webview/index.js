import router from "../../utils/router";

Page({
  optionsInfo: {},

  data: {
    // link: "https://publicmobile-dev.yeahgo.com/web/user-appointment",
    link: "",
  },

  onLoad(options) {
    if(!options.url) {
      router.go();
      return;
    }
    const link = options.url.includes('%')?decodeURIComponent(options.url):options.url;
    this.setData({
      link,
    });
    this.optionsInfo = options;
  },

  onShow() {

  },

  onHide() {

  },

  handlePostMsg(event) {
  console.log("🚀 ~ file: index.js ~ line 21 ~ handlePostMsg ~ event", event)
    
  },

  // 分享
  onShareAppMessage() {
    const {
      title,
      cover,
      contentType,
    } = this.optionsInfo;
    const {
      link,
    } = this.data;
    const shareParams = {
      ...this.optionsInfo,
    };
    // shareParams.url = link;
    const pathParam = objToParamStr(shareParams);
    const shareInfo = {
      title,
      path: "/pages/webview/index",
      imageUrl: cover,
    }
    const userInfo = getStorageUserInfo();
    if(userInfo) {
      let params = {
        shareType: 1,
        contentType: contentType ? contentType : 1,
        shareObjectNo: shareObjectNo ? shareObjectNo : "normal",
        paramId: paramId ? paramId : 1,
        shareParams: {
          ...shareParams,
          url: link,
        },
        ext: {
          ...shareParams,
          url: link,
        },
      };
      promise = commonApi.getShareInfo(params);
      shareInfo.promise = promise;
    }
    shareInfo.path = `${shareInfo.path}${pathParam}`;
    return shareInfo;
  },
})