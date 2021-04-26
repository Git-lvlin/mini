import main from './index'

const store = {
  data:{
    systemInfo: main.data.systemInfo,
    userInfo: main.data.userInfo,
    showSpecPopup: false,
  },
  // 设置规格弹窗状态
  onChangeSpecState(state) {
    this.data.showSpecPopup = state;
  }
}

export default store