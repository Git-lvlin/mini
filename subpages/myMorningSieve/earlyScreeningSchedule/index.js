import myMorningSieveApi from '../../../apis/myMorningSieve'
import router from '../../../utils/router'

Page({

    /**
     * 页面的初始数据
     */
    data: {
        steps: [],
        active: 0,
        showSharePopup: false,
        code: '',
        signcode: '',
        actionurl: ''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        let that = this
        console.log('options',options)
        this.setData({
            code:options.code,
            signcode:options.signcode,
            actionurl:options.actionurl
        })
        myMorningSieveApi.getProcess({ code:options.code }).then(res=>{
            that.setData({
                steps: res.map(item=>({ text: item.name, desc: item.timeStr })),
                active: res.filter(item=>item.enable == 1).length-1
            })
        })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    },
    showSharePopup() {
        this.setData({
            showSharePopup: true,
        })
    },
    onHideSharePopup() {
        this.setData({
            showSharePopup: false,
        })
    },
    onDetail(){
        console.log('detail')
        const token =encodeURIComponent(wx.getStorageSync("ACCESS_TOKEN"))  || '';
        router.push({
            name: "webview",
            data: {
              url: encodeURIComponent(`${this.data.actionurl}&token=${token}`),
              encode: true
            }
        });
    }
})