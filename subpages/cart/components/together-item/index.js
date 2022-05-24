import util from "../../../../utils/util";

Component({
  options: {
    addGlobalClass: true,
  },

  properties: {
    data: {
      type: Object,
      value: {},
      observer(nVal, oVal) { 
        if(oVal && nVal && oVal.activityEndTime != nVal.activityEndTime) {
          if(nVal && nVal.activityEndTime.length < 13) nVal.activityEndTime = nVal.activityEndTime * 1000;
          let endTime = nVal.activityEndTime - new Date().getTime();
          if(endTime > 0) {
            this.setData({
              endTime,
            })
          }
        }
      }
    },
    border: {
      type: Boolean,
      value: false,
    },
    // def 默认  small 小布局
    type: {
      type: String,
      value: "def"
    },
  },

  data: {
    endTime: 100,
  },

  methods: {
    onToTogether() {
      let data = this.data.data;
      this.triggerEvent("toBuy", data);
    },
    clickShare() {
      let data = this.data.data;
      this.triggerEvent("toShare", data);
    }
  }
})
