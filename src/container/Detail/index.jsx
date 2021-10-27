import React, { useState, useEffect, useRef } from 'react';
import Header from '@/components/Header';
import CustomIcon from '@/components/CustomIcon';
import qs from 'query-string'
import { useLocation } from 'react-router-dom';
import { get, typeMap, post, E, generateKey } from '@/utils'
import classes from 'classnames'
import dayjs from 'dayjs'
import s from './style.module.less';
import PopupAddBill from '@/components/PopupAddBill';
import { Modal, Toast } from 'zarm';

const Detail = () => {
  const editRef = useRef()
  const location = useLocation()
  const { id } = qs.parse(location.search)
  const [detail, setDetail] = useState({})
  // console.log(location)
  // console.log(id)
  useEffect(() => {
    getDetail()
  }, [])

  const getDetail = async () => {
    const { data } = await get(`/api/bill/detail?id=${id}`);
    setDetail(data)
  }
  const deleteDetail = () => {
    Modal.confirm({
      title: '删除',
      content: '确认删除账单',
      onOk: async ()=> {
        const { data } = await post('/api/bill/delete', { id })
        Toast.show('删除成功')
        history.back()
      }
    })
  }
  const editDetail = () => {
    editRef.current && editRef.current.show()
  }

  return <div className={s.detail}>
    <Header title='账单详情' />
    <div className={s.card}>
      <div className={s.type}>
        <span className={classes({ [s.expense]: detail.pay_type == 1, [s.income]: detail.pay_type == 2 })}>
          <CustomIcon className={s.iconfont} type={detail.type_id ? typeMap[detail.type_id].icon : 1} />
        </span>
        <span>{detail.type_name || ''}</span>
      </div>
      {
        detail.pay_type == 1
        ? <div className={classes(s.amount,s.expense)}>-{detail.amount}</div>
        : <div className={classes(s.amount,s.income)}>+{detail.amount}</div>
      }
      <div className={s.info}>
        <div className={s.time}>
          <span>记录时间</span>
          <span>{dayjs(Number(detail.date)).format('YYYY-MM-DD HH:mm')}</span>
        </div>
        <div className={s.remark}>
          <span>备注</span>
          <span>{ detail.remark || '-' }</span>
        </div>
        <div className={s.operation}>
          <span><CustomIcon type='shanchu' onClick={deleteDetail} />删除</span>
          <span><CustomIcon type='tianjia' onClick={editDetail} />编辑</span>
        </div>
      </div>
    </div>
    <PopupAddBill ref={editRef} detail={detail} onReload={getDetail} />
  </div>
}

export default Detail