// PopupType/index.jsx
import React, { forwardRef, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { Popup, Icon } from 'zarm'
import classes from 'classnames'
import { get, E, generateKey } from '@/utils'
const cache_key = generateKey('type', 'list')
import s from './style.module.less'
// 拿到父组件传入的ref属性 方便控制
const PopupType = forwardRef(({onSelect}, ref) => {
  const [ show, setShow ] = useState(false)
  const [ active, setActive ] = useState('all')
  const [ expense, setExpense ] = useState([])
  const [ income, setIncome ] = useState([])
  useEffect(async ()=> {
    if (!show) {
      return
    } 
    let data
    if (!E.has(cache_key)) {
      let { data: res } = await get('/api/type/list')
      data = res
      E.set(cache_key, res)
    }else {
      data = E.get(cache_key)
    }
    setExpense(data.filter(i=>i.type === 1))
    setIncome(data.filter(i=>i.type === 2))
  },[show])
  if (ref) {
    ref.current = {
      show: () => {
        setShow(true)
      },
      close: () => {
        setShow(false)
      }
    }
  }

  const choseType = (item) => {
    setActive(item.id)
    setShow(false)
    onSelect(item)
  }

  return <Popup 
    visible={show}
    direction='bottom'
    onMaskClick={()=>setShow(false)}
    destroy={false}
    mountContainer={()=>document.body}
  >
    <div className={s.popupType}>
      <div className={s.header}>
        请选择类型
        <Icon type="wrong" className={s.cross} onClick={()=>setShow(false)} />
      </div>
      <div className={s.content}>
        <div onClick={()=>choseType({id:'all'})} className={classes({ [s.all]:true,[s.active]: active == 'all'})}>全部类型</div>
        <div className={s.title}>支出</div>
        <div className={s.expenseWrap}>
          {
            expense.map((item, index) => <p key={index} onClick={()=>choseType(item)} className={classes({[s.active]: active === item.id})}>{item.name}</p>)
          }
        </div>
        <div className={s.title}>收入</div>
        <div className={s.expenseWrap}>
          {
            income.map((item, index) => <p key={index} onClick={()=>choseType(item)} className={classes({[s.active]: active === item.id})}>{item.name}</p>)
          }
        </div>
      </div>
    </div>
  </Popup>
})

PopupType.propTypes = {
  onSelect: PropTypes.func
}
export default PopupType

