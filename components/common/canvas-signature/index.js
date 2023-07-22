import {
    getCofigData,
} from "../../../utils/uploadAliyun";
import commonApi from "../../../apis/common";
import {
    showToast,
    getImgCdn
} from "../../../utils/tools";

const IMG_CDN = getImgCdn();

Component({
    properties: {
        show: {
            type: Boolean,
            value: false,
            observer(newVal, oldVal) {
               
            },
        }
    },
    data: {
        canvas: '',
        ctx: '',
        pr: 0,
        width: 0,
        height: 0,
        first: true,
        fileConfig: {
          tempFilePath: "",
          fileName: "",
          ossConfig: {}
        },
        slide: false
    },
    methods: {
        /**
         * 初始化
         */
        createCanvas() {
            const pr = this.data.pr; // 像素比
            const query = this.createSelectorQuery();
            query.select('#canvas').fields({
                node: true,
                size: true
            }).exec((res) => {
                console.log('res',res)
                const canvas = res[0].node;
                const ctx = canvas.getContext('2d');
                canvas.width = this.data.width * pr; // 画布宽度
                canvas.height = this.data.height * pr; // 画布高度
                ctx.scale(pr, pr); // 缩放比
                ctx.lineGap = 'round';
                ctx.lineJoin = 'round';
                ctx.lineWidth = 4; // 字体粗细
                ctx.font = '40px Arial'; // 字体大小，
                ctx.fillStyle = '#ecf0ef'; // 填充颜色
                ctx.fillText('签名区', res[0].width / 2 - 60, res[0].height / 2)
                this.setData({
                  ctx,
                  canvas
                })
            })
        },
        start(e) {
            if (this.data.first) {
                this.clearClick();
                this.setData({
                  first: false
                })
            }
            this.data.ctx.beginPath(); // 开始创建一个路径，如果不调用该方法，最后无法清除画布
            this.data.ctx.moveTo(e.changedTouches[0].x, e.changedTouches[0].y) // 把路径移动到画布中的指定点，不创建线条。用 stroke 方法来画线条
        },
        move(e) {
            if(e){
              this.setData({
                slide: true
              })
            }
            this.data.ctx.lineTo(e.changedTouches[0].x, e.changedTouches[0].y) // 增加一个新点，然后创建一条从上次指定点到目标点的线。用 stroke 方法来画线条
            this.data.ctx.stroke()
        },
        error: function (e) {
            console.log("画布触摸错误" + e);
        },
        // 获取系统信息
        getSystemInfo() {
            let that = this;
            wx.getSystemInfo({
                success(res) {
                    let ratio = res.windowWidth/375
                    that.setData({
                        pr: res.pixelRatio,
                        width: res.windowWidth,
                        height: ratio*200,
                    })
                }
            })
        },
        clearClick: function () {
            //清除画布
            this.data.ctx.clearRect(0, 0, this.data.width, this.data.height);
            this.setData({
              slide: false
            })
        },
        //保存图片
        saveClick: function () {
            if(!this.data.slide){
                showToast({ title: "请签名" });
              return
            }
            const {
                ossConfig,
            } = this.data.fileConfig;
            let that = this;
            wx.showLoading({
                title: '玩命加载中...',
            });
            wx.canvasToTempFilePath({
                x: 0,
                y: 0,
                width: this.data.width,
                height: this.data.height,
                destWidth: this.data.width * this.data.pr,
                destHeight: this.data.height * this.data.pr,
                canvasId: 'canvas',
                canvas: this.data.canvas,
                fileType: 'png',
                success(res) {
                    const resetName=`${Math.random()}${+new Date()}`.split('.')[1]
                    const path = `wechat/avatar/${resetName}`;
                    const formData = getCofigData(ossConfig);
                    //上传图片的名字和路径（默认路径为根目录。自定义路径：xxx/xxx.png）
                    formData.key = path;
                    wx.uploadFile({
                        url: `${IMG_CDN}`, //ali-oss上传地址
                        filePath: res.tempFilePath,
                        header: {
                            "Content-Type": "multipart/form-data",
                        },
                        name: 'file',
                        method: 'post',
                        formData,
                        success(res) {
                            if (res.statusCode == "200") {
                                const avatarUrl = IMG_CDN + path 
                                console.log("阿里云OSS上传图片成功" + avatarUrl);
                                that.triggerEvent("confirm", avatarUrl)
                                that.onHidePopup()
                                wx.hideLoading();
                            } else {
                                const params={
                                    url: `${IMG_CDN}`,
                                    filePath: res.tempFilePath,
                                    formData,
                                    res
                                }
                                commonApi.miniProgramLog(params).then(res=>{
                                    console.log('res',res)
                                })
                                showToast({
                                    title: "上传出错啦，请重试"
                                });
                            }
                        },
                        fail(err) {
                            const params={
                                url: `${IMG_CDN}`,
                                filePath: res.tempFilePath,
                                formData,
                                res
                            }
                            commonApi.miniProgramLog(params).then(res=>{
                                console.log('res',res)
                            })
                            wx.showToast({
                                title: "上传失败",
                                icon: 'none',
                            })
                        },
                    });
                    // wx.saveImageToPhotosAlbum({
                    //   filePath: res.tempFilePath,
                    //   success(res) {
                    //     wx.showToast({
                    //       title: '保存成功',
                    //       icon: 'success'
                    //     })
                    //   }
                    // })
                }
            })
        },
        // 获取上传参数
        getOssConfig() {
            console.log(this)
           let that=this
            commonApi.getOssConfig({
                bizCode: "yeahgo-user"
            }, {
                showLoading: false,
            }).then(res => {
                that.data.fileConfig.ossConfig = res;
            });
        },
        onHidePopup() {
            this.triggerEvent("close", {});
        },
    },


    /**
     * 生命周期函数--监听页面加载
     */
    lifetimes: {
        attached() {
          this.getOssConfig();
          this.getSystemInfo()
          this.createCanvas()
        },
    },

})