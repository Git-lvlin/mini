import { getRelativeTime } from "../../../utils/tools";

Component({
  properties: {
    list: {
      type: Array,
      value: [],
      observer(nVal, oVal) {
        if(JSON.stringify(nVal) != JSON.stringify(oVal)) {
          const nowTime = new Date().getTime();
          nVal.forEach(item => {
            item.leaveStr = getRelativeTime(nowTime - item.leaveTime);
          })
          this.setData({
            userList: nVal,
          });
        }
      },
    },
    top: {
      type: Number,
      value: 136,
    }
  },

  data: {
    userList: [],
  },

  methods: {

  }
})
