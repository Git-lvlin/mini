import homeApi from "../../../apis/home";
import router from "../../../utils/router";

Component({
  options: {
    styleIsolation: 'shared'
  },
  properties: {
    intensiveList: {
      type: Object,
      value: {},
      observer(now, old) {
        // const nowStr = JSON.stringify(now);
        // const oldStr = JSON.stringify(old);
        if(now.records) {
          this.setListData(now);
        }
      }
    },
  },

  data: {
    listData: {},
  },
  methods: {
    setListData(data) {
      data.records = data.records.map((item) => {
        return {
          ...item,
          time: item.deadlineTime - data.currentTime
        }
      })
      this.setData({
        listData: data,
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
