import { IMG_CDN } from '../../../constants/common';

Component({
  options: {
    addGlobalClass: true,
  },

  properties: {
    data: {
      type: Object,
      value: {},
    }
  },

  data: {
    defSelect: `${IMG_CDN}miniprogram/common/def_choose.png`,
    select: `${IMG_CDN}miniprogram/common/choose.png`,
  },

  methods: {
    onClick() {
      const {
        data,
      } = this.data;
      this.triggerEvent("click", data);
    },
  }
})
