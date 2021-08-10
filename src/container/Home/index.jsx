import React, { useEffect, useRef, useState } from 'react'
import { Icon, Pull,  } from 'zarm'
import s from './style.module.less'
import BillItem from '@/components/BillItem'
import dayjs from 'dayjs'
import { get, REFRESH_STATE, LOAD_STATE} from '@/utils'
import PopupType from '@/components/PopupType'
import CustomIcon from '@/components/CustomIcon'
import PopupDate from '@/components/PopupDate'
import PopupAddBill from '@/components/PopupAddBill'
const Home = () => {
  const typeRef = useRef()
  const dateRef = useRef()
  const addRef = useRef()
  const [inTotal, setInTotal] = useState(0)
  const [outTotal, setOutTotal] = useState(0)
  const [ currentSelect, setCurrentSelect] = useState({});
  const [list, setList] = useState([])
  const [page, setPage] = useState(1)
  const [currentTime, setCurrentTime] = useState(dayjs().format('YYYY-MM'))
  const [refreshing, setRefreshing] = useState(REFRESH_STATE.normal)
  const [loading, setLoading] = useState(LOAD_STATE.normal); // 上拉加载状态

  const [totalPage, setTotalPage] = useState(0); // 分页总数

  useEffect(()=>{
    getBillList()
  }, [page, currentSelect, currentTime])

  const getBillList = async ()=>{
    const { data } = await get(`/api/bill/list?page=${page}&page_size=5&date=${currentTime}&type_id=${currentSelect.id || 'all' }`)
    if(page === 1) {
      setList(data.list);
    } else {
      setList(list.concat(data.list));
    }
    if(data.list.length == 0) {
      setInTotal(0)
      setOutTotal(0)
    }else {
      const add = data.list.map((items)=>{
        const _income = items.bills.filter(i=>i.pay_type === 2).reduce((curr,item)=>{curr+=Number(item.amount); return curr},0);
        return _income
      }).reduce((curr, item) => {
        curr += item
        return curr
      },0)
      const rs = data.list.map((items)=>{
        const _expense = items.bills.filter(i=>i.pay_type === 1).reduce((curr, item)=>{curr+=Number(item.amount); return curr},0);
        return _expense
      }).reduce((curr, item)=> {
        curr += item
        return curr
      })
      setInTotal(rs)
      setOutTotal(add)
    } 
    setTotalPage(data.totalPage);
    setLoading(LOAD_STATE.success);
    setRefreshing(REFRESH_STATE.success)
  } 
  const refreshData = ()=>{
    setRefreshing(REFRESH_STATE.loading)
    if(page !== 1) {
      setPage(1)
    }else {
      getBillList();
    }
  }
  const loadData = ()=> {
    if(page < totalPage) {
      setLoading(LOAD_STATE.loading)
      setPage(page+1)
    }
  }
  const toggle = () => {
    typeRef.current && typeRef.current.show()
  }
  const select = (item) => {
    setRefreshing(REFRESH_STATE.loading);
    // 触发刷新列表，将分页重制为 1
    setPage(1);
    setCurrentSelect(item)
  }
  const monthToggle = () => {
    dateRef.current && dateRef.current.show()
  }
  const selectMonth = (item) => {
    if (item == currentTime) {
      return
    }
    setRefreshing(REFRESH_STATE.loading);
    setPage(1);
    setCurrentTime(item)
  }
  const addToggle = ()=>{
    addRef.current && addRef.current.show()
  }

  return <div className={s.home}>
    <div className={s.header}>
      <div className={s.dataWrap}>
        <span className={s.expense}>总支出：<b>￥{inTotal}</b></span>
        <span className={s.income}>总收入：<b>¥{outTotal}</b></span>
      </div>
      <div className={s.typeWrap}>
        <div className={s.left} onClick={toggle}>
          <span className={s.title}>{ currentSelect.name || '全部类型' } <Icon className={s.arrow} type="arrow-bottom" /></span>
        </div>
        <div className={s.right} onClick={monthToggle}>
          <span className={s.time}>{currentTime}<Icon className={s.arrow} type="arrow-bottom" /></span>
        </div>
      </div>
    </div>
    <div className={s.contentWrap}>
      {
        list ? <Pull
          animationDuration={200}
          stayTime={500}
          refresh = {{
            state: refreshing,
            handler: refreshData,
          }}
          load = {{
            state: loading,
            distance: 200,
            handler: loadData
          }}
        >
          {
            list.map((item,index)=><BillItem bill={item} key={index} />)
          }
        </Pull> : null 
      }
    </div>
    <PopupType ref={typeRef} onSelect={select}></PopupType>
    <PopupDate ref={dateRef} mode="month" onSelect={selectMonth}></PopupDate>
    <PopupAddBill ref={addRef} onReload={refreshData}></PopupAddBill>
    <div className={s.add} onClick={addToggle}>
      <CustomIcon type="tianjia" />
    </div>
  </div>
}

export default Home

