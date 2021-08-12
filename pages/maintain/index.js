import homeApi from "../../apis/home"
import router from "../../utils/router";
import { debounce } from "../../utils/tools"

Page({

  // 重试
  onTry() {
    debounce(() => {
      homeApi.getBannerList({}).then(res => {
      console.log("🚀 ~ file: index.js ~ line 10 ~ homeApi.getBannerList ~ res", res)
        router.goTabbar();
      }).catch(err => {});
    })();
  },
  
})