import store from '../../store/index'
import create from '../../utils/create'
import Request from '../../utils/request'
import { getStorageUserInfo } from '../../utils/tools'

const app = getApp();
create.Page(store, {
  data: {
    supplierId: 0,
    captcha: "",
    showInfo: false,
    captchaInput: {
      '1': '',
      '2': '',
      '3': '',
      '4': '',
    },
    onFocus: '1',
    info: {
      companyName: '',
    },
    imgList: [],
  },

  onLoad: function (options) {
    var id = options.id || 432
    this.setData({
      supplierId:id,
    })
    this.changecode()
  },

  onShow() {},

  back() {
    wx.navigateBack({
     delta: 1
   })
  },

  changecode() {
    const userInfo = getStorageUserInfo()
    this.setData({
      captchaInput: {
        '1': '',
        '2': '',
        '3': '',
        '4': '',
      }
    })
    // console.log('userInfo ', userInfo)
    this.getCaptcha(userInfo.id)
  },
  getCodeValue(e) {
    var captchaInput = this.data.captchaInput;
    captchaInput[e.currentTarget.dataset.name] = e.detail.value
    this.setData({
      onFocus: +e.currentTarget.dataset.name + 1,
      captchaInput: captchaInput,
    }, () => {
    console.log('getCodeValue e ', e.detail.value, '; name: ', e.currentTarget.dataset.name, '; captchaInput ', captchaInput, 'this.data.onFocus', this.data.onFocus)
    })

    this.checkCaptchaInput()
  },
  // 计算 checkCaptchaInput 是否输入完毕
  //
  checkCaptchaInput() {
    const keys = Object.keys(this.data.captchaInput)
    var code = ''
    keys.forEach((key, i) => {
      code += this.data.captchaInput[key]
    })
    console.log('getCodeValue code ', code, '; ',  code.length)
    if (code.length > 3) {
      this.getMaterial(code)
    }
  },

  // 获取供应商资质
  // http://rap.ops.yeahgo.com/repository/editor?id=38&mod=623&itf=4908
  getMaterial(code) {
    var that = this

    const userInfo = getStorageUserInfo()

    Request.post('/goods/auth/supplier/getMaterial', {
      supplierId: that.data.supplierId,
      verifyCode: code,
      uniCode: userInfo.id,
    }).then(res => {
      console.log("getCodeValue getMaterial id ", that.data.supplierId, "; res: ", res, '; ')
      var imgList = []
      if (!res.supplierImg) {
        return
      }
      res.supplierImg.forEach((key, i) => {
        imgList = imgList.concat(res.supplierImg[i].imgs)
      })
      this.setData({
        info: res,
        showInfo: true,
        imgList: imgList,
        captcha: '',
      })
    })
  },

  // 获取验证码
  // http://rap.ops.yeahgo.com/repository/editor?id=38&mod=623&itf=4909
  getCaptcha(id) {
    Request.post('/goods/open/supplier/getCaptcha', {
      // 唯一标识，有用户ID传用户ID，没有这要生成唯一标识
      uniCode: id,
      // 类型：1-返回图片，0-返回图片base64位地址
      type: 0,
    }).then(res => {
      console.log("getCaptcha id ", id, "; res: ", res, '; ')
      this.setData({
        captcha: res.url || '',
      })
    });
  },
  //预览图片，放大预览
  preview(e) {
    var that = this
    console.log(e.currentTarget.dataset.src)
    let currentUrl = e.currentTarget.dataset.src
    wx.previewImage({
      current: currentUrl, // 当前显示图片的http链接
      urls: that.data.imgList // 需要预览的图片http链接列表
    })
  },
})
