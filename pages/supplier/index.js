import store from '../../store/index'
import create from '../../utils/create'
import Request from '../../utils/request'

const app = getApp();
create.Page(store, {
  data: {
    supplierId: 0,
    info: {},
    productList: [],
  },

  onLoad: function (options) {
    var id = options.id || 432

    this.setData({
      supplierId:id,
    })
    this.getInfo(id )
    this.getProductList(id)
  },

  onShow() {},

  back() {
    wx.navigateBack({
     delta: 1
   })
  },

  onSupplierMaterial(e) {
    var id = e.currentTarget.dataset.supplierid
    console.log('onSupplierMaterial id ', id)
    wx.navigateTo({
      url: '/pages/suppliermaterial/index?id=' + id,
    })
  },

  // 获取供应商数据
  getInfo(id) {
    Request.post('/goods/open/supplier/detail', {
      supplierId: id,
    }).then(res => {
      console.log("getInfo id ", id, "; res: ", res, '; ')
      this.setData({
        info: res,
      })
    });
  },

  getProductList(id) {
    Request.post('/goods/open/supplier/productList', {
      supplierId: id,
      size: 20,
      next: '0'
    }).then(res => {
      console.log("getProductList id ", id, "; res: ", res, '; ')
      this.setData({
        productList: {
          ...res,
          records: res.records.map(item => {
            return {
              ...item,
              salePrice: item.salePrice / 100,
              marketPrice: item.marketPrice / 100
            }
          }),
        }
      })
    });
  },
})
