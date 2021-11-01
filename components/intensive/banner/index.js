import homeApi from "../../../apis/home";
import router from "../../../utils/router";

Component({
  properties: {
    images: {
      type: Array,
      value: [],
      observer(now, old) {
        // const nowStr = JSON.stringify(now);
        // const oldStr = JSON.stringify(old);
        if(now) {
          this.setBannerList(now);
        }
      }
    },
  },

  data: {
    bannerList: [],
  },

  methods: {
    setBannerList(data) {
      this.setData({
        bannerList: data
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
