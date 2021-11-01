import create from '../../../../utils/create'
import store from '../../../../store/index'

create.Component(store, {
  options: {
    addGlobalClass: true,
  },

  use: [
    "systemInfo",
  ],
  
  properties: {
    category: {
      type: Array,
      value: [],
    },
    classId: {
      type: Number,
      value: 0
    }
  },

  data: {
    showClassPopup: false,
  },

  methods: {
    onOpenClass() {
      this.setData({
        showClassPopup: true,
      })
      this.handlePopupshow(true)
    },
  
    onCloseClass() {
      this.setData({
        showClassPopup: false,
      })
      this.handlePopupshow(false)
    },

    handlePopupshow(state) {
      this.triggerEvent("popupShow", { state });
    },
  
    onSelectClass({
      currentTarget
    }) {
      let {
        showClassPopup
      } = this.data;
      if(showClassPopup) showClassPopup = false;
      this.setData({
        showClassPopup,
        classId: currentTarget.dataset.id,
      })
      this.triggerEvent("selectClass", { classId: currentTarget.dataset.id });
    }
  }
})
