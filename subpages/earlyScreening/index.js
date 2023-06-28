import create from '../../utils/create.js'
import store from '../../store/index'
import earlyScreeningApi from '../../apis/earlyScreening'
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';


create.Page(store, {
  use: [
    "systemInfo"
  ],

  /**
   * 页面的初始数据
   */
  data: {
    showPopup: false,
    genderShow: false,
    name: '',
    nameError: '',
    signName: '',
    cardType: '身份证（中国大陆）',
    cardTypeShow: false,
    cardTypeColumns: ['身份证（中国大陆）','港澳居民来往内地通行证（中国香港、中国澳门）','台胞证（中国台湾）','护照（其他国家和地区）'],
    cardNo: '',
    sender: '',
    age:0,
    columns: ['18', '19', '20', '21', '22','23','24','25','26','27','28','29','30','31','32','33','34','35','36','37','38','39','40','41','42','43','44','45','46','47','48','49','50','51','52','53','54','55','56','57','58','59','60','61','62','63','64','65','66','67','68','69','70','71','72','73','74','75'],
    phone: '',
    phoneError: '',
    cancerHistory: '',
    expatiate: '',
    symptom: [],
    medicine: '',
    drugCause: '',
    usedHave: [],
    causeDisease: '',
    health: '',
    nonHealthProblem: '',
    join: '',
    signUrl: '',
    code: '',
    informedArr: [
        '您是否有癌症家族史?',
        '您是否有以下习惯或症状? （可多选）',
        '您近2周内是否服用过药物? 或是否有长期用药史?',
        '您是否有或曾有过以下情况? （可多选）',
        '安安盼 （Meta-Pan） 泛肿瘤普早筛是基于代谢组学成果对人体内肿瘤代谢微环境进行综合评估的前沿检测技术，通过抽血为受检者提供肿瘤早期风险筛查预警，及早发现隐患，更有针对性地辅助推进癌症的早筛早诊早治。',
        '适用于安安盼 （Meta-Pan）泛肿瘤普早筛的受检者为18至75周岁的普通人群。18至75周岁年龄段之外的人群、有肿瘤病史、有肿瘤治疗史、肿瘤相关药物服用史的人群，为不适用人群。如受检者属不适用人群，但仍坚持要求实施筛查检测，则最终的筛查结果报告仅作为参考，检测服务提供方对该受检者不承担任何相关责任。',
        '中王当前医学检测技术水亚的限制和受检老的个体差异等原因，即使检测服务提供方已履行工作职责和操作规程且已经过严格的检验检查程序，仍可能出现不可控误差或出现假阳性或假阴性结果。受检者知晓检测结果后产生的任何心理问题，检测服务提供方不承担任何责任。本次筛查中相关检测服务提供方将确保检测程序的严谨性，筛查结果报告只对该受检者的本次样本负责，受检者应对检测个体与样本的一致性负责。安安盼是一款面向大众人群的筛查产品，请如实告知以下信息：',
        '①、受检者目前或过往未患有下列疾病:恶性肿瘤;原位癌、不典型增生、未被证实良性、交界性肿瘤:再生障碍性贫血、恶性组织细胞病:弥漫性肺间质纤维化、呼吸衰竭;肾萎缩、慢性肾炎、肾功能衰竭、多囊肾:胰腺炎、多发性硬化、系统性红斑狼疮、葡萄胎;接受过器官移植、成瘾性药物、毒品中毒史。',
        '②、受检者最近6个月不存在以下症状:反复头痛咯血、便血、血尿、吞咽困难、胸痛、浮肿、蛋白尿、消瘦 （非健身原因所致的体重减轻超过5 公厅）、息肉、囊肿、赘生物;阴道异常出血;乳头异常233收缩症状。',
        ' ③、B超/CT/MRI未提示肝硬化，肝结节样改变或提示有其他器官肿瘤，胃镜未提示食管胃底静脉曲张，乙肝肝穿病理纤维化3级或丙肝肝穿病理未见纤维化，且显示为非进展性。',
        ' ④、受检者过去1年内没有因疾病住院治疗或手术但以下情况除外:a.分娩;b.急性呼吸系统疾病:c.急性胃肠炎、急性阑尾炎;d.因结石引发导致的住院;e.胆囊息肉已进行胆囊切除手术且病理结果为良性。',
        '筛查结果报告内的各种风险分析是基于机器学习模型做出的，其风险预警仅限于提示受检者存在肿瘤或相关代谢异常的可能性。',
        '大多数肿瘤的发生是由多种遗传因素、代谢微环境水平和环境因素共同作用的结果。若受检者的筛查结果报告中提示有异常，建议去往正规医院或医疗机构专科进一步诊查。',
        '受检者个人信息、样本信息及筛查结果报告等将被严格保管和保密，不会透露给任何无关第三方。尽管有前述约定，为推动防癌治癌医学科学进步，受检者授权检测服务提供方或科研单位将可能利用剩余标本、检测数据进行医学科学研究（不用于任何商业目的）。于此同时，受检者同意并授权检测服务提供方或科研单位作为投保人，免费为受检者在【亚太财产保险有限公司】 投保《亚太财产保险有限公司团体重大疾病保险（B款）条款》、《亚太财产）保险有限公司健康检查费用医疗保险 （费用补偿型条款》，保障范围限受检者本次检测项目所涵盖的疾病。',
        '我们将尊重受检者的意见,受检者可以选择是否参加保险:',
        '本公司保留对报告的说明、解释和更新的权利。'
    ]
  },

  options: {},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      this.setData({
          code:options.code
      })
      Dialog.confirm({
        title: '',
        message: '弹窗内容',
        showConfirmButton: false,
        showCancelButton: false
      })
      earlyScreeningApi.checkSignCode({ code: options.code }).then(res=>{
        console.log('res',res)
      })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },
  touchMove() {
    return
   },
  checkName() {
    if (this.data.name.replace(/\s/, '') === '') {
      this.setData({
        nameError: '请输入姓名'
      })
    } else {
      this.setData({
        nameError: ''
      })
    }
  },
  cardTypeCardShow() {
    this.setData({
      cardTypeShow: true,
    })
  },
  cardTypeShowClose(){
    this.setData({
      cardTypeShow: false,
    })
  },
  cardTypeConfirm({ detail }){
    this.setData({
      cardType: detail.value,
    })
    this.cardTypeShowClose()
  },
  onChangeRadio(event){
    this.setData({
      sender: event.detail
    })
  },
  checkPhone() {
    if (!/1\d{10}/.test(`${this.data.phone}`)) {
      this.setData({
        phoneError: '请输入11位手机号'
      })
    } else {
      this.setData({
        phoneError: ''
      })
    }
  },
  onChangeCancer(event){
    this.setData({
      cancerHistory: event.detail
    })
  },
  onChangeSymptom(event){
    this.setData({
      symptom: event.detail
    })
  },
  onChangeMedicine(event){
    this.setData({
      medicine: event.detail
    })
  },
  onChangeUsedHave(event){
    this.setData({
      usedHave: event.detail
    })
  },
  onChangeHealth(event){
    this.setData({
      health: event.detail
    })
  },
  onChangeJoin(event){
    this.setData({
      join: event.detail
    })
  },
  onShowPopup() {
    this.setData({
      showPopup: true,
    })
  },
  onHidePopup() {
    this.setData({
      showPopup: false,
    })
  },
  onChanCanvas(avatarUrl) {
    this.setData({
      signUrl: avatarUrl.detail
    })
  },
  ageShow() {
    this.setData({
      genderShow: true,
    })
  },
  genderShowClose(){
    this.setData({
      genderShow: false,
    })
  },
  genderConfirm({ detail }){
    this.setData({
      age: detail.value,
    })
    this.genderShowClose()
  },
  check() {
    this.checkName()
    this.checkPhone()
  },
  onSubmitter() {
    this.check()
    console.log('submitter')
    const { code, name, signName, age, phone, cardType, cardNo, sender, signUrl, cancerHistory, expatiate, symptom, medicine, drugCause, usedHave, causeDisease, health, nonHealthProblem, join, informedArr } = this.data
    const params={
        code,
        name,
        signName,
        age,
        phone,
        cardType: cardType == '身份证（中国大陆）'?1:2,
        cardNo,
        sender,
        signUrl,
        other:[
            {
                index:8,
                title: informedArr[0],
                select: cancerHistory,
                remark: expatiate
            },
            {
                index:9,
                title: informedArr[1],
                select: symptom,
                remark: ''
            },
            {
                index:10,
                title: informedArr[2],
                select: medicine,
                remark: drugCause
            },
            {
                index:11,
                title: informedArr[3],
                select: usedHave,
                remark: causeDisease
            },
        ],
        agreeRemark:[
            {
                index:1,
                title: informedArr[4],
                select: '',
                remark: ''
            },
            {
                index:2,
                title: informedArr[5],
                select: '',
                remark: ''
            },
            {
                index:3,
                title: `${informedArr[6]}${informedArr[7]}${informedArr[8]}${informedArr[9]}${informedArr[10]}`,
                select: health,
                remark: nonHealthProblem
            },
            {
                index:4,
                title: informedArr[11],
                select: '',
                remark: ''
            },
            {
                index:5,
                title: informedArr[12],
                select: '',
                remark: ''
            },
            {
                index:6,
                title: `${informedArr[13]}${informedArr[14]}`,
                select: join,
                remark: ''
            },
            {
                index:7,
                title: informedArr[15],
                select: '',
                remark: ''
            },
        ]
    }
    console.log('params',params)
    earlyScreeningApi.signUp(params).then(res=>{
        console.log('res',res)
        if(res.code==0){
            console.log('res',res)
        }
    })
  }
})
