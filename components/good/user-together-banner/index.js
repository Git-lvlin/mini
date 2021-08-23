import { getRelativeTime } from "../../../utils/tools";

Component({
  properties: {
    list: {
      type: Array,
      value: [],
      observer(nVal, oVal) {
        if(JSON.stringify(nVal) != JSON.stringify(oVal)) {
          const nowTime = new Date().getTime();
          if(this.data.orderType == 15) {
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
