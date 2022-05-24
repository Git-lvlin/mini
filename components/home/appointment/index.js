import homeApi from '../../../apis/home';
import router from '../../../utils/router';
import { showToast, mapNum } from '../../../utils/tools';

let tempSpot = {};

Component({
  options: {
    addGlobalClass: true,
  },

  properties: {
    floor: {
      type: Object,
      value: {},
      observer(now, old) {
        let takeSpot = wx.getStorageSync("TAKE_SPOT") || {};
        takeSpot = takeSpot && takeSpot.storeNo ? takeSpot : {};
        if(takeSpot.storeNo != tempSpot.storeNo) {
          tempSpot = takeSpot;
        }
        if(now && now.content) {
          this.setGoodList(now.content, takeSpot);
        }
      }
    },
    moreRouter: {
      type: String,
      value: ""
    }
  },

  data: {
    goodList: [],
  },

  pageLifetimes: {
    show() {
      // 页面被展示
      const {
        floor,
      } = this.data;
      let takeSpot = wx.getStorageSync("TAKE_SPOT") || {};
      takeSpot = takeSpot && takeSpot.storeNo ? takeSpot : {};
      if(takeSpot.storeNo != tempSpot.storeNo) {
        tempSpot = takeSpot;
        this.setGoodList(floor.content, takeSpot);
      }
    },
  },

  methods: {
    // 设置商品列表数据
    setGoodList(content, spot) {
      if(content.dataType === 1) {
        let homeCache = wx.getStorageSync("HOME_CACHE") || {};
        if(homeCache.goodList && !!homeCache.goodList.length) {
          this.setData({
            goodList: homeCache.goodList
          })
        }
        homeApi.getFloorCustom(content.dataUrl, {
          storeNo: spot.storeNo || ""
        }).then(res => {
          let goodList = mapNum(res.goodsInfo)
          goodList = goodList.slice(0, goodList.length > 2 ? 2 : goodList.length);
          this.setData({
            goodList
          });
          homeCache.goodList = goodList;
          wx.setStorageSync("HOME_CACHE", homeCache);
        });
      } else {
        this.setData({
          goodList: mapNum(content.data)
        })
        if(homeCache.goodList) {
          delete homeCache.goodList;
          wx.setStorageSync("HOME_CACHE", homeCache);
        }
      }
    },
    // 跳转详情
    onToDetail({
      currentTarget
    }) {
      let {
        activityId,
        objectId,
        orderType,
        skuId,
        spuId,
        wsId,
      } = currentTarget.dataset.data;
      if(orderType == 5) {
        showToast({ title: "您还不是店主，暂时不能下单!" });
        return;
      }
      const data = {
        activityId,
        objectId,
        orderType,
        skuId,
        spuId,
        wsId,
      };
      router.push({
        name: 'detail',
        data
      });
    },
  }
})
