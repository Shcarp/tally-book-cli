import React, { useCallback, useState } from 'react'
import { useHistory } from 'react-router';
import { Cell, Input, Button, Checkbox, Toast, Loading, ActivityIndicator } from 'zarm'
import CustomIcon from '@/components/CustomIcon';
import s from './style.module.less'
import Captcha from 'react-captcha-code'
import {post,checkUser,checkPwd} from '@/utils'
import useForm from "./hooks/useForm"
import cx from 'classnames'
const Login = () => {
  const [ values, setValue ] = useForm(null)
  const [ verify, setVerify ] = useState('')
  const [ captcha, setCaptcha ] = useState('') // 验证码变化后存储值
  const [ agree, setAgree ] = useState(false)
  const [ type, setType ] = useState('login')
  const handleChange = useCallback((captcha) => {
    setCaptcha(captcha)
  })
  const onSubmit = async ()=> {
    if (!values.username) {
      Toast.show('请输入账号')
      return
    }
    if (!values.password) {
      Toast.show('请输入密码')
      return
    }
    try {
      // 判断是否是登录状态
      if (type == 'login') {
        // 执行登录接口，获取 token
        const { data } = await post('/api/user/login', {
          username: values.username,
          password: values.password
        });
        // 将 token 写入 localStorage
        localStorage.setItem('token', data.token);
        Toast.show('登录成功');
        window.location.href = '/'
      } else {
        if (!verify) {
          Toast.show('请输入验证码')
          return
        };
        if (verify != captcha) {
          Toast.show('验证码错误')
          return
        };
        if (checkUser(values.username) === 0) return
        if (checkPwd(values.password) === 0) return
        const { data } = await post('/api/user/register', {
          username: values.username,
          password: values.password
        });
        Toast.show('注册成功');
        // 注册成功，自动将 tab 切换到 login 状态
        setType('login');
      }
    } catch (error) {

    }
  };
  return <div className={s.auth}>
    <div className={s.head} />
    <div className={s.tab}>
      <span className={cx({ [s.avtive]: type == 'login' })} onClick={() => setType('login')}>登录</span>
      <span className={cx({ [s.avtive]: type == 'register' })} onClick={() => setType('register')}>注册</span>
    </div>
    <div className={s.form}>
      <Cell icon={<CustomIcon type="zhanghao" />}>
        <Input
          clearable
          type="text"
          placeholder="请输入账号"
          onChange={(value)=>setValue('username' ,value)}
        />
      </Cell>
      <Cell icon={<CustomIcon type="mima" />}>
        <Input
          clearable
          type="password"
          placeholder="请输入密码"
          onChange={(value)=>setValue('password' , value)}
        />
      </Cell>
      {
        type === 'register' ? <Cell icon={<CustomIcon type="mima" />}>
          <Input
            clearable
            type="text"
            placeholder="请输入验证码"
            onChange={(value)=>setVerify(value)}
          />
          <Captcha charNum={4} onChange={handleChange} />
        </Cell> : null
      }
      
    </div>
    <div className={s.operation}>
      {
        type === 'register' ? <div className={s.agree}>
        <Checkbox checked={agree} onClick={()=>setAgree(!agree)} />
        <label className="text-light">阅读并同意<a>《协议》</a></label>
        </div> : null
      }
      <Button block theme="primary" onClick={onSubmit}>{type === 'register' ? '注册': '登录' }</Button>
    </div>
  </div>
}

export default Login