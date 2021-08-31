import userApi from "../../../apis/user"
import { checkSetting } from "../../../utils/wxSetting";

Component({

  properties: {
    show: {
      type: Boolean,
      value: false,
      observer(nowVal, oldVal) {
        if(nowVal !== oldVal && nowVal) {
          const {
            downLoadImg,
          } = this.data;
          if(!downLoadImg.backGroundImg) {
            this.getImg();
          } 
        }
      },
    }
  },

  data: {
    downLoadImg: {},
  },

  methods: {
    getImg() {
      userApi.getDownLoadImg({}).then(res => {
        this.setData({
          downLoadImg: res
        })
      })
    },

    onSave() {
      checkSetting("writePhotosAlbum", true).then(res => {
        if(res) {
          this.handleSavePicture();
        }
      });
    },

    //保存图片
    handleSavePicture(){
      const {
        downLoadImg
      } = this.data;
      // 下载文件  
      wx.downloadFile({
        url: downLoadImg.backGroundImg,
        success: function (res) {
          // 保存图片到系统相册  
          wx.saveImageToPhotosAlbum({
            filePath: res.tempFilePath,
            success(res) {
              wx.showToast({
                title: '保存成功',
              });
            },
            fail(res) {
            }
          })
        },
        fail: function (res) {
        }
      })
    },

    onHideSharePopup() {
      this.triggerEvent("close", false);
    },
  
  }
})
