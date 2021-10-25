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
    listData: [
      {
        goodsName: '已售进度条已售进度条已售进度条已售进度条已售进度条已售进度条',
        goodsImageUrl: '',
        goodsSalePrice: 10000,
        stockNum: 123, // 库存
        saleNumDisplay: 51, // 已售进度条
        deadlineTime: 30 * 60 * 60 * 1000, // 结束时间戳
      },
      {
        goodsName: 'adasdasd',
        goodsImageUrl: '',
        goodsSalePrice: 10000,
        stockNum: 123, // 库存
        saleNumDisplay: 51, // 已售进度条
        deadlineTime: 30 * 60 * 60 * 1000, // 结束时间戳
      }
    ],
    currentTime: 1123123, // 系统当前时间
    size: 10,
    page: 1,
    total: 1,
    totalPage: 2,
    timeData: {},
  },
  onChange(e) {
    this.setData({
      timeData: e.detail,
    });
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
