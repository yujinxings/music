const data = require('./data.json')
const song = data.song //歌单
const singer = data.singer //歌手
const recommend = data.recommend //每日推荐

module.exports = {
  configureWebpack: {
    devServer: {
      before(app) {
        app.get('/api/song', function (req, res) {
          res.json({ data: song });
        })
        app.get('/api/singer', function (req, res) {
          res.json({ data: singer });
        })
        app.get('/api/recommend', function (req, res) {
          res.json({ data: recommend });
        })
      },
      proxy: {
        "/mus": {
          target: "https://api.imjad.cn/cloudmusic",
          changeOrigin: true,
          pathRewrite: { "^/mus": "" }
        },
        "/search": {
          target: "https://v1.alapi.cn/api/music",
          changeOrigin: true,
        },
        "/album": {
          target: "http://music.163.com/api/artist/albums",
          changeOrigin: true,
          pathRewrite: { "^/album": "" }
        }
      }
    }
  }
}