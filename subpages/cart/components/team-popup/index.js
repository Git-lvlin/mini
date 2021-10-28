
Component({

  properties: {
    list: {
      type: Array,
      valueL: [],
    },
    show: {
      type: Boolean,
      value: false,
    }
  },

  data: {

  },

  methods: {
    onClose() {
      this.triggerEvent("close", false);
    },
    onToCreate({
      detail
    }) {
      this.triggerEvent("toBuy", detail);
    }
  }
})
