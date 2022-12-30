import router from "../../utils/router";
import commonApis from '../../apis/common'
import { getStorageUserInfo, objToParamStr } from '../../utils/tools'


Page({
  optionsInfo: {},

  data: {
    // link: "https://publicmobile-dev.yeahgo.com/web/user-appointment",
    link: "",
  },

  onLoad(options) {
    if (options.scene) {
      this.getShareParam(options);
    } else {
      if (!options.url) {
        router.go();
        return;
      }
      let link = options.url.includes('%') ? decodeURIComponent(options.url) : options.url;
      if (options.encode) {
        link = decodeURIComponent(link)
      }
      console.log('link', link);
      this.setData({
        link,
      });
      this.optionsInfo = {
        ...options,
        link
      };
    }
    
  },

  onShow() {

  },

  onHide() {

  },

  getShareParam(data) {
    commonApis.getShareParam({
      scene: data.scene,
    }).then(res => {
      const options = res;
      if (!options.url) {
        router.go();
        return;
      }
      let link = options.url.includes('%') ? decodeURIComponent(options.url) : options.url;
      if (options.encode) {
        link = decodeURIComponent(link)
      }
      this.setData({
        link,
      });
      this.optionsInfo = {
        ...options,
        link
      };
    })
  },

  handlePostMsg(event) {
  console.log("🚀 ~ file: index.js ~ line 21 ~ handlePostMsg ~ event", event)
    
  },

  // 分享
  async onShareAppMessage() {
    const {
      title,
      cover,
      contentType,
      url,
      link
    } = this.optionsInfo;
    
    const shareParams = {
      ...this.optionsInfo,
    };
    const pathParam = objToParamStr(shareParams);
    const shareInfo = {
      title,
      path: "/pages/webview/index",
      imageUrl: cover,
    }
    const userInfo = getStorageUserInfo();
    if (url && url.includes('customize') && userInfo) {
      
      let params = {
        shareType: 1,
        contentType: 22,
        shareObjectNo: "normal",
        paramId: 23,
        ext: {
          id: link.match(/id=(.+)/)[1]
        },
      };
      const res = await commonApis.getShareInfo(params);
      shareInfo.path = res.shareUrl;
      shareInfo.imageUrl = res.thumbData;
      shareInfo.title = res.title;
    }
    return shareInfo;
  },
})