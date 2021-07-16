import goodApi from '../../../apis/good';
import wxCharts from '../../../utils/wxcharts';

let lineChart = null;

Page({
  linechartsComponnet: null,
	id: "",

  data: {
		activeNames: ['1'],
  },

  onLoad(options) {
		this.id = options.id;
		this.lineLoad();
  },

  onShareAppMessage() {

  },

	// 获取比价详情
	getPriceDetail() {
		// if() {}
	},

	lineLoad() {
		let windowWidth = 375;
		try {
			const res = wx.getSystemInfoSync();
			windowWidth = res.windowWidth;
		} catch (e) {
			console.error('getSystemInfoSync failed!');
		}
		const simulationData = this.createSimulationData();
		lineChart = new wxCharts({
			canvasId: 'lineCanvas',
			type: 'line',
			categories: simulationData.categories,
			animation: true,
			background: '#ffffff',
			series: [{
				name: '成交量1',
				data: simulationData.data,
				format: function (val, name) {
					return val.toFixed(2) + '万';
				}
			}],
			xAxis: {
				disableGrid: true
			},
			yAxis: {
				// title: '成交金额 (万元)',
				format: function (val) {
					return val.toFixed(2);
				},
				min: 0
			},
			width: 375,
			height: 175,
			dataLabel: false,
			dataPointShape: true,
			extra: {
				// lineStyle: 'curve'
				lineStyle: 'liner'
			}
		});
	},

  touchHandler: function (e) {
    console.log(lineChart.getCurrentDataIndex(e));
    lineChart.showToolTip(e, {
        // background: '#7cb5ec',
        format: function (item, category) {
            return category + ' ' + item.name + ':' + item.data 
        }
    });
  },    
  createSimulationData: function () {
      var categories = [];
      var data = [];
      for (var i = 0; i < 10; i++) {
          categories.push('2016-' + (i + 1));
          data.push(Math.random()*(20-10)+10);
      }
      // data[4] = null;
      return {
          categories: categories,
          data: data
      }
  },
  updateData: function () {
      var simulationData = this.createSimulationData();
      var series = [{
          name: '成交量1',
          data: simulationData.data,
          format: function (val, name) {
              return val.toFixed(2) + '万';
          }
      }];
      lineChart.updateData({
          categories: simulationData.categories,
          series: series
      });
  },

  onChange(event) {
    this.setData({
      activeNames: event.detail,
    });
  },
})