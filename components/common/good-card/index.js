import router from "../../../utils/router";

Component({
  options: {
    addGlobalClass: true
  },

  properties: {
    size: {
      type: String,
      value: "344rpx"
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
      value: false,
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
          spuId: data.spuId,
          skuId: data.skuId,
        };
        if(!!data.activityId) params.activityId = data.activityId;
        if(!!data.orderType) params.activityId = data.orderType;
        if(!!data.objectId) params.objectId = data.objectId;
        console.log(params);
      } else {
        this.triggerEvent("click", data);
      }
    }
  }
})
