import homeApi from "../../../apis/home";
import router from "../../../utils/router";

Component({
  properties: {
    remindList: {
      type: Object,
      value: {},
      observer(now, old) {
        console.log('now', now)
        // const nowStr = JSON.stringify(now);
        // const oldStr = JSON.stringify(old);
        if(now) {
          this.setList(now);
        }
      }
    },
  },

  data: {
    listData: [],
    currentTime: 1123123, // 系统当前时间
    size: 10,
    page: 1,
    total: 1,
    totalPage: 2,
    timeData: {},
    flag: true,
  },
  onChange(e) {
    this.setData({
      timeData: e.detail,
    });
  },
  methods: {
    setList(data) {
      this.setData({
        listData: data
      })
    },
    // 提醒店主采购
    remind(e) {
      let spot = wx.getStorageSync("TAKE_SPOT") || {};
      let { wsId, spuId, skuId, isRemind } = e.currentTarget.dataset.item
      if (!isRemind && this.data.flag) {
        this.setData({flag: false})
        let params = {
          wsId: wsId,
          skuId: skuId,
          spuId: spuId,
          storeNo: spot.storeNo || ''
        }
        homeApi.remindStorekeeperBuy(params).then((res) => {
          this.getRecommendData()
        });
      }
    },
    // 提醒采购商品列表
    getRecommendData() {
      let spot = wx.getStorageSync("TAKE_SPOT") || {};
      let params = {
        page: 1,
        size: 99,
        storeNo: spot.storeNo || '',
      }
      return new Promise((reject) => {
        homeApi.getStoreNotInSkus(params).then(res => {
          this.setData({
            listData: res
          }, () => {
            this.setData({flag: true})
            reject()
          })
        });
      })
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
  }
})
