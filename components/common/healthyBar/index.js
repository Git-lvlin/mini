import router from "../../../utils/router";


Component({

  properties: {
    text: {
      type: 'string'
    }
  },

  data: {},

  ready() {
  },

  methods: {
    go() {
      router.push({
        name: "healthyPackageLocation",
        data: {}
      });
    }
  }
})
