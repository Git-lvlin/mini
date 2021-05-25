import { IMG_CDN } from '../../../constants/common'
import router from "../../../utils/router";

Component({

  properties: {
    list: {
      type: Array,
      value: []
    },
    icon: {
      type: String,
      value: `${IMG_CDN}miniprogram/cart/hot.png`
    },
    title: {
      type: String,
      value: "热销好货"
    },
    autoJump: {
      type: Boolean,
      value: true,
    },
  },

  data: {
  },

  methods: {
    onToDetail({ detail }) {
      let {
        autoJump,
      } = this.data;
      let params = {
        id: detail.spuId,
        skuId: detail.skuId,
        orderType: detail.orderType,
      }
      if(!!detail.activityId) params.activityId = detail.activityId;
      if(!!detail.objectId) params.objectId = detail.objectId;
      if(autoJump) {
        router.push({
          name: "detail",
          data: params,
        })
      } else {
        this.triggerEvent("click", detail);
      }
    }

  }
})
