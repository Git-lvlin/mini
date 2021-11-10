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
  },

  onLoad(options) {
    // let editData = wx.getStorageSync("EDIT_ADDRESS");
    let editData = options.data;
    if(!!editData) {
      editData = JSON.parse(editData);
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
    app.trackEvent('address_editAddress', {
      type: 'address'
    });
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

  // 打开默认按钮
  handleSwitch() {
    this.setData({
      "postData.isDefault": !this.data.postData.isDefault
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
    if(!!selectAddress && selectAddress.area.name) {
    //   selectAddress.province = {};
    //   selectAddress.city = {};
    // } else {
      selectAddress.areaStr = `${selectAddress.province.name} ${selectAddress.city.name} ${selectAddress.area.name}`
      data.selectAddress = selectAddress;
      data.areaData = areaData;
    }
    this.setData(data);
  },

  // 保存地址
  onSave() {
    const {
      postData,
      selectAddress,
      areaData,
      editData,
      isEdit,
    } = this.data;
    const provinceData = areaData.province[selectAddress.province.pidx].children[selectAddress.province.idx];
    const cityData = areaData.city[selectAddress.city.pidx].children[selectAddress.city.idx];
    const properData = areaData.area[selectAddress.area.pidx].children[selectAddress.area.idx];
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
    } else if(format.checkEmpty(postData.districtName)) {
      showToast({ title: "请选择所在地区"});
      return;
    } else if(format.checkEmpty(postData.address)) {
      showToast({ title: "请输入详细地址"});
      return;
    }
    if(isEdit) {
      postData.id = editData.id;
      cartApi.updateAddress(postData).then(res => {
        showToast({ 
          title: "保存成功", 
          ok() {
            router.go();
          } 
        })
      });
    } else {
      cartApi.addAddress(postData).then(res => {
        showToast({ 
          title: "添加成功", 
          ok() {
            router.go();
          } 
        })
      });
    }
  },

  // 删除地址
  onDeleteAddress() {
    const {
      editData
    } = this.data;
    const ids = [editData.id]
    showModal({
      content: "您确定要删除地址吗？",
      ok() {
        cartApi.removeAddress({
          ids
        }).then(res => {
          showToast({ 
            title: "删除成功", 
            ok() {
              router.go();
            } 
          })
        })
      }
    })
  },
})