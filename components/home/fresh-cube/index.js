import homeApi from '../../../apis/home';
import router from '../../../utils/router'
import { IMG_CDN } from "../../../constants/common";
Component({
  timer: null,

  options: {
    addGlobalClass: true,
  },

  properties: {
    floor: {
      type: Object,
      value: {},
      async observer(now, old) {
        if (now && now.content) {
          let title = now.header.title;
          // 首先确定唯一接口
          let takeSpot = wx.getStorageSync("TAKE_SPOT") || {};
          if (!takeSpot.storeNo) {
            return
          } else {
            this.setData({storeNo: takeSpot.storeNo})
          }
          await this.getData(now.content.dataUrl)
          if (title.length == 2) {
            console.log('fresh', this.data.fresh)
            const {cent, spec} = this.data.fresh
            this.setData({
              cent: {
                title: title[0],
                fresh: cent,
              },
              spec: {
                title: title[1],
                fresh: spec,
              },
            })
          }
        }
        
      }
    },
  },

  data: {
    cents: null,
    specs: null,
    fresh: {},
    icon: `${IMG_CDN}miniprogram/common/icon/home-fresh-right.png`,
    // storeNo: 'store_m_124912',
    storeNo: null
  },

  methods: {
    // 获取17楼层（1分钱&特价生鲜）数据
    getData(dataUrl) {
      return new Promise((resolve, reject) => {
        let param = {
          storeNo: this.data.storeNo
        }
        homeApi.getAcarea(dataUrl, param, {hasBase: true}).then(res => {
          this.setData({
            fresh: res
          }, () => {
            resolve()
          })
        })
      })
    },

    // 跳转
    onToClass({
      currentTarget
    }) {
      let data = currentTarget.dataset.data;
      if(!!data.actionUrl) {
        const param = data.actionUrl + `&storeNo=${this.data.storeNo}`
        router.getUrlRoute(param);
      }
    },
    onToDetail({currentTarget}) {
      let data = currentTarget.dataset.data;
      let params = {
        spuId: data.spuId,
        skuId: data.skuId,
      };
      params.activityId = data.activityId || 0;
      params.objectId = data.objectId || 0;
      if(!!data.orderType) params.orderType = data.orderType;
      router.push({
        name: "detail",
        data: params
      })
    }
  }
})
