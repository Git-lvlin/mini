import router from "../../../utils/router";

Component({
  options: {
    addGlobalClass: true
  },

  properties: {
    size: {
      type: String,
      value: "240rpx"
    },
    data: {
      type: Object,
      value: {},
    },
    priceTitle: {
      type: String,
      value: "",
    },
    jump: {
      type: Boolean,
      value: true,
    }
  },

  data: {

  },

  methods: {
    onToDetail() {
      let {
        data,
        jump,
      } = this.data;
      if(jump) {
        let params = {
          spuId: data.id,
          skuId: data.defaultSkuId,
        };
        params.activityId = data.activityId || 0;
        params.objectId = data.objectId || 0;
        if(!!data.orderType) params.orderType = data.orderType;
        router.push({
          name: "detail",
          data: params
        })
      } else {
        this.triggerEvent("click", data);
      }
    }
  }
})
