import router from '../../../utils/router'
import myMorningSieveApi from '../../../apis/myMorningSieve'

Page({

    /**
     * 页面的初始数据
     */
    data: {
      earlyScreeningArr:[]
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        let that = this
        myMorningSieveApi.getOwnerList().then(res=>{
            console.log('res',res)
            that.setData({
                earlyScreeningArr:res
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

    onDetail({currentTarget}){
        const { code } = currentTarget.dataset;
        console.log('code',code)
        router.push({
          name: 'earlyScreeningSchedule',
          data:{
            code
          }
        })
    }
})