import router from "../../../utils/router"
import cartApi from "../../../apis/cart"
import { getPinYin } from '../../../utils/pinyin'
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

Page({
  // 是否是编辑状态
  isEdit: false,
  editFristLoad: true,

  data: {
    isDefault: false,
    provinceList: [],
    areaList: {},
    showPopup: false,
    postData: {
      isDefault: false
    },
    letterList: defaultIndex,
    areaList: defaultAreaList,
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
  },

  onLoad: function (options) {
    // let editData = wx.getStorageSync("EDIT_ADDRESS");
    let editData = options.data;
    if(!!editData) {
      editData = JSON.parse(editData);
      let {
        postData
      } = this.data;
      this.isEdit = true;
      postData = {
        consignee: editData.consignee,
        phone: editData.phone,
        address: editData.address,
        isDefault: editData.isDefault
      }
      this.setData({
        editData,
        postData,
      }, () => {
        this.getProvince();
      })
    } else {
      this.getProvince();
    }
  },

  // 获取省份
  getProvince() {
    cartApi.getProvince().then(res => {
      const {
        areaData,
        editData,
      } = this.data;
      let selectData = {};
      if(this.isEdit) {
        selectData = {
          id: editData.provinceId,
          type: "province",
        }
        this.getArea(editData.provinceId);
      }
      let areaList = this.mapAddreass(res, selectData);
      areaData.province = areaList;
      this.setData({
        areaData,
        areaList,
      })
    });
  },

  // 获取地级市
  getArea(id, isCity = true) {
    const {
      editData
    } = this.data;
    cartApi.getArea({
      id
    }).then(res => {
      let areaData = this.data.areaData;
      let selectData = {};
      if(this.isEdit && isCity && this.editFristLoad) {
        selectData = {
          id: editData.cityId,
          type: "city",
        }
        this.getArea(editData.cityId, false);
      } else if(this.isEdit && !isCity) {
        selectData = {
          id: editData.districtId,
          type: "area",
        }
      }
      let areaList = this.mapAddreass(res, selectData);
      if(isCity) {
        areaData.city = areaList;
      } else {
        areaData.area = areaList;
      }
      this.setData({
        areaList,
        areaData
      })
    });
  },

  // 格式化区域数据
  mapAddreass(list = [], selectData = {}) {
    let letterList = [];
    let selectAddress = this.data.selectAddress;
    let areaList = JSON.stringify(defaultAreaList);
    areaList = JSON.parse(areaList);
    let hasLetter = false;
    list.forEach(item => {
      let letter = getPinYin(item.name);
      areaList.forEach((child, pidx) => {
        hasLetter = false;
        if(child.letter === letter) {
          child.children.push({
            name: item.name,
            id: item.id,
            data: item,
          });
          if(!!selectData.type && selectData.id === item.id && this.editFristLoad) {
            selectAddress[selectData.type] = {
              ...selectAddress[selectData.type],
              ...item,
            }
            selectAddress[selectData.type].pidx = pidx;
            selectAddress[selectData.type].idx = child.children.length - 1;
            if(selectData.type === "area") {
              selectAddress.areaStr = `${selectAddress.province.name} ${selectAddress.city.name} ${selectAddress.area.name}`
              selectAddress.isAct = "area";
              this.editFristLoad = false;
            }
          }
          letterList.forEach(item => {
            if(item === child.letter) {
              hasLetter = true;
            }
          })
          if(!hasLetter) {
            letterList.push(child.letter)
          }
        }
      })
    });
    letterList = letterList.sort();
    this.setData({
      letterList,
      areaList,
      selectAddress,
    });
    return areaList;
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

  // 关闭省市区弹窗
  onCloseAddress() {
    const {
      selectAddress
    } = this.data;
    if(!selectAddress.area.name) {
      selectAddress.province = {};
      selectAddress.city = {};
    } else {
      selectAddress.areaStr = `${selectAddress.province.name} ${selectAddress.city.name} ${selectAddress.area.name}`
    }
    this.setData({
      selectAddress,
      showPopup: false,
    })
  },

  // 选择地区类型
  onSelectAddressType({
    currentTarget
  }) {
    let {
      selectAddress,
      areaData,
    } = this.data;
    let type = currentTarget.dataset.type;
    if(selectAddress.isAct === "province" && !selectAddress[selectAddress.isAct].name) {
      showToast({ title: "请选择所在省份" });
      return ;
    }
    if(selectAddress.isAct === "city" && !selectAddress[selectAddress.isAct].name) {
      showToast({ title: "请选择所在城市" });
      return ;
    }
    if(selectAddress.isAct === "area" && !selectAddress[selectAddress.isAct].name) {
      showToast({ title: "请选择所在市区" });
      return ;
    }
    selectAddress.isAct = type;
    this.setData({
      selectAddress,
      areaList: areaData[type],
    })
  },

  // 选择地区
  onSelectArea({
    currentTarget
  }) {
    const {
      selectAddress,
      areaData,
      areaList,
    } = this.data;
    const {
      data,
      idx,
      pidx,
    } = currentTarget.dataset;
    selectAddress[selectAddress.isAct] = {
      ...data,
    }
    // 保存当前选择
    selectAddress[selectAddress.isAct].idx = idx;
    selectAddress[selectAddress.isAct].pidx = pidx;
    if(selectAddress.isAct === "province") {
      selectAddress.isAct = "city";
      selectAddress["city"] = {};
      selectAddress["area"] = {};
      this.getArea(data.id);
    } else if(selectAddress.isAct === "city") {
      selectAddress.isAct = "area"
      selectAddress["area"] = {};
      this.getArea(data.id, false);
    } else if(selectAddress.isAct === "area") {
      this.onCloseAddress();
    }
    this.setData({
      selectAddress,
      areaData,
      areaList,
    })
  },

  // 保存地址
  onSave() {
    const {
      postData,
      selectAddress,
      areaData,
      editData,
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
    if(this.isEdit) {
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