import config from './WebIMConfig'
import websdk from 'easemob-websdk'

var WebIM = {}
// window.WebIM 将 WebIM变量提升到全局
WebIM = window.WebIM = websdk

WebIM.config = config

WebIM.conn = new WebIM.connection({
  url: WebIM.config.xmppURL,
  apiURL: WebIM.config.apiURL,
  appKey: WebIM.config.appkey,
  isHttpDNS: WebIM.config.isHttpDNS,
  isMultiLoginSessions: WebIM.config.isMultiLoginSessions,
  https: WebIM.config.https,
  heartBeatWait: WebIM.config.heartBeatWait,
  isAutoLogin: true,
  autoReconnectNumMax: WebIM.config.autoReconnectNumMax,
  autoReconnectInterval: WebIM.config.autoReconnectInterval,
  delivery: WebIM.config.delivery,
})

// 兼容
if (!WebIM.conn.apiUrl) {
  WebIM.conn.apiUrl = WebIM.config.apiURL;
}
//     开启WebIM事件监听
WebIM.conn.listen({
  onOpened: function () { //连接成功回调 
    console.log('连接成功')
    // window.localStorage.setItem('islogin',true)
  },
  onClosed: function (message) { //连接关闭回调
    console.log(message, '连接失败')
    // window.localStorage.setItem('islogin',false)
  },
  onOnline: function () {
    console.log("本机网络连接成功")
  },                  //本机网络连接成功
  onOffline: function () {
    console.log("本机网络掉线")
  },                 //本机网络掉线
  onError: function (message) {
    console.log(message, '失败回调')
  },          //失败回调
})

export default WebIM