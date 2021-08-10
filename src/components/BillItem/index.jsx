import React, {useEffect, useState} from 'react';
import { useHistory } from 'react-router-dom';
import { Cell, Icon } from 'zarm';
import PropTypes from 'prop-types';
import s from './style.module.less'
import CustomIcon from '../CustomIcon'
import { typeMap,imgUrlTrans } from '@/utils'
import dayjs from 'dayjs'

const BillItem = ({bill}) => {
  const history = useHistory()
  const [income, setIncome] = useState(0)
  const [expense, setExpense] = useState(0)
  useEffect(()=>{
    const _income = bill.bills.filter(i=>i.pay_type === 2).reduce((curr,item)=>{curr+=Number(item.amount); return curr},0);
    setIncome(_income);
    const _expense = bill.bills.filter(i=>i.pay_type === 1).reduce((curr, item)=>{curr+=Number(item.amount); return curr},0);
    setExpense(_expense);
  })
  const goToDetail = item=>{
    // console.log(item);
    history.push(`/detail?id=${item.id}`)
  }
  return <div className={s.item}>
    <div className={s.headerDate}>
      <div className={s.date}>{ bill.date }</div>
        <div className={s.money}>
          <span>
            <img src={imgUrlTrans(`/public/image/zhi@2x.png`)} alt="支" />
            <span className={s.z}>￥{ expense.toFixed(0) }</span>
          </span>
          <span>
            <img src= {imgUrlTrans(`/public/image/shou@2x.png`)} alt="收" />
            <span className={s.s}>￥{ income.toFixed(2) }</span>
          </span>
      </div>
    </div>
    {
      bill && bill.bills.map ((item)=><Cell
      className={s.bill}
      key={item.id}
      onClick={()=>goToDetail(item)}
      title={
        <>
          <CustomIcon 
            className={s.itemIcon}
            type={item.type_id ? typeMap[item.type_id].icon : 1}
          />
          <span>{ item.type_name }</span>
        </>
      }
      description={<span style={{ color: item.pay_type == 2 ? '#4caf50' : '#e53935' }}>{`${item.pay_type == 1 ? '-' : '+'}${item.amount}`}</span>}
        help={<div>{dayjs(Number(item.date)).format('HH:mm')} {item.remark ? `| ${item.remark}` : ''}</div>}
      >
      </Cell>)
    }
  </div>
}
BillItem.prototype = {
  bill: PropTypes.object
}

export default BillItem
