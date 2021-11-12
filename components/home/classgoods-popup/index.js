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
    
    // 点击二级分类
    onSecondClass({
      currentTarget,
    }) {
      const {
        data,
      } = currentTarget.dataset;
      router.push({
        name: "classGood",
        data: {
          id: data.gcId,
          pid: data.gcParentId,
          name: data.gcName,
        }
      })
    },
  }
})
