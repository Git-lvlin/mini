import router from '../../../utils/router'


Component({
  timer: null,

  properties: {

  },

  data: {
    scrollListWidth: 0,
    list: [
      [{
        id: 1,
      },{
        id: 2,
      },{
        id: 3,
      },{
        id: 4,
      },{
        id: 5,
      },{
        id: 6,
      },{
        id: 7,
      },{
        id: 8,
      },{
        id: 9,
      },{
        id: 10,
      }],
      [{
        id: 11,
      },{
        id: 12,
      },{
        id: 13,
      },{
        id: 14,
      },{
        id: 15,
      },{
        id: 16,
      }]
    ]
  },

  methods: {
    handleScroll({
      detail
    }) {
      let {
        scrollListWidth,
      } = this.data;
      const {
        scrollLeft,
        scrollWidth,
      } = detail;
      scrollListWidth = parseInt(44 * (scrollLeft / (scrollWidth / 2)));
      // scrollListWidth = 44 * (scrollLeft / (scrollWidth / 2));
      this.setData({
        scrollListWidth,
      })
    },

    // 跳转
    onToClass() {
      router.push({
        name: 'classList',
      });
    },
  }
})
