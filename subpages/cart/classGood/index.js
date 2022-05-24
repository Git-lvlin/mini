import homeApi from "../../../apis/home";
import { mapNum } from "../../../utils/tools";

Page({
	id: '',
	pid: '',
	pageData: {
		size: 20,
		next: 0,
		hasNext: false,
	},

	data: {
		goodList: [],
		isLoad: false,
	},

	onLoad(options) {
		this.id = options.id;
		this.pid = options.pid;
		if(options.name) {
			wx.setNavigationBarTitle({
				title: options.name,
			});
		}
		this.getGoodList();
	},

	onReachBottom() {
		if(this.pageData.hasNext) {
			this.getGoodList();
		}
	},

	getGoodList() {
		const {
			size,
			next,
		} = this.pageData;
		let {
			goodList,
		} = this.data;
		let data = {
			size,
			next,
			gcId1: this.pid,
			gcId2: this.id,
		};
		homeApi.getClassGood(data).then(res => {
			const list = mapNum(res.records);
			this.pageData.next = res.next;
			this.pageData.hasNext = res.hasNext;
			goodList = goodList.concat(list);
			this.setData({
				isLoad: true,
				goodList,
			});
		});
	},
})