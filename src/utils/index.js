import axios from "./axios";
import { baseUrl } from 'config'
import { Toast } from "zarm";
import ExpireCache from './ItemCache'

const MODE = import.meta.env.MODE // 环境变量
export const get = axios.get

export const post = axios.post

export const E = ExpireCache

const generateKeyError = new Error("Can't generate key from name and argument")

export const generateKey = function (name, ...args) {
  try {
    return `${name}:${args.join('_')}`
  } catch (error) {
    return generateKeyError
  }
}

export const typeMap = {
    1: {
      icon: 'canyin'
    },
    2: {
      icon: 'fushi'
    },
    3: {
      icon: 'jiaotong'
    },
    4: {
      icon: 'riyong'
    },
    5: {
      icon: 'gouwu'
    },
    6: {
      icon: 'xuexi'
    },
    7: {
      icon: 'yiliao'
    },
    8: {
      icon: 'lvxing'
    },
    9: {
      icon: 'renqing'
    },
    10: {
      icon: 'qita'
    },
    11: {
      icon: 'gongzi'
    },
    12: {
      icon: 'jiangjin'
    },
    13: {
      icon: 'zhuanzhang'
    },
    14: {
      icon: 'licai'
    },
    15: {
      icon: 'tuikuang'
    },
    16: {
      icon: 'qita'
    }
  }

export const REFRESH_STATE = {
  normal: 0,
  pull: 1,
  drop: 2,
  loading: 3,
  success: 4,
  failure: 5,
}
export const LOAD_STATE = {
  normal: 0,
  abort: 1,
  loading: 2,
  success: 3,
  failure: 4,
  complete: 5,
}

export const imgUrlTrans = (url)=> {
  if (url && url.startsWith('http')) {
    return url
  } else {
    url = `${MODE == 'development' ? 'http://staineds.com:7001' : baseUrl}${url}`
    return url
  }
}

export const checkUser = (str) => {
  const re=/^[a-zA-Z]\w{3,15}$/;
    if(re.test(str)){
      return 1;
    }
    else{
      // console.log("账号不合法");
      Toast.show('账号不合法， 账号为字母、数字、下划线组成，字母开头，4-16位。')
      return 0
    }  
}

export const checkPwd = (str) => {
  const re = /^[\w_-]{6,16}$/
  if (re.test(str)) {
    return 1
  }else {
    Toast.show('密码不合法，密码由字母，数字下划线组成，6-16位')
    return 0
  }
}

