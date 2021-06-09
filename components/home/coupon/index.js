import homeApi from '../../../apis/home';
import { IMG_CDN } from '../../../constants/common'
import { mapNum } from '../../../utils/homeFloor';

Component({
  properties: {
    floor: {
      type: Object,
      value: {},
      observer(now, old) {
        const nowStr = JSON.stringify(now);
        const oldStr = JSON.stringify(old);
        if(nowStr != oldStr) {
          this.setCouponList(now.content);
        }
      }
    },
  },

  data: {
    coupon: `${IMG_CDN}miniprogram/home/coupon.png`,
    couponSelect: `${IMG_CDN}miniprogram/home/coupon_select.png`,
    couponList: [],
  },

  methods: {
    setCouponList(content) {
      let homeCache = wx.getStorageSync("HOME_CACHE") || {};
      if(content.dataType === 1) {
        if(homeCache.couponList && !!homeCache.couponList.length) {
          this.setData({
            couponList: mapNum(homeCache.couponList)
          })
        }
        homeApi.getFloorCustom(content.dataUrl).then(res => {
          let list = mapNum(res.couponInfo.records)
          this.setData({
            couponList: list
          })
          homeCache.couponList = list;
          wx.setStorage({
            key: "HOME_CACHE",
            data: homeCache,
          })
        });
      } else {
        this.setData({
          couponList: mapNum(content.data)
        })
        if(homeCache.couponList) {
          delete homeCache.couponList;
          wx.setStorage({
            key: "HOME_CACHE",
            data: homeCache,
          })
        }
      }
    },
  }
})
