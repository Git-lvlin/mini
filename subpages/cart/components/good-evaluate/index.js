import goodApi from '../../../../apis/good';
import router from '../../../../utils/router'

let fristLoad = false;

Component({
  options: {
    addGlobalClass: true,
  },

  properties: {
    good: {
      type: Object,
      value: {},
      observer(nV, oV) {
        if(!!nV.storeNo && !fristLoad) {
          nV.commentType = nV.orderType != 5 && nV.orderType != 6 ? 1 : 2;
          this.getCommentTotal(nV);
        }
      },
    }
  },

  data: {
    commentNum: 0,
    commentList: [],
    isLoaded: false,
  },
 

  methods: {
    getCommentTotal(good) {
      goodApi.getCommentTotal({
        storeNo: good.storeNo,
        spuId: good.spuId,
        commentType: good.commentType,
      }).then(res => {
        if(res.allCount != "0") {
          this.getDetailComment(good);
        }
        this.setData({
          commentNum: res.allCount,
        })
      });
    },

    getDetailComment(good) {
      goodApi.getDetailComment({
        storeNo: good.storeNo,
        spuId: good.spuId,
        commentType: good.commentType,
      }).then(res => {
        this.setData({
          commentList: res,
          isLoaded: true,
        })
      });
    },

    onToEvaluate() {
      const {
        commentList,
        good,
      } = this.data;
      if(!commentList.length) {
        return
      }
      router.push({
        name: 'evaluate',
        data: {
          storeNo: good.storeNo,
          spuId: good.spuId,
          orderType: good.orderType,
        },
      });
    },
  }
})
