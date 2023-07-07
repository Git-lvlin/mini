import create from '../../../utils/create.js'
import store from '../../../store/index'
import earlyScreeningApi from '../../../apis/earlyScreening'
import router from '../../../utils/router'
import fadadaApi from '../../../apis/fadada'
import { getStorageUserInfo } from "../../../utils/tools"
import moment from 'dayjs'
import Toast from '../../../miniprogram_npm/@vant/weapp/toast/toast';


create.Page(store, {
  use: [
    "systemInfo"
  ],

  /**
   * 页面的初始数据
   */
  data: {
    code: '',
    signCode: '',
    name: '',
    nameError: '',
    sender: '',
    genderShow: false,
    age:0,
    columns: ['18','19', '20', '21', '22','23','24','25','26','27','28','29','30','31','32','33','34','35','36','37','38','39','40','41','42','43','44','45','46','47','48','49','50','51','52','53','54','55','56','57','58','59','60','61','62','63','64','65','66','67','68','69','70','71','72','73','74','75'],
    height: '',
    heightError: '',
    weight: '',
    weightError: '',
    cardNo: '',
    cardNoError: '',
    phone: '',
    phoneError: '',
    smoke: '',
    breakfast: '',
    midnight: '',
    exercise: '',
    family: '',
    familyHistory: '',
    spirit: '',
    medicine: '',
    expand: '',
    defecate: '',
    hepatitis: '',
    virus: '',
    humanPapilloma: '',
    colonoscopy: '',
    polyp: '',
    polypShow: false,
    currentDate: new Date().getTime(),
    minDate: new Date().getTime(),
    gastroscope: '',
    stomach: '',
    stomachShow: false,
    timeDate: new Date().getTime(),
    landmark: '',
    lung: '',
    various: [],
    ldct: '',
    spiral: '',
    drugCause: '',
    breast: '',
    ultrasound: '',
    tungsten: '',
    liver: '',
    dirty: '',
    exceed: '',
    prostate: '',
    nuclear: '',
    resonance: '',
    pancreas: '',
    insulin: '',
    gland: '',
    blood: '',
    routine: '',
    examination: '',
    ovary: '',
    oophoron: '',
    ootheca: '',
    thyroid: '',
    thyroidea: '',
    glandula: '',
    skull: '',
    vertex: '',
    scalp: '',
    showPopup: false,
    signUrl: '',
    informedArr: [
        '每天的吸烟量',
        '每周不吃早饭的频率',
        '每周吃夜宵的频率',
        '平常运动的频率是？',
        '本人是否有癌症家族史？',
        '是否长期感觉精神压力大？',
        '近一个月内是否服用过药物？',
        '您的排便情况？',
        '是否携带肝炎病毒（HBV、HCV）？',
        ' 是否携带艾滋病毒（HIV）？',
        '是否携带HPV（人乳头瘤病毒）病毒？',
        '最近是否做过肠镜？',
        '最近是否做过胃镜？',
        '近半年内，是否针对某一种（或某几种）癌症进行过肿瘤标志物检测？',
        '近1年是否做过肺部低剂量螺旋CT（LDCT）检查？',
        '近1年是否做过乳腺超声或钼靶检查检查（男性选未检测）？',
        '近1年是否做过肝脏超声检查？',
        '近1年是否做过前列腺核磁共振检查（女性选未检测）？',
        '近1年是否做过胰腺超声检查？',
        '近1年是否做过血常规检查？',
        '近1年是否做过卵巢核磁共振检查（男性选未检测）？',
        '近1年是否做甲状腺超声检查？',
        '近1年是否做头颅核磁共振检查？',
    ],
    selectAddress: {},
    contract: '',
    id: '',
    pactUrl: ''
  },

  options: {},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      this.options=options
      this.setData({
        code:this.options.code,
        signCode:this.options.signCode
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
    const userInfo = getStorageUserInfo(true, true)
      if (!userInfo) {
        return
      }
      const selectAddress= wx.getStorageSync("EARLY_ADDRESS");
      this.setData({
        selectAddress:selectAddress,
        phone: userInfo.phoneNumber
      })
      earlyScreeningApi.checkSignCode({ code: this.options.code }).then(res=>{

      }).catch(err=>{
        wx.showModal({
            title: '温馨提示',
            content: err.msg,
            showCancel: false,
            success (res) {
              if (res.confirm) {
                router.go()
              } 
            }
          })
      })
  },
  touchMove() {
    return
   },
  checkName() {
    console.log('name')
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
  onChangeRadio(event){
    this.setData({
      sender: event.detail
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
  checkHeight() {
    console.log('height')
    if (this.data.height.replace(/\s/, '') === '') {
      this.setData({
        heightError: '请输入身高'
      })
    } else if (isNaN(this.data.height)) {
      this.setData({
        heightError: '身高必须为数字'
      })
    } else if (!Number.isInteger(Number(this.data.height))) {
      this.setData({
        heightError: '身高必须为整数'
      })
    } else {
      this.setData({
        heightError: ''
      })
    }
  },  
  checkWeight() {
    console.log('weight')
    if (this.data.weight.replace(/\s/, '') === '') {
      this.setData({
        weightError: '请输入体重'
      })
    } else if (isNaN(this.data.weight)) {
      this.setData({
        weightError: '体重必须为数字'
      })
    } else {
      this.setData({
        weightError: ''
      })
    }
  },  
  checkCardNo() {
    if (!/^(\d{15}$|^\d{18}$|^\d{17}(\d|X|x))$/.test(this.data.cardNo)) {
      this.setData({
        cardNoError: '请输入正确的身份证号码'
      })
    } else {
      this.setData({
        cardNoError: ''
      })
    }
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
  onChangeSmoke(event){
    this.setData({
      smoke: event.detail
    })
  },
  onChangeBreakfast(event){
    this.setData({
      breakfast: event.detail
    })
  },
  onChangeMidnight(event){
    this.setData({
      midnight: event.detail
    })
  },
  onChangeExercise(event){
    this.setData({
      exercise: event.detail
    })
  },
  onChangeFamily(event){
    this.setData({
      family: event.detail
    })
  },
  onChangeSpirit(event){
    this.setData({
      spirit: event.detail
    })
  },
  onChangeMedicine(event){
    this.setData({
      medicine: event.detail
    })
  },
  onChangeDefecate(event){
    this.setData({
      defecate: event.detail
    })
  },
  onChangeHepatitis(event){
    this.setData({
      hepatitis: event.detail
    })
  },
  onChangeVirus(event){
    this.setData({
      virus: event.detail
    })
  },
  onChangeHumanPapilloma(event){
    this.setData({
      humanPapilloma: event.detail
    })
  },
  onChangeColonoscopy(event){
    this.setData({
      colonoscopy: event.detail
    })
  },
  onChangePolyp(event){
    this.setData({
      polyp: event.detail
    })
  },
  polypShow() {
    this.setData({
      polypShow: true,
    })
  },
  polypShowClose(){
    this.setData({
      polypShow: false,
    })
  },
  polypConfirm({ detail }){
    this.setData({
        currentDate: detail,
    });
    this.polypShowClose()
  },
  onChangeGastroscope(event){
    this.setData({
      gastroscope: event.detail
    })
  },
  onChangeStomach(event){
    this.setData({
      stomach: event.detail
    })
  },
  stomachShow() {
    this.setData({
      stomachShow: true,
    })
  },
  stomachShowClose(){
    this.setData({
      stomachShow: false,
    })
  },
  stomachConfirm({ detail }){
    this.setData({
        timeDate: detail,
    });
    this.stomachShowClose()
  },
  onChangeLandmark(event){
    this.setData({
      landmark: event.detail
    })
  },
  onChangeLung(event){
    this.setData({
      lung: event.detail
    })
  },
  onChangeVarious(event){
    this.setData({
      various: event.detail
    })
  },
  onChangeLdct(event){
    this.setData({
      ldct: event.detail
    })
  },
  onChangeSpiral(event){
    this.setData({
      spiral: event.detail
    })
  },
  onChangeBreast(event){
    this.setData({
      breast: event.detail
    })
  },
  onChangeUltrasound(event){
    this.setData({
      ultrasound: event.detail
    })
  },
  onChangeLiver(event){
    this.setData({
      liver: event.detail
    })
  },
  onChangeDirty(event){
    this.setData({
      dirty: event.detail
    })
  },
  onChangeProstate(event){
    this.setData({
      prostate: event.detail
    })
  },
  onChangeNuclear(event){
    this.setData({
      nuclear: event.detail
    })
  },
  onChangePancreas(event){
    this.setData({
      pancreas: event.detail
    })
  },
  onChangeInsulin(event){
    this.setData({
      insulin: event.detail
    })
  },
  onChangeBlood(event){
    this.setData({
      blood: event.detail
    })
  },
  onChangeRoutine(event){
    this.setData({
      routine: event.detail
    })
  },
  onChangeOvary(event){
    this.setData({
      ovary: event.detail
    })
  },
  onChangeOophoron(event){
    this.setData({
      oophoron: event.detail
    })
  },
  onChangeThyroid(event){
    this.setData({
      thyroid: event.detail
    })
  },
  onChangeThyroidea(event){
    this.setData({
      thyroidea: event.detail
    })
  },
  onChangeSkull(event){
    this.setData({
      skull: event.detail
    })
  },
  onChangeVertex(event){
    this.setData({
      vertex: event.detail
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
  check() {
    this.checkName()
    this.checkHeight()
    this.checkWeight()
    this.checkCardNo()
    this.checkPhone()
  },
  onSubmitter() {
    try {
        this.check()
        const {code,name,nameError,sender,age,height,heightError,weight,weightError,cardNo,cardNoError,phone,phoneError,smoke,breakfast,midnight,exercise,family,familyHistory,spirit,medicine,
    expand,defecate,hepatitis,virus,humanPapilloma,colonoscopy,polyp,currentDate,gastroscope,stomach,timeDate,landmark,lung,various,
    ldct,spiral,drugCause,breast,ultrasound,tungsten,liver,dirty,exceed,prostate,nuclear,resonance,pancreas,insulin,gland,blood,routine,
    examination,ovary,oophoron,ootheca,thyroid,thyroidea,glandula,skull,vertex,scalp,signUrl,informedArr,selectAddress} = this.data
    console.log('selectAddress',selectAddress)
        const params={
            code,
            name,
            sender,
            age,
            height,
            weight,
            cardNo,
            phone,
            smoke,
            other:[
                {
                    index:8,
                    title: informedArr[0],
                    select: smoke,
                    remark: '',
                },
                {
                    index:9,
                    title: informedArr[1],
                    select: breakfast,
                    remark: ''
                },
                {
                    index:10,
                    title: informedArr[2],
                    select: midnight,
                    remark: ''
                },
                {
                    index:11,
                    title: informedArr[3],
                    select: exercise,
                    remark: ''
                },
                {
                    index:12,
                    title: informedArr[4],
                    select: family,
                    remark: family=='有'?familyHistory:''
                },
                {
                    index:13,
                    title: informedArr[5],
                    select: spirit,
                    remark: ''
                },
                {
                    index:14,
                    title: informedArr[6],
                    select: medicine,
                    remark: medicine=='是'?expand:''
                },
                {
                    index:15,
                    title: informedArr[7],
                    select: defecate,
                    remark: ''
                },
                {
                    index:16,
                    title: informedArr[8],
                    select: hepatitis,
                    remark: ''
                },
                {
                    index:17,
                    title: informedArr[9],
                    select: virus,
                    remark: ''
                },
                {
                    index:18,
                    title: informedArr[10],
                    select: humanPapilloma,
                    remark: ''
                },
                {
                    index:19,
                    title: informedArr[11],
                    select: colonoscopy=="是"?`是，检查时间是：${moment(currentDate).format('YYYY-MM-DD')}，检查结果：${polyp}`:"否",
                    answer: {
                        colonoscopy,
                        currentDate:moment(currentDate).format('YYYY-MM-DD'),
                        polyp
                    },
                    remark: ''
                },
                {
                    index:20,
                    title: informedArr[12],
                    select: gastroscope=="是"?`是，检查时间是：${moment(timeDate).format('YYYY-MM-DD')}，检查结果：${stomach}`:"否",
                    answer: {
                        gastroscope,
                        timeDate:moment(timeDate).format('YYYY-MM-DD'),
                        stomach
                    },
                    remark: ''
                },
                {
                    index:21,
                    title: informedArr[13],
                    select: landmark=="已检测"?`已检测，结果：${lung=='有异常'?`有异常，异常项目为：${various.toString()}`:lung}`:"未检测",
                    answer: {
                        landmark,
                        lung,
                        various
                    },
                    remark: ''
                },
                {
                    index:22,
                    title: informedArr[14],
                    select: ldct=="已检测"?`已检测，结果：${spiral=='有异常'?`有异常，异常为：${drugCause}`:spiral}`:"未检测",
                    answer: {
                        ldct,
                        spiral,
                        drugCause
                    },
                    remark: ''
                },
                {
                    index:23,
                    title: informedArr[15],
                    select: breast=="已检测"?`已检测，结果：${ultrasound=='有异常'?`有异常，异常为：${tungsten}`:ultrasound}`:"未检测",
                    answer: {
                        breast,
                        ultrasound,
                        tungsten
                    },
                    remark: ''
                },
                {
                    index:24,
                    title: informedArr[16],
                    select: liver=="已检测"?`已检测，结果：${dirty=='有异常'?`有异常，异常为：${exceed}`:dirty}`:"未检测",
                    answer: {
                        liver,
                        dirty,
                        exceed
                    },
                    remark: ''
                },
                {
                    index:25,
                    title: informedArr[17],
                    select: prostate=="已检测"?`已检测，结果：${nuclear=='有异常'?`有异常，异常为：${resonance}`:nuclear}`:"未检测",
                    answer: {
                        prostate,
                        nuclear,
                        resonance
                    },
                    remark: ''
                },
                {
                    index:26,
                    title: informedArr[18],
                    select: pancreas=="已检测"?`已检测，结果：${insulin=='有异常'?`有异常，异常为：${gland}`:insulin}`:"未检测",
                    answer: {
                        pancreas,
                        insulin,
                        gland
                    },
                    remark: ''
                },
                {
                    index:27,
                    title: informedArr[19],
                    select: blood=="已检测"?`已检测，结果：${routine=='有异常'?`有异常，异常为：${examination}`:routine}`:"未检测",
                    answer: {
                        blood,
                        routine,
                        examination
                    },
                    remark: ''
                },
                {
                    index:28,
                    title: informedArr[20],
                    select: ovary=="已检测"?`已检测，结果：${oophoron=='有异常'?`有异常，异常为：${ootheca}`:oophoron}`:"未检测",
                    answer: {
                        ovary,
                        oophoron,
                        ootheca
                    },
                    remark: ''
                },
                {
                    index:29,
                    title: informedArr[21],
                    select: thyroid=="已检测"?`已检测，结果：${thyroidea=='有异常'?`有异常，异常为：${glandula}`:thyroidea}`:"未检测",
                    answer: {
                        thyroid,
                        thyroidea,
                        glandula
                    },
                    remark: ''
                },
                {
                    index:30,
                    title: informedArr[22],
                    select: skull=="已检测"?`已检测，结果：${vertex=='有异常'?`有异常，异常为：${scalp}`:vertex}`:"未检测",
                    answer: {
                        skull,
                        vertex,
                        scalp
                    },
                    remark: ''
                }
            ],
            agreeRemark:[],
            signUrl,
            selectAddress,
            userProvinceId:selectAddress&&selectAddress.province.id,
            userCityId: selectAddress&&selectAddress.city.id,
            userDistrictId: selectAddress&&selectAddress.area.id,
            userAddress: selectAddress&&selectAddress.areaStr,
        }
        if(nameError){
            Toast(nameError);
            return
        }
        if(!sender){
            Toast("请选择性别");
            return
        }
        if(!age){
            Toast("请选择年龄");
            return
        }
        if(heightError){
            Toast(heightError);
            return
        }
        if(weightError){
            Toast(weightError);
            return
        }
        if(cardNoError){
            Toast(cardNoError);
            return
        }
        if(phoneError){
            Toast(phoneError);
            return
        }
        if(!smoke){
            Toast(`请填写${informedArr[0]}`);
            return
        }
        if(!breakfast){
            Toast(`请填写${informedArr[1]}`);
            return
        }
        if(!midnight){
            Toast(`请填写${informedArr[2]}`);
            return
        }
        if(!exercise){
            Toast(`请填写${informedArr[3]}`);
            return
        }
        if(!family){
            Toast(`请填写${informedArr[4]}`);
            return
        }
        if(family=='有'&&!familyHistory){
            Toast(`请填写${informedArr[4]}的详述`);
            return
        }
        if(!spirit){
            Toast(`请填写${informedArr[5]}`);
            return
        }
        if(!medicine){
            Toast(`请填写${informedArr[6]}`);
            return
        }
        if(medicine=='是'&&!expand){
            Toast(`请填写${informedArr[6]}的详述`);
            return
        }
        if(!defecate){
            Toast(`请填写${informedArr[7]}`);
            return
        }
        if(!hepatitis){
            Toast(`请填写${informedArr[8]}`);
            return
        }
        if(!virus){
            Toast(`请填写${informedArr[9]}`);
            return
        }
        if(!humanPapilloma){
            Toast(`请填写${informedArr[10]}`);
            return
        }
        if(!colonoscopy){
            Toast(`请填写${informedArr[11]}`);
            return
        }
        if(colonoscopy=='是'&&!polyp){
            Toast(`请填写${informedArr[11]}的检测结果`);
            return
        }
        if(!gastroscope){
            Toast(`请填写${informedArr[12]}`);
            return
        }
        if(gastroscope=='是'&&!stomach){
            Toast(`请填写${informedArr[12]}的检测结果`);
            return
        }
        if(!landmark){
            Toast(`请填写${informedArr[13]}`);
            return
        }
        if(landmark=='已检测'&&!lung){
            Toast(`请填写${informedArr[13]}的检测结果`);
            return
        }
        if(landmark=='已检测'&&lung=='有异常'&&various.length==0){
            Toast(`请填写${informedArr[13]}的异常项目`);
            return
        }
        if(!ldct){
            Toast(`请填写${informedArr[14]}`);
            return
        }
        if(ldct=='已检测'&&!spiral){
            Toast(`请填写${informedArr[14]}的检测结果`);
            return
        }
        if(ldct=='已检测'&&spiral=='有异常'&&!drugCause){
            Toast(`请填写${informedArr[14]}的异常情况`);
            return
        }
        if(!breast){
            Toast(`请填写${informedArr[15]}`);
            return
        }
        if(breast=='已检测'&&!ultrasound){
            Toast(`请填写${informedArr[15]}的检测结果`);
            return
        }
        if(breast=='已检测'&&ultrasound=='有异常'&&!tungsten){
            Toast(`请填写${informedArr[15]}的异常情况`);
            return
        }
        if(!liver){
            Toast(`请填写${informedArr[16]}`);
            return
        }
        if(liver=='已检测'&&!dirty){
            Toast(`请填写${informedArr[16]}的检测结果`);
            return
        }
        if(liver=='已检测'&&dirty=='有异常'&&!exceed){
            Toast(`请填写${informedArr[16]}的异常情况`);
            return
        }
        if(!prostate){
            Toast(`请填写${informedArr[17]}`);
            return
        }
        if(prostate=='已检测'&&!nuclear){
            Toast(`请填写${informedArr[17]}的检测结果`);
            return
        }
        if(prostate=='已检测'&&nuclear=='有异常'&&!resonance){
            Toast(`请填写${informedArr[17]}的异常情况`);
            return
        }
        if(!pancreas){
            Toast(`请填写${informedArr[18]}`);
            return
        }
        if(pancreas=='已检测'&&!insulin){
            Toast(`请填写${informedArr[18]}的检测结果`);
            return
        }
        if(pancreas=='已检测'&&insulin=='有异常'&&!gland){
            Toast(`请填写${informedArr[18]}的异常情况`);
            return
        }
        if(!blood){
            Toast(`请填写${informedArr[19]}`);
            return
        }
        if(blood=='已检测'&&!routine){
            Toast(`请填写${informedArr[19]}的检测结果`);
            return
        }
        if(blood=='已检测'&&routine=='有异常'&&!examination){
            Toast(`请填写${informedArr[19]}的异常情况`);
            return
        }
        if(!ovary){
            Toast(`请填写${informedArr[20]}`);
            return
        }
        if(ovary=='已检测'&&!oophoron){
            Toast(`请填写${informedArr[20]}的检测结果`);
            return
        }
        if(ovary=='已检测'&&oophoron=='有异常'&&!ootheca){
            Toast(`请填写${informedArr[20]}的异常情况`);
            return
        }
        if(!thyroid){
            Toast(`请填写${informedArr[21]}`);
            return
        }
        if(thyroid=='已检测'&&!thyroidea){
            Toast(`请填写${informedArr[21]}的检测结果`);
            return
        }
        if(thyroid=='已检测'&&thyroidea=='有异常'&&!glandula){
            Toast(`请填写${informedArr[21]}的异常情况`);
            return
        }
        if(!skull){
            Toast(`请填写${informedArr[22]}`);
            return
        }
        if(skull=='已检测'&&!vertex){
            Toast(`请填写${informedArr[22]}的检测结果`);
            return
        }
        if(skull=='已检测'&&vertex=='有异常'&&!scalp){
            Toast(`请填写${informedArr[22]}的异常情况`);
            return
        }
        if(!signUrl){
            Toast("请签名");
            return
        }
        earlyScreeningApi.signUp(params).then(res=>{
            router.replace({
                name: 'earlyScreeningDoc'
            })
        })
    } catch (error) {
        console.log('error',error)
    }
  },
  findCert() {
    const { id, pactUrl } = this.options
    fadadaApi.findCert({
      companyId: id
    }).then(res => {
      if (res) {
        fadadaApi.genContract({
          companyId: id,
          businessId: id,
          contractUrl: pactUrl
        }).then(res => {
          router.push({
            name: "webview",
            data: {
              url: encodeURIComponent(res.signUrl),
              encode: true
            }
          });
        })
      } else {
        fadadaApi.getVerifyUrl({
          companyId: id
        }).then(res => {
          router.push({
            name: "webview",
            data: {
              url: encodeURIComponent(res.verifyUrl),
              encode: true
            }
          });
        })
      }
    })
  },
})
