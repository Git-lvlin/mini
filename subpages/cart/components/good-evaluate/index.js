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
          this.getDetailComment(nV);
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
        orderType: good.commentType,
      }).then(res => {
        this.setData({
          commentNum: res.allCount,
        })
      });
    },

    getDetailComment(good) {
      goodApi.getDetailComment({
        storeNo: good.storeNo,
        spuId: good.spuId,
        orderType: good.commentType,
      }).then(res => {
        this.setData({
          commentList: res,
          isLoaded: true,
        })
      });
    },

    onToEvaluate() {
      router.push({
        name: 'evaluate',
        data: {},
      });
    },
  }
})
