
Component({
  options: {
    addGlobalClass: true,
  },
  
  properties: {
    data: {
      type: Object,
      value: {},
    }
  },

  data: {

  },

  methods: {
    noToPriceDetail() {
      const {
        data,
      } = this.data;
      this.triggerEvent("click", data);
    },
  }
})
