Component({
  options: {
    //配置组件样式，让页面样式与组件样式可以相互覆盖
    // addGlobalClass: true,
  },
  data: {
    //请求得到的列表数据
    list: [],
    //当前页数
    pageNum: 1,
    //全部页数
    totalPage: 1,
    //设置滚动条距顶部的位置
    scrollOffset: 0,
  },
  properties: {
    // 滚动区域的高度
    height: {
      type: String,
      value: "100rpx",
    },
    // 是否开启下拉刷新
    openRefresher: {
      type: Boolean,
      value: false
    },
    // 下拉刷新区域的背景色
    refresherBack: {
      type: String,
      value: "transparent",
    },
    // 设置当前下拉刷新状态
    isRefreshLoading: {
      type: Boolean,
      value: false,
    },
    // 打开监听滚动距离
    openScroll: {
      type: Boolean,
      value: false
    },
    //每一页展示的条数
    pageSize: {
      type: Number,
      value: 20,
    },
    // 发送请求的参数
    params: {
      type: Object,
      value: null,
    },
    // 请求函数
    fetchFunction: {
      type: Object,
      value: () => {},
    },
  },

  pageLifetimes: {
    show() {
      // this.setData({ pageNum: 1 }, () => {
      //   this.fetchRequest();
      // });
    },
  },

  methods: {
    fetchData(type) {
      // if (this.data.totalPage < this.data.pageNum) {
      //   return;
      // }
      if(!!type) {
        this.fetchRequest(type);
      } else {
        this.fetchRequest();
      }
    },

    async fetchRequest(type) {
      let params = {
        ...this.properties.params,
        pageNum: this.data.pageNum,
        pageSize: this.data.pageSize,
      }
      // let { data } = await this.properties.fetchFunction.fun(params);
      // console.log("data", data);
      
      if (type === 'lower') {
        // this.setData({ list: [...this.data.list, ...data.list], totalPage: data.totalPage });
        this.triggerEvent("handleRes", { list: ["1234509782378960hkasdhfkjsadhjkasdhk"], isFrist: false})
      } else {
        // this.setData({ list: data.list, totalPage: data.totalPage });
        this.triggerEvent("handleRes", { list: ["1234509782378960hkasdhfkjsadhjkasdhk"], isFrist: true})
      }
    },

    //下拉刷新
    handleRefresherRefresh() {
      this.setData({ pageNum: 1, pageSize: this.data.pageSize, totalPage: 1 }, async () => {
        await this.fetchData();
        this.setData({ isRefreshLoading: false });
      });
    },

    //上拉加载
    handleScrollTolower() {
      // if (this.data.pageNum >= this.data.totalPage) {
      //   return;
      // }
      this.setData({ pageNum: this.data.pageNum + 1 }, () => {
        this.fetchData('lower');
      });
    },

    // 监听滚动距离
    hanldeScroll(event) {
      if(!this.properties.openScroll) return;
      this.triggerEvent("hanldeScroll", event.detail)
    }
  },
});