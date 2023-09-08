import router from "../../../utils/router"
import cartApi from "../../../apis/order"
import format from '../../../utils/format'
import { showModal, showToast } from '../../../utils/tools'

const defaultAreaList = [];
const defaultIndex = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
defaultIndex.forEach(item => {
  defaultAreaList.push({
    letter: item,
    children: []
  });
});
const app = getApp();
Page({
  data: {
    isDefault: false,
    provinceList: [],
    showPopup: false,
    postData: {
      isDefault: false
    },
    areaData: {
      province: [],
      city: [],
      area: [],
    },
    scrollTop: 0,
    selectAddress: {
      isAct: "province",
      province: {},
      city: {},
      area: {},
      areaStr: "",
    },
    editData: {},
    // 是否是编辑状态
    isEdit: false,
    diffName: '',
    diffArea: '',
    subType: ''
  },

  options: {},

  onLoad(options) {
    this.options = options
    this.setData({
        diffName:options.subType==2002?'联系人':'负责人',
        diffArea:options.subType==2002?'合作商所在地':'申请服务区域',
        subType:options.subType
    })
    let editData = options.data;
    if(editData) {
      editData = JSON.parse(editData)
      let {
        postData,
        selectAddress,
      } = this.data;
      const isEdit = true;
      postData = {
        consignee: editData.consignee,
        phone: editData.phone,
        address: editData.address,
        isDefault: editData.isDefault
      }
      selectAddress.areaStr = `${editData.provinceName} ${editData.cityName} ${editData.districtName}`
      this.setData({
        selectAddress,
        editData,
        postData,
        isEdit
      });
    }
  },

  // 输入内容
  handleInput({
    currentTarget,
    detail,
  }) {
    let postData = this.data.postData;
    let field = currentTarget.dataset.field;
    let value = detail.value;
    // if(field === "phone" && !format.checkMobile(value)) {
    //   showToast({ title: "请输入正确手机号" })
    // }
    postData[field] = value;
    this.setData({
      postData,
    })
    
  },

  // 打开省市区弹窗
  onOpenAddress() {
    this.setData({
      showPopup: true,
    })
  },

  // 保存编辑地址区域
  handleEditAddress({
    detail
  }) {
    const {
      selectAddress,
      areaData,
    } = detail;
    this.setData(detail);
  },

  // 关闭省市区弹窗
  onCloseAddress({
    detail
  }) {
    const {
      selectAddress,
      areaData,
    } = detail;
    const data = {
      showPopup: false
    };
    if(!!selectAddress) {
        selectAddress.areaStr = `${selectAddress.province.name} ${selectAddress.city.name} ${selectAddress.area.name?selectAddress.area.name:''}`
      data.selectAddress = selectAddress;
      data.areaData = areaData;
    }
    this.setData(data);
  },

  saveInfo() {
    const {
      selectAddress,
    } = this.data;
    wx.setStorageSync("server_area_info",{
      ...this.data.postData,
      ...this.data.selectAddress,
      provinceId:selectAddress.province.id,
      cityId:selectAddress.city.id,
      districtId:selectAddress.area.id
    })
    router.go()
  },

  // 保存地址
  onSave() {
    const {
      postData,
      selectAddress,
      areaData,
      editData,
      isEdit,
      type
    } = this.data;
    const provinceData = areaData.province[selectAddress.province.pidx].children[selectAddress.province.idx];
    const cityData = areaData.city[selectAddress.city.pidx].children[selectAddress.city.idx];
    let properData = {}
    if (areaData.area.length) {
      properData = areaData.area[selectAddress.area.pidx].children[selectAddress.area.idx];
    }
    postData.provinceName = provinceData.name;
    postData.cityName = cityData.name;
    postData.districtName = properData.name;
    if(format.checkEmpty(postData.consignee)) {
      showToast({ title: "请输入姓名"});
      return;
    } else if(format.checkEmpty(postData.phone)) {
      showToast({ title: "请输入手机号码"});
      return;
    } else if(!format.checkMobile(postData.phone)) {
      showToast({ title: "请输入正确手机号码"});
      return;
    } else if(format.checkEmpty(postData.provinceName)) {
      showToast({ title: "请选择所在地区"});
      return;
    }
    const goodList = wx.getStorageSync("GOOD_LIST")
    const good = goodList.storeGoodsInfos[0].goodsInfos[0]
    const params={
        provinceId:selectAddress.province.id,
        provinceName:provinceData.name,
        cityId:selectAddress.city.id,
        cityName:cityData.name,
        districtId:selectAddress.area.id,
        districtName: properData.name,
        skuId: good.skuId,
        spuId: good.spuId,
    }
    cartApi.checkProvider(params).then(res=>{
      this.saveInfo()
    }).catch(error=>{
        console.log('error',error)
        showToast({ 
            title: error.msg, 
          })
    })
  }
})
