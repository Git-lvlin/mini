import { IMG_CDN } from "../../../constants/common"

Component({
  options: {
    addGlobalClass: true,
  },

  properties: {

  },

  data: {
    iconAsc: `${IMG_CDN}miniprogram/common/screen_ASC.png`,
    iconDesc: `${IMG_CDN}miniprogram/common/screen_DESC.png`,
    screenList: [
      {
        text: "综合",
        selected: true,
      },
      {
        text: "销量",
        key: "goodsSaleNum",
        type: "DESC",
        selected: false,
      },
      {
        text: "价格",
        key: "goodsSaleMinPrice",
        type: "DESC", // ASC
        selected: false,
      }
    ],
  },

  methods: {
    onScreen({
      currentTarget,
    }) {
      const {
        index,
      } = currentTarget.dataset;
      const {
        screenList,
      } = this.data;
      const item = { ...screenList[index] };
      let sort = undefined;
      screenList.forEach(item => {
        if(item.type != "DESC" && item.type != undefined) {
          item.type = "DESC"
        }
        item.selected = false;
      });
      if(item.type) {
        item.type = item.type === "DESC" ? "ASC" : "DESC";
        sort = `${item.key}_${item.type}`
        screenList[index].type = item.type;
      }
      screenList[index].selected = true;
      this.setData({
        screenList,
      })
      this.triggerEvent("click", { sort, });
    }
  }
})
