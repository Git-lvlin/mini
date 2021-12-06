import router from '../../../../utils/router'

Component({
  options: {
    addGlobalClass: true,
  },

  properties: {

  },

  data: {

  },

  methods: {
    onToEvaluate() {
      router.push({
        name: 'evaluate',
        data: {},
      });
    },
  }
})
