import homeApi from "../../../apis/home";
import router from "../../../utils/router";

Component({
  properties: {
    floor: {
      type: Object,
      value: {},
      observer(now, old) {
        const nowStr = JSON.stringify(now);
        const oldStr = JSON.stringify(old);
        if(nowStr != oldStr) {
          this.setBannerList(now.content);
        }
      }
    },
  },

  data: {
    bannerList: [],
  },

  methods: {
    // 设置商品列表数据
    setBannerList(content) {
      let homeCache = wx.getStorageSync("HOME_CACHE") || {};
      if(content.dataType === 1) {
        if(homeCache.bannerList && !!homeCache.bannerList.length) {
          this.setData({
            bannerList: homeCache.bannerList
          })
        }
        homeApi.getFloorCustom(content.dataUrl).then(res => {
          console.log("🚀 ~ file: index.js ~ line 34 ~ homeApi.getFloorCustom ~ res", content.dataUrl)
          this.setData({
            bannerList: res
          });
          homeCache.bannerList = res;
          wx.setStorage({
            key: "HOME_CACHE",
            data: homeCache,
          })
        });
      } else {
        this.setData({
          bannerList: content.data
        })
        if(homeCache.bannerList) {
          delete homeCache.bannerList;
          wx.setStorage({
            key: "HOME_CACHE",
            data: homeCache,
          })
        }
      }
    },
    // 跳转详情
    onBanner({
      currentTarget
    }) {
      let data = currentTarget.dataset.data;
      console.log("banner跳转", data.actionUrl)
      router.getUrlRoute(data.actionUrl);
    },
  }
})
