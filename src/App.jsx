import React, { useState, useEffect } from 'react'
import NavBar from './components/Nav'
import {
  Switch,
  Route,
  useLocation
} from "react-router-dom"

import { ConfigProvider } from 'zarm'
import zhCN from 'zarm/lib/config-provider/locale/zh_CN'

import routes from '@/router'

function App() {
  // const location = useLocation()
  const { pathname } = location
  const needNav = ['/','/data','/user']
  const [showNav, setShowNav] = useState(false)
  useEffect(() => {
    setShowNav(needNav.includes(pathname))
  }, [pathname]) // [] 内的参数若是变化，便会执行上述回调函数=
  return (
    <>
      <ConfigProvider primaryColor={'#007fff'}>
        <Switch>
          {
            routes.map(route => <Route exact key={route.path} path={route.path}>
              <route.component />
            </Route>)
          }
        </Switch>
      </ConfigProvider>
      <NavBar showNav={showNav}></NavBar>
    </>
  )
}

export default App
