import homeApi from '../../../apis/home';
import router from '../../../utils/router';
import { mapNum } from '../../../utils/homeFloor';


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
        if(nowStr != oldStr) {
          this.setGoodList(now.content);
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

  methods: {
    // 设置商品列表数据
    setGoodList(content) {
      if(content.dataType === 1) {
        let homeCache = wx.getStorageSync("HOME_CACHE") || {};
        if(homeCache.goodList && !!homeCache.goodList.length) {
          this.setData({
            goodList: homeCache.goodList
          })
        }
        homeApi.getFloorCustom(content.dataUrl, {
          storeNo: "store_m_1"
        }).then(res => {
          let goodList = mapNum(res.goodsInfo)
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
