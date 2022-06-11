import { getRelativeTime } from "../../../../utils/tools";

Component({
  properties: {
    list: {
      type: Array,
      value: [],
      observer(nVal, oVal) {
        if(JSON.stringify(nVal) != JSON.stringify(oVal)) {
          const nowTime = new Date().getTime();
          if(this.data.orderType == 15 || this.data.orderType == 3) {
            nVal.forEach(item => {
              item.leaveStr = getRelativeTime(nowTime - item.leaveTime);
            })
          }
          this.setData({
            userList: nVal,
          });
        }
      },
    },
    style: {
      type: String,
      value: "",
    },
    back: {
      type: String,
      value: "rgba(0, 0, 0, 0.6)",
    },
    width: {
      type: String,
      value: '100%',
    },
    color: {
      type: String,
      value: '#ffffff',
    },
    top: {
      type: Number,
      value: 136,
    },
    orderType: {
      type: Number,
      value: 2,
    }
  },

  data: {
    userList: [],
  },

  methods: {

  }
})
