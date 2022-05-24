import homeApi from "../../../apis/home";
import router from "../../../utils/router";

Component({
  options: {
    addGlobalClass: true,
  },

  properties: {
    floor: {
      type: Object,
      value: {},
      observer(now, old) {
        const nowStr = JSON.stringify(now);
        const oldStr = JSON.stringify(old);
        if(now && now.content) {
          this.setBannerList(now.content);
        }
      }
    },
  },

  data: {
    bannerList: [],
    actIndex: 0,
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
        const takeSpot = wx.getStorageSync("TAKE_SPOT");
        const data = {
          useType: 5,
        }
        if(takeSpot && takeSpot.storeNo) {
          data.storeNo = takeSpot.storeNo
        }
        homeApi.getFloorCustom(content.dataUrl, data).then(res => {
          this.setData({
            bannerList: res
          });
          homeCache.bannerList = res;
          wx.setStorageSync("HOME_CACHE", homeCache);
        });
      } else {
        this.setData({
          bannerList: content.data
        })
        if(homeCache.bannerList) {
          delete homeCache.bannerList;
          wx.setStorageSync("HOME_CACHE", homeCache);
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
    // 监听banner切换
    handleSwiperChange({ detail }) {
      const {
        current,
      } = detail;
      this.setData({
        actIndex: current
      })
    }
  }
})
