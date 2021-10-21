// Account/index.jsx
import React from 'react';
import { Cell, Input, Button, Toast } from 'zarm';
import Header from '@/components/Header'
import { imgUrlTrans } from '@/utils'

import s from './style.module.less'

const Account = (props) => {
  return <>
  <Header title="关于" />
  <div>应该没人会看到这里吧，就偷偷放两张丑照吧</div>
  {/* <img className={s.img} src={imgUrlTrans('/public/image/my01.jpg')}></img>
  <img className={s.img} src={imgUrlTrans('/public/image/my02.jpg')}></img> */}
</>
};

export default Account;
