const server = require('pushstate-server')

server.start({
  port: 80,
  directory: './dist'
})