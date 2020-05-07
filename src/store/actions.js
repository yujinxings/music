import * as types from './mutation-types';
import axios from 'axios';
export default {
  //设置播放的音乐
  setCurren({ commit }, arr) {
    if (this.loading) {
      this.axiosCancel()
    }
    this.loading = true; // 表示正在请求
    let { CancelToken } = axios;
    console.log('正在请求',arr)
    axios.all([
      axios.get(`/mus/?type=song&id=${arr[0].id}&br=128000`),
      axios.get(`/mus/?type=detail&id=${arr[0].id}&br=128000`),
      axios.get(`/mus/?type=lyric&id=${arr[0].id}`)]
      , {
        timeout: 5000,
        cancelToken: new CancelToken(c => {
          // 函数接收一个 cancel 函数作为参数
          this.axiosCancel = c;
        })
      }).then(axios.spread((songRes, detailRes, lyricRes) => {
        this.loading = false;
        //对获取到的歌词进行处理
        let arrlyr = lyricRes.data.lrc.lyric.split('\n')
        arrlyr = arrlyr.map((i, index) => {
          let currenindex = i.indexOf(']')
          let text = i.slice(currenindex + 1)
          text = text == "" ? "~" : text
          text = text == "\n" ? "~" : text
          let min = parseInt(i.slice(1, currenindex).slice(0, 2))
          let s = i.slice(1, currenindex).slice(3, 5) - 0
          let m = i.slice(1, currenindex).slice(6) - 0
          let finishTime = min * 60 + s + "." + m - 0
          finishTime = currenindex == -1 ? "" : finishTime
          return {
            finishTime,
            text,
            index
          }
        })
        arrlyr = arrlyr.slice(0, arrlyr.length - 1)
        arr[0] = { ...arr[0], url: songRes.data.data[0].url, arName: detailRes.data.songs[0].ar[0].name, lyric: arrlyr, bgImgUrl: detailRes.data.songs[0].al.picUrl }
        commit(types.SET_CURRENTSONG, arr[0])
        commit(types.SET_CURRENTSONGLIST, arr[1])
        commit(types.SET_ISMINCONT, true)
        commit(types.SET_ISPALY, true)

      })).catch(err => {
        console.log(err, '请求超时');
        this.loading = false;
      })
  },

  //播放下一首音乐
  mextMusic({ state, getters, commit, dispatch }) {
    commit(types.SET_ISPALY, false)
    commit(types.SET_ISPALY, true)
    if (state.patternIndex == 1 || state.patternIndex == 2) {
      if (getters.songIndex != state.currentSongList.length - 1) {
        dispatch('setCurren', [state.currentSongList[getters.songIndex + 1], state.currentSongList]);
      } else {
        dispatch('setCurren', [state.currentSongList[0], state.currentSongList]);
      }
    } else if (state.patternIndex == 3) {
      let random = Math.floor(Math.random() * state.currentSongList.length)
      dispatch('setCurren', [state.currentSongList[random], state.currentSongList])
    }

  },
  //播放上一首音乐
  OnMusic({ state, getters, commit, dispatch }) {
    commit(types.SET_ISPALY, false)
    commit(types.SET_ISPALY, true)

    if (state.patternIndex == 1 || state.patternIndex == 2) {
      if (getters.songIndex != 0) {
        dispatch('setCurren', [state.currentSongList[getters.songIndex - 1], state.currentSongList]);
      } else {
        dispatch('setCurren', [state.currentSongList[state.currentSongList.length - 1], state.currentSongList]);
      }
    } else if (state.patternIndex == 3) {
      let random = Math.floor(Math.random() * state.currentSongList.length)
      dispatch('setCurren', [state.currentSongList[random], state.currentSongList])
    }

  },
  add(){
    console.log(this);
    
  }
}