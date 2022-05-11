import React from 'react'
import ReactDOM from 'react-dom'
import 'lib-flexible/flexible'
import './index.css'
import App from './App'
import { Route,BrowserRouter as Router, } from 'react-router-dom'

if ('serviceWorker' in navigator) {
  navigator.serviceWorker
  .register('/sw.js', {
    scope: '/'
  })
  .then(()=>{
    console.log('Service worker registered')
  })
  .catch(err => {
    console.log('ServiceWorker registration failed: ', err);
  })
}

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <App />
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
)
