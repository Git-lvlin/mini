import homeApi from '../../../apis/home';
import router from '../../../utils/router'
import { mapNum } from '../../../utils/tools';

Component({
  timer: null,

  options: {
    addGlobalClass: true,
  },

  properties: {
    floor: {
      type: Object,
      value: {},
      observer(now, old) {
        if(now && now.content) {
          this.setClassList(now.content);
        }
      }
    },
  },

  data: {
    scrollListWidth: 0,
    seckillList: [],
  },

  methods: {
    // 设置豆腐块
    setClassList(content) {
      let homeCache = wx.getStorageSync("HOME_CACHE") || {};
      if(content.dataType === 1) {
        if(homeCache.seckillList && !!homeCache.seckillList.length) {
          this.setData({
            seckillList: homeCache.seckillList
          })
        }
        homeApi.getFloorCustom(content.dataUrl).then(res => {
          let list = res.records;
          // list = mapNum(list);
          homeCache.seckillList = list;
          this.setData({
            seckillList: list
          });
          wx.setStorageSync("HOME_CACHE", homeCache);
        });
      } else {
        let list = content.data;
        // list = mapNum(list);
        this.setData({
          seckillList: list
        })
        if(homeCache.seckillList) {
          delete homeCache.seckillList;
          wx.setStorageSync("HOME_CACHE", homeCache);
        }
      }
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

    // 跳转秒杀爆款
    onToPopularGood() {
      if(!this.data.seckillList.length) {
        return;
      } 
      router.push({
        name: 'popularGood',
        data: {}
      })
    },
  }
})
