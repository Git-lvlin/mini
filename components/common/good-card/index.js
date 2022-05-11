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
      value: true,
    },
    twoTitle: {
      type: Boolean,
      value: false,
    }
  },
  data: {
    type: ''
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
    },
    // 点击跳转店铺
    onToStore() {
      const {
        data
      } = this.data;
      let id = data.storeNo.slice(8, data.storeNo.length);
      id = +id;
      if(id < 123580) return;
      router.push({
        name: "store",
        data: {
          storeNo: data.storeNo,
        },
      })
    }
  }
})
