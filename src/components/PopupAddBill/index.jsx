import React, { forwardRef, useState, useEffect, useRef } from 'react'
import classes from 'classnames'
import s from './style.module.less'
import dayjs from 'dayjs'
import PopupDate from '../PopupDate'
import { Icon, Popup, Keyboard, Input, Toast } from 'zarm'
import CustomIcon from '../CustomIcon'
import { get,typeMap,post,E, generateKey } from '@/utils'
const cache_key = generateKey('type', 'list')
const PopupAddBill = forwardRef(({detail, onReload}, ref) =>{
  const [show, setShow] = useState(false)
  const [payType, setPayType] = useState('expense')
  const dateRef = useRef()
  const [date, setDate] = useState(new Date()) 
  const [amount, setAmount] = useState('')
  const [currentType, setCurrentType] = useState({})
  const [expense, setExpense] = useState([])
  const [income, setIncome] = useState([])
  const [remark, setRemark] = useState("")
  const [showRemake, setShowRemark] = useState(false)
  const id = detail?.id
  useEffect(()=>{
    if (id) {
      setPayType(detail.pay_type == 1 ? 'expense' : 'income')
      setCurrentType({
        id: detail.type_id,
        name: detail.type_name
      })
      setRemark(detail.remark)
      setAmount(detail.amount)
      setDate(dayjs(Number(detail.date)).$d)
    }
  }, [detail])
  useEffect(async () => {
    let data
    if (!E.has(cache_key)) {
      let { data: res } = await get('/api/type/list')
      data = res
      E.set(cache_key, res)
    }else {
      data = E.get(cache_key)
    }
    const _expense = data.filter(i=>i.type ==1) 
    const _income = data.filter(i => i.type == 2)
    setExpense(_expense)
    setIncome(_income)
    if (!id) {
      setCurrentType(_expense[0])
    }
  },[])
  const changeType = (type) =>{
    setPayType(type)
  }
  const selectDate = (val)=> {
    setDate(val)
  }
  const handleMoney = (value)=>{
    value = String(value)
    if (value === 'delete') {
      let _amount  = amount.slice(0, amount.length-1)
      setAmount(_amount)
      return
    }
    if (value === 'ok') {
      addBill()
      return 
    }
    if (value == '.' && amount.includes('.') && amount.split('.')[1].length >= 2) return
    setAmount(amount + value)
  }
  const addBill = async ()=> {
    if(!amount) {
      Toast.show('请输入具体金额')
      return
    }
    const params = {
      amount: Number(amount).toFixed(2),
      type_id: currentType.id,
      type_name: currentType.name,
      date: dayjs(date).unix()*1000,
      pay_type: payType == 'expense' ? 1: 2,
      remark: remark || ''
    }
    if (id) {
      params.id = id
      const result = await post('/api/bill/update', params);
      Toast.show('修改成功');
    }else {
      const result = await post('/api/bill/add', params)
      setAmount('')
      setPayType('expense')
      setCurrentType(expense[0])
      setDate(new Date())
      setRemark('')
      Toast.show('添加成功')
    }
    setShow(false)
    onReload && onReload()
  }
  if(ref) {
    ref.current = {
      show: ()=>{
        setShow(true)
      },
      close: ()=>{
        setShow(false)  
      }
    }
  }
  return <Popup
    visible={show}
    direction="bottom"
    onMaskClick={()=>setShow(false)}
    destroy={false}
    mountContainer={()=>document.body}
  >
    <div className={s.addWrap}>
      <header className={s.header}>
        <span className={s.close} onClick={()=>setShow(false)}>
          <Icon type="wrong"></Icon>
        </span>
      </header>
      <div className={s.filter}>
        <div className={s.type}>
          <span onClick={()=>changeType('expense')} className={classes({[s.expense]:true, [s.active]:payType=="expense"})}>支出</span>
          <span onClick={()=>changeType('income')} className={classes({[s.income]:true, [s.active]:payType=="income"})}>收入</span>
        </div>
        <div className={s.time} onClick={()=>dateRef.current && dateRef.current.show()}>
          {dayjs(date).format('MM-DD')} <Icon className={s.arrow}  type="arrow-bottom" />
        </div>
      </div>
      <div className={s.typeWarp}>
        <div className={s.typeBody}>
          {
            (payType === 'expense' ? expense : income).map(item => <div onClick={() => setCurrentType(item)} key={item.id} className={s.typeItem}>
              <span className={classes({[s.iconfontWrap]: true, [s.expense]: payType == 'expense', [s.income]: payType == 'income', [s.active]: currentType.id == item.id})}>                
                <CustomIcon className={s.iconfont} type={typeMap[item.id].icon} />
              </span>
              <span>{ item.name}</span>
            </div>)
          }
        </div>
      </div>
      <div className={s.remark}> 
        {
          showRemake ? <Input 
          autoHeight
          showLength
          maxLength={50}
          type="text"
          rows={3}
          value={remark}
          placeholder="请输入备注信息"
          onChange={val=>setRemark(val)}
          onBlur={()=>setShowRemark(false)}
           /> : <span onClick={()=>setShowRemark(true)}>{remark || '添加备注'}</span>
        }
      </div>
      <div className={s.money}>
        <span className={s.sufix}>￥</span>
        <span className={classes(s.amount, s.animation)}>{amount}</span>
        <Keyboard type="price" onKeyClick={(value)=>handleMoney(value)}></Keyboard>
      </div>
    
      <PopupDate ref={dateRef} onSelect={selectDate}></PopupDate>
    </div>
  </Popup>
})

export default PopupAddBill

