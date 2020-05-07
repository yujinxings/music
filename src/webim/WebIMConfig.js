export default {
  xmppURL: '//im-api-v2.easemob.com/ws',    // xmpp Server地址
  apiURL: 'http://a1.easemob.com',               // rest Server地址
  appkey: '1126200416181172#vuedemo',               // App key
  https: false,                            // 是否使用https
  isHttpDNS: true,                          // 3.0 SDK支持，防止DNS劫持从服务端获取XMPPUrl、restUrl 
  isMultiLoginSessions: false,              // 是否开启多页面同步收消息，注意，需要先联系商务开通此功能
  isDebug: false,                           // 打开调试，会自动打印log，在控制台的console中查看log
  autoReconnectNumMax: 2,                   // 断线重连最大次数
  autoReconnectInterval: 2,                 // 断线重连时间间隔
  heartBeatWait: 4500,                      // 使用webrtc（视频聊天）时发送心跳包的时间间隔，单位ms
  delivery: true,                           // 是否发送已读回执
}

