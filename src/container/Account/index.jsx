// Account/index.jsx
import React from 'react';
import { Cell, Input, Button, Toast } from 'zarm';
import { createForm  } from 'rc-form';
import Header from '@/components/Header'
import { post, checkPwd } from '@/utils'

import s from './style.module.less'

const Account = (props) => {
  const {getFieldProps, getFieldError} = props.form;
  const submit = () =>{
    props.form.validateFields(async (error, value)=>{
      if (!error) {
        if(value.newpass != value.newpass2) {
          Toast.show('两次密码不一致')
          return
        }
        if (checkPwd(value.newpass2) === 0) return
        await post('/api/user/modify_pass', {
          old_pass: value.oldpass,
          new_pass: value.newpass,
        })
        Toast.show('修改成功')
      }
    })
  }
  return <>
  <Header title="重制密码" />
  <div className={s.account}>
    <div className={s.form}>
      <Cell title="原密码">
        <Input
          clearable
          type="text"
          placeholder="请输入原密码"
          {...getFieldProps('oldpass', { rules: [{ required: true }] })}
        />
      </Cell>
      <Cell title="新密码">
        <Input
          clearable
          type="text"
          placeholder="请输入新密码"
          {...getFieldProps('newpass', { rules: [{ required: true }] })}
        />
      </Cell>
      <Cell title="确认密码">
        <Input
          clearable
          type="text"
          placeholder="请再此输入新密码确认"
          {...getFieldProps('newpass2', { rules: [{ required: true }] })}
        />
      </Cell>
    </div>
    <Button className={s.btn} block theme="primary" onClick={submit}>提交</Button>
  </div>
</>
};

export default createForm()(Account);
