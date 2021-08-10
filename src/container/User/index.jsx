import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom';
import { get,imgUrlTrans } from '@/utils'
import s from './style.module.less'
import { Cell,Button } from 'zarm'


const User = () => {
  const [user, setUser] = useState({})
  const history = useHistory()
  useEffect(()=>{
    getUserInfo();
  },[])
  const getUserInfo = async () => {
    const { data } = await get('/api/user/getInfo')
    setUser(data)
  }
  const logout = async () => {
    localStorage.removeItem('token');
    history.push('/login');
  };
  return <div className={s.user}>
    <div className={s.head}>
      <div className={s.info}>
        <span>昵称：{user.username || '--'}</span>
        <span>
          <img style={{width: 30, height: 30, verticalAlign: '-10px'}} src={imgUrlTrans('/public/image/geqian.png')} />
          <b>{ user.signature || '暂无个性签名'}</b>
        </span>
      </div>
      <img className={s.avatar} style={{ width: 60, height: 60, borderRadius: 8 }} src={user.avatar || ''} alt="" />
    </div>
    <div className={s.content}>
      <Cell
        hasArrow
        title="用户信息修改"
        onClick={()=>history.push('./userinfo')}
        icon={<img style={{width: 20, verticalAlign: '-7px'}} src={imgUrlTrans('/public/image/gxqm.png')}/>} 
      />
      <Cell
        hasArrow
        title="重置密码"
        onClick={()=>history.push('./account')}
        icon={<img style={{width: 20, verticalAlign: '-7px'}} src={imgUrlTrans('/public/image/zhaq.png')} />} 
      />
      <Cell
        hasArrow
        title="关于"
        onClick={()=>history.push('./about')}
        icon={<img style={{width: 20, verticalAlign: '-7px'}} src={imgUrlTrans('/public/image/lianxi.png')} />} 
      />

    </div>
    <Button className={s.logout} block theme="danger" onClick={logout}>退出登录</Button>
  </div>
}

export default User
