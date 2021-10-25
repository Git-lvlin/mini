import homeApi from "../../../apis/home";
import router from "../../../utils/router";

Component({
  properties: {
    floor: {
      type: Object,
      value: {},
      observer(now, old) {
        console.log('observer')
        // const nowStr = JSON.stringify(now);
        // const oldStr = JSON.stringify(old);
        if(now.content) {
          this.setBannerList(now.content);
        }
      }
    },
  },

  data: {
    bannerList: [],
  },

  methods: {
    setBannerList(content) {
      let cache = wx.getStorageSync("INTENSIVE_CACHE") || {};
      if(content.dataType === 1) {
        if(cache.bannerList && !!cache.bannerList.length) {
          this.setData({
            bannerList: cache.bannerList
          })
        }
        homeApi.getFloorCustom(content.dataUrl).then(res => {
          this.setData({
            bannerList: res
          });
          cache.bannerList = res;
          wx.setStorageSync("INTENSIVE_CACHE", cache);
        });
      } else {
        this.setData({
          bannerList: content.data
        })
        if(cache.bannerList) {
          delete cache.bannerList;
          wx.setStorageSync("INTENSIVE_CACHE", cache);
        }
      }
    },
    // 跳转详情
    onBanner({
      currentTarget
    }) {
      let data = currentTarget.dataset.data;
      router.getUrlRoute(data.actionUrl);
    },
  }
})
