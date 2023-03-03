// pages/community/main/index.js
import commonApis from '../../../apis/common'
import healthyPackageApis from '../../../apis/healthyPackage'
import fingerDoctorApi from '../../../apis/fingerDoctor'
import router from '../../../utils/router'
import create from '../../../utils/create.js'
import store from '../../../store/index'
import { SYS_ENV } from '../../../constants/index'
import { getPayInfo } from '../../../utils/orderPay'
import { showToast } from '../../../utils/tools'


import dayjs from 'dayjs'
// import { getBaseApiUrl, handleErrorCode, showModal, setLoginRouter, clearLoginInfo } from '../../utils/tools'

create.Page(store, {
  use: [
    "systemInfo"
  ],

  /**
   * 页面的初始数据
   */
  data: {
    birthdayShow: false,
    genderShow: false,
    genderColumns: ['男', '女'],
    birthday: '',
    height: '',
    weight: '',
    phone: '',
    name: '',
    gender: '',
    birthdayError: '',
    heightError: '',
    weightError: '',
    phoneError: '',
    nameError: '',
    genderError: '',
    address: '',
    identityNo: '',
    packageId: '',
    email: '',
    emergencyContact: '',
    packages: [],
    maxDate: '2007-12-31',
    minDate: '1924-01-01',
    formatter(type, value) {
      if (type === 'year') {
        return `${value}年`;
      }
      if (type === 'month') {
        return `${value}月`;
      }
      return `${value}日`;
    },
    currentDate: '1968-06-15',
    isPay: false,
  },
  validate: {},

  options: {},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.options = options

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    fingerDoctorApi.getPackage()
      .then(res1 => {
        this.setData({
          packages: res1.package,

        })
        this.validate = res1.validate

        fingerDoctorApi.getUser()
          .then(res => {
            for (const key in res) {
              if (!['gender', 'packageId'].includes(key)) {
                this.setData({
                  [key]: res[key]
                })
              }
            }
            this.setData({
              gender: { 'men': '男', 'women': '女' }[res.gender],
              packageId: res1.package.find(item => item.packageId === res.packageId)?.name
            })
          })
      })
  },
  getAge(strBirthday) {
    var returnAge;
    // 根据生日计算年龄
    //以下五行是为了获取出生年月日，如果是从身份证上获取需要稍微改变一下
    var strBirthdayArr = strBirthday.split("-");
    var birthYear = strBirthdayArr[0];
    var birthMonth = strBirthdayArr[1];
    var birthDay = strBirthdayArr[2];

    const d = new Date();
    var nowYear = d.getFullYear();
    var nowMonth = d.getMonth() + 1;
    var nowDay = d.getDate();

    if (nowYear == birthYear) {
      returnAge = 0;//同年 则为0岁
    }
    else {
      var ageDiff = nowYear - birthYear; //年之差
      if (ageDiff > 0) {
        if (nowMonth == birthMonth) {
          var dayDiff = nowDay - birthDay;//日之差
          if (dayDiff < 0) {
            returnAge = ageDiff - 1;
          }
          else {
            returnAge = ageDiff;
          }
        }
        else {
          var monthDiff = nowMonth - birthMonth;//月之差
          if (monthDiff < 0) {
            returnAge = ageDiff - 1;
          }
          else {
            returnAge = ageDiff;
          }
        }
      }
      else {
        returnAge = -1;//返回-1 表示出生日期输入错误 晚于今天
      }
    }

    return returnAge;//返回周岁年龄

  },
  genderShowOpen() {
    this.setData({
      genderShow: true
    })
  },
  genderShowClose() {
    this.setData({
      genderShow: false
    })
  },
  genderConfirm({ detail }) {
    this.setData({
      gender: detail.value
    })
    this.genderShowClose()
    this.setData({
      packageId: this.data.packages.find(item => item.name.includes(detail.value)).name
    })
  },
  birthdayShowOpen() {
    this.setData({
      birthdayShow: true
    })
  },
  birthdayShowClose() {
    this.setData({
      birthdayShow: false
    })
  },
  birthdayConfirm({ detail }) {
    this.setData({
      birthday: detail.value
    })
    // this.birthdayShowClose()
    this.checkBirthday()
  },
  checkName() {
    if (this.data.name.replace(/\s/, '') === '') {
      this.setData({
        nameError: '请输入姓名'
      })
    } else {
      this.setData({
        nameError: ''
      })
    }
  },
  checkGender() {
    if (this.data.gender === '') {
      this.setData({
        genderError: '请选择性别'
      })
    } else {
      this.setData({
        genderError: ''
      })
    }
  },
  checkBirthday() {
    const cha = this.getAge(dayjs(this.data.birthday).format('YYYY-MM-DD'))
    if (this.data.birthday === '') {
      this.setData({
        birthdayError: '请选择年龄'
      })
    } else if (cha < this.validate.birthday.min || cha > this.validate.birthday.max) {
      this.setData({
        birthdayError: this.validate.birthday.message
      })
    } else {
      this.setData({
        birthdayError: ''
      })
    }
  },
  checkHeight() {
    if (this.data.height === '') {
      this.setData({
        heightError: '请输入身高'
      })
    } else if (+this.data.height < this.validate.height.min || +this.data.height > this.validate.height.max) {
      this.setData({
        heightError: this.validate.height.message
      })
    } else {
      this.setData({
        heightError: ''
      })
    }
  },
  checkWeight() {
    if (this.data.weight === '') {
      this.setData({
        weightError: '请输入体重'
      })
    } else if (+this.data.weight < this.validate.weight.min || +this.data.weight > this.validate.weight.max) {
      this.setData({
        weightError: this.validate.weight.message
      })
    } else {
      this.setData({
        weightError: ''
      })
    }
  },
  checkPhone() {
    if (!/1\d{10}/.test(`${this.data.phone}`)) {
      this.setData({
        phoneError: '请输入11位手机号'
      })
    } else {
      this.setData({
        phoneError: ''
      })
    }
  },
  check() {
    this.checkName()
    this.checkGender()
    this.checkBirthday()
    this.checkHeight()
    this.checkWeight()
    this.checkPhone()
  },
  submit() {
    this.check()
    const userInfo = wx.getStorageSync("USER_INFO") || {}
    const OPENID = wx.getStorageSync("OPENID") || {}
    const { birthday, height, weight, phone, name, gender, address, identityNo, packageId, email, emergencyContact } = this.data
    fingerDoctorApi.editUser({
      emergencyContact,
      birthday,
      height,
      weight,
      phone,
      name,
      gender: { '男': 'men', '女': 'women' }[gender],
      address,
      identityNo,
      packageId: this.data.packages.find(item => item.name.includes(packageId))?.packageId,
      email,
      openId: OPENID,
      unionId: userInfo.uId,
    }).then(_ => {
      fingerDoctorApi.createStartOrder({
        imei: this.options.imei
      })
        .then(res => {
          if (res.type === 1) {
            getPayInfo({
              id: res.id,
              payType: SYS_ENV === 'uat' ? 0 : 7,
              pullPayment: !SYS_ENV === 'uat',
            }).then(_ => {
              this.setData({
                isPay: true,
              })
              wx.requestSubscribeMessage({
                tmplIds: ['xveUu4hH3xVklw5G2NTzDLq3wNFbLXQFlRBo1O_7Dgg'],
                success(res) { }
              })
            })
          } else {
            showToast({ title: res.tips })
          }
        })
    })

  },
  goback() {
    router.go()
  },
})
