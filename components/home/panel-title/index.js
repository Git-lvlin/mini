import router from '../../../utils/router'
import appRouter from '../../../constants/appRouter'

Component({
  options: {
    // 在组件定义时的选项中启用多slot支持
    multipleSlots: true
  },
  properties: {
    title: {
      type: String,
      value: "",
    },
    desc: {
      type: String,
      value: "",
    },
    color: {
      type: String,
      value: "#333",
    },
    moreColor: {
      type: String,
      value: "#333",
    },
    center: {
      type: Boolean,
      value: false,
    },
    useTitleSlot: {
      type: Boolean,
      value: false,
    },
    more: {
      type: Boolean,
      value: false,
    },
    moreText: {
      type: String,
      value: "",
    },
    actionUrl: {
      type: String,
      value: "",
    },
  },

  data: {

  },

  methods: {
    onToUrl() {
      let url = this.data.actionUrl;
      let jumpKey = "";
      for(let key in appRouter) {
        if(url === appRouter[key]) {
          jumpKey = key;
        }
      }
      if(!!jumpKey) {
        router.push({
          name: jumpKey,
        })
      }
      console.log("跳转链接", url);
      return ;
      if(!!url) {
        router.push({
          name: url
        })
      }
    }
  }
})
