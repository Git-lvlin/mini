import homeApi from "../../apis/home"
import router from "../../utils/router";
import { debounce } from "../../utils/tools"

Page({

  // 重试
  onTry() {
    debounce(() => {
      homeApi.getBannerList({}).then(res => {
        router.goTabbar();
      }).catch(err => {});
    })();
  },
  
})