import React, { useRef, useState, useEffect } from 'react'
import PopupDate from '@/components/PopupDate'
import dayjs from 'dayjs'
import { Icon, Progress} from 'zarm'
import { get,typeMap } from '@/utils'
import classes from 'classnames'
import s from './style.module.less'
import CustomIcon from '@/components/CustomIcon'
let proportionChart  = null
const Data = () => {
  const monthRef = useRef
  const [totalType, setTotalType] = useState('expense');
  const [pieType, setPieType] = useState('expense')
  const [totalExpense, setTotalExpense] = useState(0); // 总支出
  const [totalIncome, setTotalIncome] = useState(0); // 总收入
  const [expenseData, setExpenseData] = useState([]); // 支出数据
  const [incomeData, setIncomeData] = useState([]); // 收入数据
  const [currentMonth, setCurrentMonth] = useState(dayjs().format('YYYY-MM'));
  
  useEffect(() => {
    getData()
    return ()=>{
      proportionChart.dispose();
    }
  }, [currentMonth])
  const setPieChart = (data) => {
    if (echarts) {
      // 初始化饼图，返回实例。
      proportionChart = echarts.init(document.getElementById('proportion'));
      proportionChart.setOption({
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)'
          },
          // 图例
          legend: {
              data: data.map(item => item.type_name)
          },
          series: [
            {
              name: '支出',
              type: 'pie',
              radius: '55%',
              data: data.map(item => {
                return {
                  value: item.number,
                  name: item.type_name
                }
              }),
              emphasis: {
                itemStyle: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              }
            }
          ]
      })
    };
  };


  const getData = async ()=> {
    const { data } = await get(`/api/bill/data?date=${currentMonth}`);

    setTotalExpense(data.total_expense)
    setTotalIncome(data.total_income)
    const _income = data.total_data.filter(item=>item.pay_type == 2).sort((a, b) => b.number - a.number)
    const _expense = data.total_data.filter(item=>item.pay_type == 1).sort((a, b) => b.number - a.number)
    setExpenseData(_expense)
    setIncomeData(_income)

    setPieChart(pieType == 'expense' ? _expense: _income)
  }
  const changeTotalType = (type) => {
    setTotalType(type)
  }
  const monthShow = () =>{
    monthRef.current && monthRef.current.show()
  }
  const selectMonth = (item) =>{
    setCurrentMonth(item);
  }
  const changePieType = (type) => {
    setPieType(type)
    setPieChart(type == 'expense' ? expenseData : incomeData)
  }

  return <div className={s.data}>
    <div className={s.total}>
      <div className={s.time} onClick={monthShow}>
        <span>{currentMonth}</span>
        <Icon className={s.date} type="date" />
      </div>
      <div className={s.title}>总支出</div>
      <div className={s.expense}>￥{totalExpense}</div>
      <div className={s.income}>总收入￥{totalIncome}</div>
    </div>
    <div className={s.structure}>
        <div className={s.head}>
          <span className={s.title}>收支构成</span>
          <div className={s.tab}>
            <span onClick={()=>changeTotalType('expense')} className={classes({ [s.expense]: true, [s.active]: totalType == 'expense' })}>支出</span>
            <span onClick={()=>changeTotalType('income')} className={classes({ [s.income]: true, [s.active]: totalType == 'income' })}>收入</span>
          </div>
        </div>
        <div className={s.content}>
          {
            (totalType == 'expense' ? expenseData : incomeData).map((item)=><div key={item.type_id} className={s.item}>
              <div className={s.left}>
                <div className={s.type}>
                    <span className={classes({[s.expense]:totalType == 'expense',[s.income]: totalType == 'income'})}>
                      <CustomIcon type={item.type_id ? typeMap[item.type_id].icon : 1} />
                    </span>
                    <span className={s.name}>{ item.type_name }</span>
                  </div>
                  <div className={s.progress}>¥{ Number(item.number).toFixed(2) || 0 }</div>
              </div>
            <div className={s.right}>
              <div className={s.percent}> 
                <Progress
                    shape="line"
                    percent={Number((item.number / Number(totalType == 'expense' ? totalExpense : totalIncome)) * 100).toFixed(2)}
                    theme='primary'
                  />
                </div>
              </div>
            </div>)
          }
        </div>
      </div>
      <div className={s.structure}>
          <div className={s.proportion}>
          <div className={s.head}>
            <span className={s.title}>收支构成</span>
            <div className={s.tab}>
                <span onClick={() => changePieType('expense')}  className={classes({ [s.expense]: true, [s.active]: pieType == 'expense'  })}>支出</span>
                <span onClick={() => changePieType('income')} className={classes({ [s.income]: true, [s.active]: pieType == 'income'  })}>收入</span>
              </div>
            </div>
            <div id='proportion'></div>
          </div>
      </div>
    <PopupDate ref={monthRef} mode="month" onSelect={selectMonth} />
  </div>
}

export default Data