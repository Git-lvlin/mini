import homeApi from '../../../apis/home';
import router from '../../../utils/router';
import { mapNum } from '../../../utils/tools';

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
          this.setGoodList(now.content);
        }
      }
    },
  },

  data: {
    priceRatioGood: [],
  },

  methods: {
    // 设置商品列表数据
    setGoodList(content) {
      let homeCache = wx.getStorageSync("HOME_CACHE") || {};
      if(content.dataType === 1) {
        if(homeCache.priceRatioGood && !!homeCache.priceRatioGood.length) {
          this.setData({
            priceRatioGood: homeCache.priceRatioGood,
          })
        }
        this.getCustomData(1);
      } else {
        this.setData({
          priceRatioGood: mapNum(content.data)
        })
        if(homeCache.priceRatioGood) {
          delete homeCache.priceRatioGood;
          wx.setStorage({
            key: "HOME_CACHE",
            data: homeCache,
          })
        }
      }
    },
    // 获取数据
    getCustomData() {
      let homeCache = wx.getStorageSync("HOME_CACHE") || {};
      const content = this.data.floor.content;
      homeApi.getFloorCustom(content.dataUrl, {
        // page,
        // pageSize,
      }).then(res => {
        let list = mapNum(res);
        this.setData({
          priceRatioGood: list,
        });
        homeCache.priceRatioGood = list
        wx.setStorage({
          key: "HOME_CACHE",
          data: homeCache,
        })
      });
    },

    // 跳转详情
    onGood({
      currentTarget
    }) {
      let {
        spuId,
        skuId,
        activityId,
        objectId,
        orderType,
      } = currentTarget.dataset.data;
      router.push({
        name: 'detail',
        data: {
          spuId,
          skuId,
          activityId,
          objectId,
          orderType,
        }
      });
    },
    onToList() {
      const {
        floor,
      } = this.data;
      if(floor.header.title) {
        const head = floor.header.title[0];
        router.getUrlRoute(head.actionUrl);
      }
    },
  }
})
