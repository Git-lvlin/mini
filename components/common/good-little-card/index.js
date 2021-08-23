import router from "../../../utils/router";

Component({
  options: {
    addGlobalClass: true,
  },

  properties: {
    good: {
      type: Object,
      value: {}
    }
  },

  methods: {
    // 跳转详情
    onToDetail() {
      let {
        activityId,
        objectId,
        orderType,
        skuId,
        spuId,
        wsId,
      } = this.data.good;
      if(!spuId) return;
      router.push({
        name: 'detail',
        data: {
          activityId,
          objectId,
          orderType,
          skuId,
          spuId,
          wsId,
        }
      });
    },
  }
})
