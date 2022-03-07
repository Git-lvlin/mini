import userApi from "../../../apis/user"
import { checkSetting } from "../../../utils/wxSetting";
import drawQrcode from '../../../miniprogram_npm/weapp-qrcode/index'

const url = "https://publicmobile-dev.yeahgo.com/web/share?inviteCode=ri2ez4lio16";
const appCodeBack = "../../../images/downCode/defaultCodeBack.png"

const app = getApp();
Component({
  options: {
    addGlobalClass: true,
  },

  canvasId: "myQrcode",

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
        } else if(nowVal !== oldVal && !nowVal) {
          // const ctx = wx.createCanvasContext("myQrcode", this);
          // ctx.clearRect(10, 10, 150, 75);
          // ctx.draw();
        }
      },
    }
  },

  data: {
    downLoadImg: {},
    canvasImg: "",
  },

  methods: {
    getImg() {
      userApi.getDownLoadImg({}).then(res => {
        this.setData({
          downLoadImg: res
        }, () => {
          this.createQrcode(res.shareUrl);
        })
      })
    },

    // 生成二维码
    createQrcode(shareUrl) {
      const that = this;
      drawQrcode({
        width: 64,
        height: 64,
        canvasId: "qrcode",
        _this: that,
        text: shareUrl,
        // typeNumber: 4,
        correctLevel: 1,
        // foreground: "rgba(0, 0, 0, 0.5)",
        // background: "transparent",
        callback(res) {
          setTimeout(() => {
            wx.canvasToTempFilePath({
              canvasId: "qrcode", 
              success(res) {
                let tempFilePath = res.tempFilePath;  // 临时图片地址，可在放入图片src中使用
                that.drawCodeImg(tempFilePath);
              },
              fail(err) {
                console.log(err)
              },
            }, that)
          }, 200);
        },
      });
    },

    // 回执二维码图片
    drawCodeImg(codeUrl) {
      const that = this;
      const {
        downLoadImg
      } = this.data;
      const ctx = wx.createCanvasContext("myQrcode", this)
      ctx.drawImage(appCodeBack, 0, 0, 260, 416);
      ctx.drawImage(codeUrl, 98, 222, 100, 150);
      ctx.draw(false, () => {
        wx.canvasToTempFilePath({
          canvasId: "myQrcode", 
          success(res) {
            // 临时图片地址，可在放入图片src中使用
            let canvasImg = res.tempFilePath;
            that.setData({
              canvasImg: canvasImg,
            })
          },
          fail(err) {
            console.log(err)
          },
        }, that)
      });
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
        downLoadImg,
        canvasImg,
      } = this.data;
      // 保存图片到系统相册  
      wx.saveImageToPhotosAlbum({
        filePath: canvasImg,
        success(res) {
          app.trackEvent('share_invite_download', {
            share_content: 'poster',
            share_type: 'picture'
          })
          wx.showToast({
            title: '保存成功',
          });
        }
      })
      // 下载文件
      // wx.downloadFile({
      //   url: downLoadImg.backGroundImg,
      //   success: function (res) {
      //     // 保存图片到系统相册  
      //     wx.saveImageToPhotosAlbum({
      //       filePath: res.tempFilePath,
      //       success(res) {
      //         wx.showToast({
      //           title: '保存成功',
      //         });
      //       },
      //       fail(res) {
      //       }
      //     })
      //   },
      //   fail: function (res) {
      //   }
      // })
    },

    onHideSharePopup() {
      this.triggerEvent("close", false);
    },
  
  }
})
