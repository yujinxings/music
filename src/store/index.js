import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters';
import mutations from './mutations';
import actions from './actions';

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    isLogin:false,//是否登录
    user:'', //当前登录的用户账号
    recommendList:[], //每日推荐列表
    isMincont:false, //底部菜单是否有内容
    isPaly:false, //是否正在播放
    isDetail:false,//当前歌曲详情的显示
    currentSong:[],//当前播放的歌曲详情
    currentSongList:[],//当前播放歌单
    patternIndex:1,//当前播放模式
    lookParticulars:[],//当前查看歌曲详情内容
    isLookParticulars:false, //当前查看详情歌曲内容显示隐藏
    isLookCollect:false,//当前查看的歌曲是否收藏
    advancePlay:[],//预播放的音乐以及对应歌单
    songDetails:"", //歌单内容
    singer:{},//当前查看的歌手
    singerAlbums:{},//当前点击的歌手专辑id及名字
  },
  getters,
  mutations,
  actions
})
