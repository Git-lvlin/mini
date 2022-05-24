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
    tagLogo: "",
    logoTitle: "",
    seckillList: [],
  },

  methods: {
    // 设置豆腐块
    setClassList(content) {
      let homeCache = wx.getStorageSync("HOME_CACHE") || {};
      if(content.dataType === 1) {
        if(homeCache.seckillList && !!homeCache.seckillList.length) {
          this.setData({
            tagLogo: homeCache.tagLogo,
            logoActionUrl: homeCache.logoActionUrl,
            seckillList: homeCache.seckillList
          })
        }
        homeApi.getFloorCustom(content.dataUrl).then(res => {
          let list = res.records;
          // list = mapNum(list);
          homeCache.tagLogo = res.tagLogo;
          homeCache.logoTitle = res.logoTitle;
          homeCache.logoActionUrl = res.logoActionUrl;
          homeCache.seckillList = list;
          this.setData({
            tagLogo: res.tagLogo,
            logoTitle: res.logoTitle,
            logoActionUrl: res.logoActionUrl,
            seckillList: list
          });
          wx.setStorageSync("HOME_CACHE", homeCache);
        });
      } else {
        let list = content.data;
        // list = mapNum(list);
        this.setData({
          tagLogo: content.tagLogo,
          logoTitle: content.logoTitle,
          logoActionUrl: content.logoActionUrl,
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
      let {
        logoActionUrl,
        logoTitle,
      } = this.data;
      if(!!logoActionUrl) {
        const mark = logoActionUrl.toString().indexOf('?') > -1 ? true : false;
        logoActionUrl = `${logoActionUrl}${mark ? '&' : '?'}navTitle=${logoTitle || ''}`
        router.getUrlRoute(logoActionUrl);
      }
      // router.push({
      //   name: 'popularGood',
      //   data: {}
      // })
    },
  }
})
