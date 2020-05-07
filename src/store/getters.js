export default {
  songIndex(state) {//当前歌曲的下标值
    for (let i = 0; i < state.currentSongList.length; i++) {
      if (state.currentSongList[i].name == state.currentSong.name) {
        return i
      }
    }
    return -1
  }
}