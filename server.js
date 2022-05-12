const express = require ('express')
const compression = require ('compression')
const history = require('connect-history-api-fallback')
const path = require('path')
// 端口可以自己定义
const port = process.env.PORT || 80;
const app = express ()
// 开启 gzip 压缩
app.use (compression ())

app.use (express.static ('./dist'))
app.set('view engine', 'html');
app.use(history({
  rewrites:[
    {from: /\*/, to: '/'}
  ]
}))

app.get('*', function(req, res, next){
  res.sendFile(path.resolve(__dirname, './dist/index.html'))
})




module.exports = app.listen (port, function (err) {
  if (err) {
    console.log (err)
    return
  }
  console.log ('Listening at http://localhost:' + port + '\n')
})