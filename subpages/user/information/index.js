import commonApi from "../../../apis/common";
import userApi from "../../../apis/user";
import { IMG_CDN } from "../../../constants/common";
import { USER_LEVEL } from "../../../constants/user";
import router from "../../../utils/router";
import { getStorageUserInfo, setStorageUserInfo, showModal, showToast } from "../../../utils/tools";
import { getCofigData, getOssImgWH } from "../../../utils/uploadAliyun";

Page({
  fileConfig: {
    tempFilePath: "",
    fileName: "",
  },

  data: {
    userInfo: {},
    fileName: "",
    updateInfo: false,
  },

  onShow() {
    const {
      updateInfo
    } = this.data;
    const userInfo = getStorageUserInfo(true, true);
    if(!updateInfo) {
      this.setData({
        userInfo,
      });
    } else {
      this.getUserInfo(userInfo);
    }
  },

  onAvatar() {
    const that = this;
    let tempFilePath = '';
    //通过相册选择照片
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        tempFilePath = res.tempFilePaths[0]
        //截取文件名字
        const fileName = tempFilePath.substring(tempFilePath.lastIndexOf('/')+1);
        that.fileConfig.fileName = fileName;
        that.fileConfig.tempFilePath = tempFilePath;
        that.getOssConfig();
      }
    })
  },

  // 获取上传参数
  getOssConfig() {
    commonApi.getOssConfig({
      bizCode: "yeahgo-user"
    }, {
      showLoading: false,
    }).then(res => {
      console.log(res)
      this.fileConfig.ossConfig = res;
      this.uploadImg();
    });
  },

  // 上传图片
  uploadImg() {
    const that = this;
    const {
      tempFilePath,
      fileName,
      ossConfig,
    } = this.fileConfig;
    const path = `wechat/avatar/${fileName}`;
    const formData = getCofigData(ossConfig);
    //上传图片的名字和路径（默认路径为根目录。自定义路径：xxx/xxx.png）
    formData.key = path;
    wx.uploadFile({
      url: IMG_CDN, //ali-oss上传地址
      filePath: tempFilePath,
      header: {
        "Content-Type": "multipart/form-data",
      },
      name: 'file',
      method: 'post',
      formData,
      success(res) {
        if (res.statusCode == "200") {
          const avatarUrl = getOssImgWH(IMG_CDN + path, 200, 200);
          console.log("🚀 ~ file: index.js ~ line 89 ~ success ~ avatarUrl", avatarUrl)
          that.updateUserAvatar(avatarUrl);
          console.log("阿里云OSS上传图片成功" + avatarUrl );
        } else {
          showToast({ title: "上传出错啦，请重试" });
        }
      },
      fail(err) {
        console.log("uploadImg ~ err", err)
        wx.showToast({
          title: "上传失败",
          icon: 'none',
        })
      },
    });
  },

  // 修改头像信息
  updateUserAvatar(avatar) {
    const {
      userInfo,
    } = this.data;
    userApi.updateUserInfo({
      memberId: userInfo.id,
      icon: avatar,
    }).then(res => {
      showToast({ title: "更新成功" });
      this.getUserInfo(userInfo);
    });
  },

  // 获取用户信息
  getUserInfo(userInfo) {
    userApi.getUserInfo({
      id: userInfo.id,
    }, {
      showLoading: false,
    }).then(res => {
      res.levelText = USER_LEVEL[res.memberLevel].name;
      res.levelIcon = USER_LEVEL[res.memberLevel].icon;
      this.setData({
        userInfo: res,
      })
      setStorageUserInfo(res);
    })
  },

  // 修改昵称
  onName() {
    router.push({
      name: "changeInfo",
    })
  },

  // 更换手机号
  onBindPhone() {
    showModal({
      content: "您确定要更改当前绑定手机？",
      ok() {
        router.push({
          name: "changePhone"
        })
      }
    })
  },

})