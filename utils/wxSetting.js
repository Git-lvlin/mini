
/**
 * 获取授权
 * auth 权限名 Array/String
 * type auth值类型 1 string/2 array
*/
const getAuth = async (auth, value, type) => {
  let state = false;
  if(type === 1) {
    state = await setWxAuth(auth, value);
  } else if(type === 2) {
    state = [];
    await auth.forEach(async (item, index) => {
      if(item) {
        state.push(true);
      } else {
        state.push(await setWxAuth(item, value[index]));
      }
    })
  }
  console.log(" getAuth state 21", state);
  return state;
}

/**
 * 首次请求微信授权
 * 
 * 
*/
const setWxAuth = async (auth, value) => {
  let state = false;
  if(value === undefined) {
    await wx.authorize({ scope: `scope.${auth}` }).then(res => {
      if(res.errMsg === "authorize:ok") {
        state = true;
      }
    }).catch(err => {
      state = false;
    });
  }
  return state;
};

/**
 * 检查是否有权限
 * auth 权限名 Array/String
 * needAuth 是否要完成授权
*/
export const checkSetting = async (auth, needAuth = false) => {
  let resAuth = '';
  // authValueType  1 string 2 array
  let authValueType = 1;
  if(auth instanceof Array) {
    resAuth = [];
    authValueType = 2;
  }
  const settingData = await wx.getSetting();
  if(settingData.errMsg === "getSetting:ok") {
    const authSetting = settingData.authSetting;
    if(authValueType === 1) {
      resAuth = authSetting[`scope.${auth}`];
    } else {
      auth.forEach(item => {
        resAuth.push(!!authSetting[`scope.${item}`]);
      })
    }
  }
  if(needAuth) {
    if(!resAuth && authValueType === 1) {
      resAuth = await getAuth(auth, resAuth, authValueType);
    }
    if(authValueType === 2) {
      let notAllTrue = false;
      resAuth.forEach(item => {
        if(!item) {
          notAllTrue = true;
        }
      })
      if(notAllTrue) {
        resAuth = await getAuth(auth, resAuth, authValueType);
      }
    }
  }
  return resAuth;
};