import create from '../../../utils/create'
import store from '../../../store/index'

create.Component(store, {
  use: [
    'systemInfo',
    'homeData',
  ],
  
  properties: {

  },

  data: {

  },

  methods: {
    onCloseClass() {
      const {
        classGoodV2
      } = this.store.data.homeData;
      classGoodV2.showHomePopup = false;
      this.store.setHomeData({
        classGoodV2
      });
    },
  }
})
