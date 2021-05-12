
Component({

  properties: {
    num: {
      type: Number,
      value: 0,
    },
  },

  data: {

  },

  methods: {
    handleInput({
      detail
    }) {
      let num = Number(detail.value) || this.data.num;
      this.triggerEvent("change", num)
    }
  }
})
