import router from "../../../utils/router";

Component({
  options: {
    addGlobalClass: true,
  },

  properties: {
    good: {
      type: Object,
      value: {}
    }
  },

  methods: {
    // 跳转详情
    onToDetail() {
      let data = this.data.good;
      if(!data.id) return;
      router.push({
        name: 'detail',
        data
      });
    },
  }
})
