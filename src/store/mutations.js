import * as types from './mutation-types';
export default {
  [types.SET_ISLOGIN](state,bool){
    state.isLogin=bool
  },
  [types.SET_USER](state,str){
    state.user=str
  },
  [types.ADD_RECOMMEND](state, list) {
    state.recommendList = list
  },
  [types.SET_ISMINCONT](state, bool) {
    state.isMincont = bool
  },
  [types.SET_ISPALY](state, bool) {
    if (state.isMincont) {
      state.isPaly = bool
    }
  },
  [types.SET_ISDETAIL](state,bool){
    state.isDetail=bool
  },
  [types.SET_CURRENTSONG](state, song) {
    state.currentSong = song
  },
  [types.SET_CURRENTSONGLIST](state, songlist) {
    state.currentSongList = songlist
  },
  [types.SET_PATTERNINDEX](state, index) {
    state.patternIndex = index
  },
  [types.SET_LOOKPARTICULARS](state, arr) {
    state.lookParticulars = arr
  },
  [types.SET_ISLOOKPARTICULARS](state, bool) {
    state.isLookParticulars = bool
  },
  [types.SET_ISLOOKCOLLECT](state, bool) {
    state.isLookCollect = bool
  },
  [types.SET_ADVANCEPLAY](state,advance){
    state.advancePlay=advance
  },
  [types.SET_SONGDETAILS](state,obj){
    state.songDetails=obj
  },
  [types.SET_SINGER](state,obj){
    state.singer=obj
  },
  [types.SET_SINGERALBUMS](state,obj){
    state.singerAlbums=obj
  },
}