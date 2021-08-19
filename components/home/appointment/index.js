import homeApi from '../../../apis/home';
import router from '../../../utils/router';
import { mapNum } from '../../../utils/homeFloor';
import { showToast } from '../../../utils/tools';

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
        old = old ? old : {};
        let takeSpot = wx.getStorageSync("TAKE_SPOT") || {};
        const oldData = JSON.stringify(old.content);
        const nowData = JSON.stringify(now.content);
        if(now.content && now.content.dataType) {
          takeSpot = takeSpot && takeSpot.storeNo ? takeSpot : {};
          if(takeSpot.storeNo != tempSpot.storeNo || oldData != nowData) {
            tempSpot = takeSpot;
            this.setGoodList(now.content, takeSpot);
          }
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
    // show() {
      // 页面被展示
    // },
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
          wx.setStorage({
            key: "HOME_CACHE",
            data: homeCache,
          })
        });
      } else {
        this.setData({
          goodList: mapNum(content.data)
        })
        if(homeCache.goodList) {
          delete homeCache.goodList;
          wx.setStorage({
            key: "HOME_CACHE",
            data: homeCache,
          })
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
