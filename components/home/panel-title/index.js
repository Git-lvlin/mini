import router from '../../../utils/router'

Component({
  options: {
    // 在组件定义时的选项中启用多slot支持
    multipleSlots: true,
    addGlobalClass: true,
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
    useDescSlot: {
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
    defMore: {
      type: Boolean,
      value: false,
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
      const routeData = router.getUrlRoute(url);
    }
  }
})
