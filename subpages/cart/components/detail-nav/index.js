import { getSystemInfo } from '../../../../utils/tools';

Component({

  properties: {
    list: {
      type: Array,
      value: []
    },
    good: {
      type: Object,
      value: {}
    },
    barTap: {
      type: Object,
      value: {}
    },
    scrollTop: {
      type: Number,
      value: 0,
      observer(nV, oV) {
        let {
          barTap,
          actType,
          systemInfo,
          opacity,
        } = this.data;
        let nOpcity = 0;
        let type = 1;
        let topHeight = systemInfo.navTotalHeightPx + 36 + 10;
        if(nV < barTap.evaluate - topHeight) {
          type = 1;
        } else if(nV < barTap.info - topHeight) {
          type = 2;
        } else if(nV < barTap.recommend - topHeight) {
          type = 3;
        } else {
          type = 4;
        }
        if(nV > 70) {
          nOpcity = nV / (375 - (systemInfo.navTotalHeightPx + 36 + 20));
          nOpcity = nOpcity >= 1 ? 1 : nOpcity;
          if(opacity != nOpcity) {
            opacity = nOpcity;
            this.setData({
              opacity,
            });
          }
        }
        if(type != actType) {
          actType = type;
          this.setData({
            actType,
          });
        }
      },
    },
  },

  data: {
    actType: 1,
    opacity: 0,
    systemInfo: getSystemInfo(),
    barList: [{
      type: 1,
      name: "商品"
    },{
      type: 2,
      name: "评价"
    },{
      type: 3,
      name: "详情"
    },{
      type: 4,
      name: "推荐"
    }],
  },

  methods: {
    onBarChange({
      currentTarget,
    }) {
      const {
        type,
      } = currentTarget.dataset;
      const {
        actType,
      } = this.data;
      if(actType != type) {
        this.triggerEvent("barChange", type);
      }
    }
  }
})
