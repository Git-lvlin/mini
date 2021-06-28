import cartApi from "../../../apis/order";
import { getPinYin } from '../../../utils/pinyin'

const defaultAreaList = [];
const defaultIndex = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
defaultIndex.forEach(item => {
  defaultAreaList.push({
    letter: item,
    children: []
  });
});

Component({

  properties: {
    show: {
      type: Boolean,
      value: false,
      observer(newVal, oldVal) {
        if(newVal !== oldVal && newVal) {
          this.getProvince();
        }
      },
    },
    editData: {
      type: Object,
      value: {},
    },
    showArea: {
      type: Boolean,
      value: true,
    },
    isEdit: {
      type: Boolean,
      value: false,
    },
  },

  data: {
    letterList: defaultIndex,
    areaList: defaultAreaList,
    areaData: {
      province: [],
      city: [],
      area: [],
    },
    selectAddress: {
      isAct: "province",
      province: {},
      city: {},
      area: {},
      areaStr: "",
    },
  },

  

  methods: {
    // 获取省份
    getProvince() {
      cartApi.getProvince().then(res => {
        const {
          areaData,
          editData,
          isEdit,
        } = this.data;
        let selectData = {};
        if(isEdit) {
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
        editData,
        isEdit,
      } = this.data;
      cartApi.getArea({
        id
      }).then(res => {
        let areaData = this.data.areaData;
        let selectData = {};
        if(isEdit && isCity && this.editFristLoad) {
          selectData = {
            id: editData.cityId,
            type: "city",
          }
          this.getArea(editData.cityId, false);
        } else if(isEdit && !isCity) {
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
        showArea,
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
        this.setData({
          areaList: [],
        });
        this.getArea(data.id);
      } else if(selectAddress.isAct === "city") {
        // 提供镇区选择
        if(showArea) {
          selectAddress.isAct = "area"
          selectAddress["area"] = {};
          this.setData({
            areaList: [],
          });
          this.getArea(data.id, false);
        } else {
          this.onCloseAddress({
            selectAddress,
            areaData,
          });
        }
      } else if(selectAddress.isAct === "area") {
        this.onCloseAddress({
          selectAddress,
          areaData,
        });
      }
      this.setData({
        selectAddress,
      });
    },
    // 关闭弹窗
    onCloseAddress(data) {
      this.triggerEvent("close", data);
    }
  }
})
