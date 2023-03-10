import router from "../../../utils/router";


Component({

  properties: {
    text: {
      type: 'string'
    },
    orderType:{
      type: 'string'
    }
  },

  data: {
    orderType: ''
  },

  ready() {
  },

  methods: {
    go() {
      router.push({
        name: "healthyPackageLocation",
        data: {
          orderType:this.data.orderType
        }
      });
    }
  }
})
