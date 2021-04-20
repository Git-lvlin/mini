import create from '../../../utils/create'
import store from '../../../store/good'
import router from '../../../utils/router'
import { IMG_CDN, PAY_TYPE_KEY } from '../../../constants/common'
import { getResourceDetail } from '../../../apis/common'

const defaultList = [

]

create.Page(store, {

  data: {
    chooseIcon: `${IMG_CDN}miniprogram/common/choose.png`,
    defChooseIcon: `${IMG_CDN}miniprogram/common/def_choose.png`,
    payList: defaultList,
    disableChoose: true,
  },

  onLoad: function (options) {
    // 获取支付类型
    getResourceDetail({
      resourceKey: PAY_TYPE_KEY,
    }).then(res => {
      this.setData({
        payList: res.data.records
      })
    })
  },

  onShow: function () {

  },

  onHide: function () {

  },

  onChangeType({
    currentTarget
  }) {
    let payList = this.data.payList;
    let index = currentTarget.dataset.index;
    payList.forEach((item, idx) => {
      if(index === idx) {
        item.default = 1;
      } else {
        item.default = 0;
      }
    });
    this.setData({
      payList,
    })
  }
})