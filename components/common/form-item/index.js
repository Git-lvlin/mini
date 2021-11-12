
Component({
  options: {
    addGlobalClass: true,
  },

  properties: {
    name: {
      type: String,
      value: "标题"
    },
    label: {
      type: String,
      value: ""
    },
    value: {
      type: String,
      value: ""
    },
    roundTop: {
      type: Boolean,
      value: false,
    },
    roundBottom: {
      type: Boolean,
      value: false,
    },
    border: {
      type: Boolean,
      value: true,
    },
    inputType: {
      type: String,
      value: "text"
    },
    maxLength: {
      type: String,
      value: "200"
    },
    read: {
      type: Boolean,
      value: false,
    },
    // 输入框文字对齐方式
    textAlign: {
      type: String,
      value: "",
    },
    placeholder: {
      type: String,
      value: ""
    },
    slotRight: {
      type: Boolean,
      value: false
    }
  },
  data: {

  },

  methods: {
    handleInput({
      detail
    }) {
      const {
        label,
        name,
      } = this.data;
      if(!label) showToast({ title: `请确认${name}参数名` });
      this.triggerEvent("input", {
        label,
        value: detail.value
      })
    }
  }
})
