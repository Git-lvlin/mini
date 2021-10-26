import homeApi from "../../../apis/home";
import router from "../../../utils/router";

Component({
  options: {
    styleIsolation: 'shared'
  },
  properties: {
    floor: {
      type: Object,
      value: {},
      observer(now, old) {
        console.log('observer')
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
    nowTime: 0,
    timeData: {},
  },
  methods: {
    onChange(e) {
      this.setData({
        timeData: e.detail,
      });
    },
    setStyle() {
      get
    },
    setListData(data) {
      data.records = data.records.map((item) => {
        return {
          ...item,
          time: item.deadlineTime - data.currentTime
        }
      })
      this.setData({
        listData: data,
        nowTime: data.currentTime
      })
    },
    // 跳转详情
    onBanner({
      currentTarget
    }) {
      let data = currentTarget.dataset.data;
      router.getUrlRoute(data.actionUrl);
    },
  }
})
