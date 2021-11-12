import router from "../../../../utils/router";
import { getSystemInfo, debounce } from '../../../../utils/tools'
import seckillApi from '../../../../apis/weekSeckill';

Component({
  options: {
    addGlobalClass: true,
  },

  properties: {
    data: {
      type: Object,
      value: {},
    },
    index: {
      type: Number,
    },
    active: {
      type: Number,
    }
  },

  lifetimes: {
    attached: function () {
      this.setData({
        systemInfo: getSystemInfo()
      })
    },
  },

  data: {
    timeData: {},
    itemIndex: 0,
  },

  methods: {
    onScroll(e) {
      this.triggerEvent('setfixed', e.detail.isFixed)
      wx.setNavigationBarColor({
        frontColor: e.detail.isFixed ? '#000000' : '#ffffff',
        backgroundColor: e.detail.isFixed ? '#ffffff' : '#ffffff',
      });
    },
    iconChange(e) {
      this.setData({
        itemIndex: e.detail.current
      })
    },
    onChange(e) {
      this.setData({
        timeData: e.detail,
      });
    },
    onRemind({ currentTarget }) {
      const {
        spuId,
        cmsWeekCode,
        isNotice,
      } = currentTarget.dataset.data;

      if (isNotice === 2) {
        return;
      }
      debounce(() => {
        seckillApi.getXsmsWeekNotice({
          cmsWeekCode,
          cmsWeekId: this.data.data.cmsWeekId,
          spuId,
        }).then(res => {
          this.triggerEvent('onremind', this.data.index)
        })
      }, 300)()
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
        cmsWeekCode,
      } = currentTarget.dataset.data;
      if (cmsWeekCode !== 1) {
        return;
      }
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
