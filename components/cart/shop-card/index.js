import Toast from '../../../miniprogram_npm/@vant/weapp/toast/toast';

Component({
  options: {
    addGlobalClass: true
  },

  properties: {
    data: {
      type: Object,
      value: {}
    }
  },

  data: {

  },

  methods: {

    onReduceNum({
      currentTarget,
    }){
      let {
        data
      } = this.data;
      let index = currentTarget.dataset.index;
      if(data.goods[index].num < 2) {
        Toast({
          message:"至少添加一个商品",
          context: this,
        });
        return
      }
      data.goods[index].num -= 1;
      this.setData({
        data,
      })
    },

    onAddNum({
      currentTarget,
    }){
      let {
        data
      } = this.data;
      let index = currentTarget.dataset.index;
      if(data.goods[index].num >= data.goods[index].stock) {
        Toast({
          message:"哎呀，没有库存啦",
          context: this,
        });
        return
      }
      data.goods[index].num += 1;
      this.setData({
        data,
      })
    }
  }
})
