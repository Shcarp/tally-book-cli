module.exports = {
  apps: [
    {
      name: 'tally-book',
      script: 'tally-book-server'
    },
  ],
  deploy: {
    production: {
      user: 'root',
      host: '1.117.56.86',
      ref: 'origin/master',
      repo: 'git@git.zhlh6.cn:Nick930826/juejue-vite-h5.git',
      path: '/workspace/juejue-vite-h5',
      'post-deploy': 'git reset --hard && git checkout master && git pull && npm i --production=false && npm run build:release && pm2 startOrReload ecosystem.config.js', // -production=false 下载全量包
      env: {
        NODE_ENV: 'production'
      }
    }
  }
}