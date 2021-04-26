import router from '../../../utils/router'

Component({
  options: {
    addGlobalClass: true,
  },

  properties: {

  },

  data: {

  },

  methods: {
    onToDetail() {
      router.push({
        name: 'detail',
      });
    },
  }
})
