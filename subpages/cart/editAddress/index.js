import router from "../../../utils/router"
import cartApi from "../../../apis/cart"
import { getPinYin } from '../../../utils/pinyin'
import format from '../../../utils/format'
import { showToast } from '../../../utils/tools'

const defaultAreaList = [];
const defaultIndex = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
defaultIndex.forEach(item => {
  defaultAreaList.push({
    letter: item,
    children: []
  });
});

Page({
  areaIdx: "",
  areaParentIdx: "",

  data: {
    isDefault: false,
    provinceList: [],
    areaList: {},
    showPopup: false,
    postData: {},
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
    }
  },

  onLoad: function (options) {
    this.getProvince();
  },

  onAreaScroll(event) {
    // console.log("🚀 ~ file: index.js ~ line 34 ~ onAreaScroll ~ event", event)
    // this.setData({
    //   scrollTop: event.detail.scrollTop
    // })
  },

  // 获取省份
  getProvince() {
    cartApi.getProvince().then(res => {
      const {
        areaData
      } = this.data;
      let areaList = this.mapAddreass(res);
      areaData.province = areaList;
      // this.getArea(res[0].id);
      this.setData({
        areaData,
        areaList,
      })
    });
  },

  // 获取地级市
  getArea(id, isCity = true) {
    cartApi.getArea({
      id
    }).then(res => {
      let areaData = this.data.areaData;
      let areaList = this.mapAddreass(res);
      if(isCity) {
        areaData.city = areaList;
      } else {
        areaData.area = areaList;
      }
      // this.getArea(res[0].id, false);
      this.setData({
        areaList,
        areaData
      })
    });
  },

  // 格式化区域数据
  mapAddreass(list = []) {
    let letterList = [];
    let areaList = JSON.stringify(defaultAreaList);
    areaList = JSON.parse(areaList);
    let hasLetter = false;
    list.forEach(item => {
      let letter = getPinYin(item.name);
      areaList.forEach(child => {
        hasLetter = false;
        if(child.letter === letter) {
          child.children.push({
            name: item.name,
            id: item.id,
            select: false,
            data: item,
          });
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
      isDefault: !this.data.isDefault
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
    // router.go();
  }

})