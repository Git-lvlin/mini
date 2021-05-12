import create from '../../../utils/create';
import store from "../../../store/index";

create.Component(store, {
  use: [
    "systemInfo",
  ],

  options: {
    addGlobalClass: true,
    multipleSlots: true,
  },

  properties: {
    headBackCss: {
      type: String,
      value: "",
    }
  },

  data: {

  },

  methods: {

  }
})
