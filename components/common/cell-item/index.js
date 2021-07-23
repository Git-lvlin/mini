
Component({
  options: {
    addGlobalClass: true,
  },
  properties: {
    title: {
      type: String,
      value: "",
    },
    value: {
      type: String,
      value: "",
    },
    jump: {
      type: Boolean,
      value: false, 
    },
    border: {
      type: Boolean,
      value: true, 
    },
    soltRight: {
      type: Boolean,
      value: false, 
    },
    // cell 点击行 value 点击值
    clickType: {
      type: String,
      value: "value", 
    },
  },

  data: {

  },

  methods: {
    onClickCell() {
      const {
        value,
        clickType,
      } = this.data;
      if(clickType == "cell") {
        this.triggerEvent("cell", value);
      }
    },
    onClickValue() {
      const {
        value,
        clickType,
      } = this.data;
      if(clickType == "value") {
        this.triggerEvent("value", value);
      }
    },
  }
})
