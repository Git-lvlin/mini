import create from '../../../utils/create'
import store from '../../../store/index'
import { IMG_CDN } from '../../../constants/index'

create.Component(store, {
  use: [
    "systemInfo"
  ],

  /**
   * 组件的属性列表
   */
  properties: {
    classPopupState: {
      type: Boolean,
      value: false,
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    showClassPopup: false,
    bottomBarHeight: 104,
    icon: IMG_CDN + "miniprogram/cart/select_icon.png",
    selectIcon: IMG_CDN + "miniprogram/cart/selected_icon.png",
  },

  ready() {
    const {
      systemInfo
    } = this.data.$;
    let bottomBarHeight = systemInfo.bottomBarHeight + 104;
    this.setData({
      bottomBarHeight
    });
  },

  /**
   * 组件的方法列表
   */
  methods: {

    onOpenCart() {
      this.setData({
        showClassPopup: true,
      })
    },

    onCloseCart() {
      this.setData({
        showClassPopup: false,
      })
    }
  }
})
