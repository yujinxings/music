<template>
  <div class="minpaly">
    <div class="minpaly-content">
      <div class="content-img" :class="{active:isPaly}" @click="setIsDetail(true)" v-show="isMincont">
        <img :src="currentSong.imgUrl||currentSong.bgImgUrl" />
      </div>
      <p class="content-name" @click="setIsDetail(true)" v-show="isMincont">{{currentSong.name}}</p>
      <div class="no-paly" v-show="!isMincont">暂无播放</div>
      <div class="content-paly" @click="IsPaly(!isPaly)">
        <audio
          :src="currentSong.url"
          ref="audio"
          :autoplay="isPaly"
          @ended="issSinglePatternIndex"
          @canplay="getDuration"
          @timeupdate="updateTime"
        ></audio>
        <img src="../assets/img/note_btn_play_white.png" v-show="!isPaly" />
        <img src="../assets/img/note_btn_pause_white.png" v-show="isPaly" />
      </div>
      <div class="content-menu" @click="setIsMenu">
        <img src="../assets/img/aox.png" />
      </div>
    </div>
    <transition name="maskbox">
      <div class="minpaly-mask" v-show="isMenu">
        <div class="minpaly-mask-layer" @click="setIsMenu"></div>
        <transition name="mask">
          <div class="minpaly-mask-menu" v-show="isMenu">
            <div class="mask-title">
              当前播放
              <span>({{currentSongList.length}})</span>
            </div>

            <div class="mask-list" ref="maskScroll">
              <ul>
                <li
                  v-for="list in currentSongList"
                  :key="list.id"
                  :class="{active:list.id==currentSong.id}"
                  @click="clickMaskList([list,currentSongList])"
                  ref="maskList"
                >
                  <div class="list-img"></div>
                  <div class="list-name">{{list.name}}</div>
                </li>
              </ul>
            </div>
          </div>
        </transition>
      </div>
    </transition>
    <div class="minpaly-detail-nullbg" v-show="isDetail"></div>
    <transition name="detail">
      <div
        class="minpaly-detail"
        v-show="isDetail"
        :style="{  backgroundImage: `url('${currentSong.bgImgUrl}')`}"
      >
        <div class="detail-bg"></div>
        <div class="detail-content">
          <div class="detail-head">
            <div class="head-back" @click="setIsDetail(false)"></div>
            <div class="head-title">
              <p>{{currentSong.name}}</p>
              <span>{{currentSong.arName}} ></span>
            </div>
          </div>
          <div class="detail-middle">
            <div class="middle-img" v-show="!isLyric">
              <div class="img-top" :class="{active:isPaly}">
                <img src="../assets/img/c2u.png" />
              </div>
              <div class="img-outer" :class="{active:isPaly}" @click="isLyric=!isLyric">
                <img src="../assets/img/c0u.png" />
              </div>
              <div class="img-inside" :class="{active:isPaly}" @click="isLyric=!isLyric">
                <img :src="currentSong.bgImgUrl" />
              </div>
            </div>
            <div class="middle-lyric" v-show="isLyric">
              <div class="content-volume">
                <div class="volume-img">
                  <img src="../assets/img/c2n.png" alt />
                </div>
                <div class="volume-block">
                  <el-slider v-model="volume" @input="setVolume" :show-tooltip="false"></el-slider>
                </div>
              </div>
              <div class="lyric" @click="isLyric=!isLyric" ref="lyricScroll">
                <ul
                  v-show="currentSong.lyric?currentSong.lyric.length>10?true:false:false"
                  @touchstart="pressStart"
                  @touchend="loosenEnd"
                >
                  <li
                    v-for="list in currentSong.lyric"
                    :key="list.index"
                    :class="{active:songHighlight(list.index)}"
                    ref="lyricList"
                  >{{list.text}}</li>
                </ul>
                <ul v-show="currentSong.lyric?currentSong.lyric.length<10?true:false:false">暂无该歌词</ul>
              </div>
            </div>
          </div>
          <div class="detail-bottom">
            <div class="detail-base">
              <div class="base-left">{{currentTime | formatTime}}</div>
              <div class="base-block">
                <el-slider
                  v-model="progressTime"
                  @change="updateSongLocation"
                  :show-tooltip="false"
                ></el-slider>
              </div>
              <div class="base-right">{{durationTime | formatTime}}</div>
            </div>
            <div class="detail-controller">
              <div class="controller-mode">
                <img
                  src="../assets/img/b01.png"
                  v-show="patternIndex==1"
                  @click="setPattern(2,'单曲循环')"
                />
                <img
                  src="../assets/img/azd.png"
                  v-show="patternIndex==2"
                  @click="setPattern(3,'随机播放')"
                />
                <img
                  src="../assets/img/b0i.png"
                  v-show="patternIndex==3"
                  @click="setPattern(1,'列表循环')"
                />
              </div>
              <div class="controller-pre" @click="OnMusic">
                <img src="../assets/img/note_btn_pre.png" />
              </div>
              <div class="controller-paly" @click="IsPaly(!isPaly)">
                <img src="../assets/img/note_btn_play.png" v-show="!isPaly" />
                <img src="../assets/img/note_btn_pause.png" v-show="isPaly" />
              </div>
              <div class="controller-next" @click="mextMusic">
                <img src="../assets/img/note_btn_next.png" />
              </div>
              <div class="controller-menu" @click="setIsMenu">
                <img src="../assets/img/c2o.png" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <Particulars />
  </div>
</template>

<script>
import BScroll from "better-scroll";
import { mapState, mapMutations, mapGetters, mapActions } from "vuex";
import Particulars from "./Particulars";
import {
  SET_ISPALY,
  SET_PATTERNINDEX,
  SET_ADVANCEPLAY,
  SET_ISDETAIL
} from "../store/mutation-types.js";
export default {
  data() {
    return {
      isMenu: false, //播放列表的显示隐藏
      durationTime: 0, //歌曲总时长
      currentTime: 0, //歌曲当前时长
      isLyric: false, //是否显示歌词
      volume: 0, //当前音量
      isOpenRoll: true //是否开启歌词滚动
    };
  },
  computed: {
    ...mapState([
      "isMincont",
      "isPaly",
      "isDetail",
      "currentSong",
      "currentSongList",
      "patternIndex",
      "advancePlay"
    ]),
    ...mapGetters(["songIndex"]),

    progressTime: {
      //当前滑块的值
      get() {
        let time = parseInt(100 * (this.currentTime / this.durationTime));
        time = time > 0 ? time : 1;
        return time;
      },
      set(val) {
        this.currentTime = (val / 100) * this.durationTime;
      }
    },
    currentVolume() {
      return this.volume;
    }
  },
  filters: {
    formatTime(time) {
      //对时间进行格式化
      let min = Math.floor(time / 60);
      min = min < 10 ? "0" + min : min;
      let s = Math.floor(time) % 60;
      s = s < 10 ? "0" + s : s;
      return min + ":" + s;
    }
  },
  watch: {
    currentSong(val) {
      if (!val.url) {
        this.$message.closeAll();
        this.$message({
          message: "暂无该歌曲播放资源,听别的吧",
          center: true,
          duration: 3000,
          customClass: "part-message",
          offset: 100
        });
      }
    }
  },
  components: {
    Particulars
  },
  methods: {
    ...mapMutations({
      setIsPAly: SET_ISPALY,
      setPatternIndex: SET_PATTERNINDEX,
      setAdvancePlay: SET_ADVANCEPLAY,
      setIsDetail:SET_ISDETAIL
    }),
    ...mapActions(["setCurren", "mextMusic", "OnMusic"]),
    message(text){
      this.$message({
        message: text,
        center: true,
        duration: 1500,
        customClass: "part-message",
        offset: 100
      });
    },
    //切换模式
    setPattern(index, text) {
      this.setPatternIndex(index);
      this.message(text)
    },
    //当按下时停止歌词滚动
    pressStart() {
      clearTimeout(this.loosenTimer);
      this.isOpenRoll = false;
    },
    //当松开时延迟开启滚动
    loosenEnd() {
      this.loosenTimer = setTimeout(() => {
        this.isOpenRoll = true;
      }, 2000);
    },
    //修改音量
    setVolume() {
      this.$refs.audio.volume = this.volume / 100;
    },

    //歌词是否高亮并且滚动到高亮位置
    songHighlight(index) {
      if (
        index == this.currentSong.lyric.length - 1 &&
        this.currentTime > this.currentSong.lyric[index].finishTime
      ) {
        if (this.isOpenRoll) {
          let lyricListEle = this.$refs.lyricList[index];
          this.lyricScroll.scrollToElement(lyricListEle, 100, null, true);
        }
        return true;
      }
      if (
        this.currentSong.lyric[index].finishTime < this.currentTime &&
        this.currentTime < this.currentSong.lyric[index + 1].finishTime
      ) {
        if (this.isOpenRoll) {
          let lyricListEle = this.$refs.lyricList[index];
          this.lyricScroll.scrollToElement(lyricListEle, 100, null, true);
        }
        return true;
      }
      return false;
    },
    //播放结束时触发
    issSinglePatternIndex() {
      //判断是否有设置了其他歌曲的下一首播放
      if (this.advancePlay.length != 0) {
        console.log("我播放了设置的下一首音乐", this.advancePlay);
        this.setCurren(this.advancePlay);
        this.setAdvancePlay([]);
        return;
      }
      //判断当前模式是否单曲循环
      if (this.patternIndex == 2) {
        this.$refs.audio.load();
      } else {
        this.mextMusic();
      }
    },
    //开始/停止播放
    IsPaly(bool) {
      this.setIsPAly(bool);
      if (this.isPaly) {
        this.$refs.audio.play();
      } else {
        this.$refs.audio.pause();
      }
    },
    clickMaskList(arr){
      if(arr[0].id==this.currentSong.id){
        return
      }
      this.setCurren(arr)
    },
    setIsMenu() {
      //点击菜单创建或私刷新滚动并且滚动到当前歌曲位置
      if (this.isMincont) {
        this.isMenu = !this.isMenu;
        this.$nextTick(() => {
          this.maskInitalScroll();
          this.locationSCroll();
        });
      }
    },
    getDuration() {
      //设置当前音乐的总时长
      this.durationTime = this.$refs.audio.duration;
    },
    updateTime(e) {
      //设置当前播放的时间
      this.currentTime = e.target.currentTime;
    },
    updateSongLocation() {
      //改变滑块位置时改变当前播放的时间位置
      this.$refs.audio.currentTime = this.currentTime;
      this.IsPaly(true);
    },
    maskInitalScroll() {
      //创建歌单目录滚动
      if (!this.maskScroll) {
        this.maskScroll = new BScroll(this.$refs.maskScroll, {
          click: true
        });
      } else {
        this.maskScroll.refresh();
      }
    },
    lyricInitalScroll() {
      //创建歌词滚动
      if (!this.lyricScroll) {
        this.lyricScroll = new BScroll(this.$refs.lyricScroll, {
          click: true
        });
      } else {
        this.lyricScroll.refresh();
      }
    },
    locationSCroll() {
      //歌单目录滚动定位
      let maskListEle = this.$refs.maskList[this.songIndex];
      this.maskScroll.scrollToElement(maskListEle, 300, null, true);
    },
    destroyScroll() {
      //滚动的销毁
      if (this.maskScroll) {
        this.maskScroll.destroy();
        this.maskScroll = null;
      }
      if (this.lyricScroll) {
        this.lyricScroll.destroy();
        this.lyricScroll = null;
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.maskInitalScroll();
      this.lyricInitalScroll();
    });
  },
  beforeDestroy() {
    this.destroyScroll();
    clearTimeout(this.loosenTimer);
  }
};
</script>

<style lang="less" scoped>
.minpaly {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100vw;
  height: 50px;
  background-color: #fff;
  border-top: 1px solid rgba(7, 17, 27, 0.1);
  z-index: 99;
}
.minpaly-content {
  display: flex;
  height: 50px;
  align-items: center;
}
.content-img {
  flex: 0 0 40px;
  height: 40px;
  margin-left: 10px;
  border-radius: 50%;
  border: 2px solid rgba(7, 17, 27, 0.5);
  overflow: hidden;
  animation: contimg 5s linear infinite;
  animation-play-state: paused;
  &.active {
    animation-play-state: running;
  }
  img {
    width: 40px;
    height: 40px;
  }
}
.content-name {
  flex: 1;
  padding-left: 10px;
}
.content-paly {
  flex: 0 0 30px;
  margin: 0 20px;
  padding-top: 2px;
  img {
    width: 30px;
    height: 30px;
  }
}
.content-menu {
  flex: 0 0 30px;
  margin-right: 5px;
  img {
    width: 40px;
    height: 40px;
  }
}
.no-paly {
  flex: 1;
  padding-left: 20px;
}
.minpaly-mask {
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  z-index: 20;
  &.maskbox-enter,
  &.maskbox-leave-to {
    opacity: 0;
  }
  &.maskbox-enter-active,
  &.maskbox-leave-active {
    transition: all 0.5s linear;
  }
  &.maskbox-leave,
  &.maskbox-enter-to {
    opacity: 1;
  }
}
.minpaly-mask-layer {
  position: absolute;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(19, 18, 18, 0.5);
}
.minpaly-mask-menu {
  position: absolute;
  left: 20px;
  bottom: 20px;
  box-sizing: border-box;
  height: 60vh;
  width: calc(100vw - 40px);
  background-color: #fff;
  overflow: hidden;
  padding: 20px;
  border-radius: 20px;
  &.mask-enter,
  &.mask-leave-to {
    transform: translateY(100%);
    opacity: 0;
  }
  &.mask-enter-active,
  &.mask-leave-active {
    transition: all 0.3s linear;
  }
  &.mask-leave,
  &.mask-enter-to {
    transform: translateY(0);
    opacity: 1;
  }
  .mask-title {
    height: 40px;
    line-height: 40px;
    font-size: 20px;
    font-weight: 600;
    color: #232323;
    span {
      font-size: 16px;
      font-weight: 500;
      color: #999;
      padding-left: 4px;
    }
  }
  .mask-list {
    width: 100%;
    height: calc(60vh - 70px);
    padding-top: 10px;
    overflow: hidden;
    li {
      display: flex;
      align-items: center;
      height: 50px;
    }
    li.active {
      .list-img {
        flex: 0 0 25px;
        height: 25px;
        background: url("../assets/img/ap_.png") no-repeat center center;
        background-size: 25px 25px;
        margin-right: 10px;
      }
      .list-name {
        flex: 1;
        color: #ff2f58;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }
}
.minpaly-detail-nullbg {
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  background-color: #ccc;
}
.minpaly-detail {
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  &:after {
    content: "";
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    background: inherit;
    transform: scale(1.5);
    filter: blur(38px);
    z-index: 10;
  }
  &.detail-enter,
  &.detail-leave-to {
    opacity: 0;
  }
  &.detail-enter-active,
  &.detail-leave-active {
    transition: all 0.5s linear;
  }
  &.detail-leave,
  &.detail-enter-to {
    opacity: 1;
  }
  .detail-bg {
    position: fixed;
    left: 0;
    top: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(19, 18, 18, 0.5);
    z-index: 11;
  }
  .detail-content {
    position: absolute;
    left: 0;
    top: 0;
    width: 100vw;
    height: 100vh;
    box-sizing: border-box;
    padding: 2px 10px;
    overflow: hidden;
    z-index: 99;
  }
}

.detail-head {
  height: 50px;
  display: flex;
  align-items: center;
  padding-top: 5px;
  .head-back {
    flex: 0 0 38px;
    width: 30px;
    height: 30px;
    background: url("../assets/img/bgi.png") no-repeat center center;
    background-size: 30px 30px;
    margin-right: 10px;
  }
  .head-title {
    flex: 1;
    p {
      width: calc(100vw - 68px);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      font-size: 19px;
      color: rgba(255, 255, 255, 0.99);
      font-weight: 700;
    }
    span {
      display: inline-block;
      font-size: 14px;
      margin-top: 5px;
      color: rgba(255, 255, 255, 0.6);
    }
  }
}
.detail-base {
  display: flex;
  align-items: center;
  .base-left {
    font-size: 12px;
    flex: 0 0 30px;
    padding-right: 12px;
    padding-left: 10px;
    color: #fff;
  }
  .base-right {
    font-size: 12px;
    flex: 0 0 30px;
    padding-left: 12px;
    padding-right: 10px;
    color: rgba(0, 0, 0, 0.7);
  }
  .base-block {
    flex: 1;
  }
  /deep/.el-tooltip.el-slider__button {
    width: 10px;
    height: 10px;
    border: 0px;
  }
  /deep/.el-slider__runway {
    height: 3px;
    background: #a9a8a8;
  }
  /deep/.el-slider__bar {
    height: 3px;
    background: #e4e7ed;
  }
  /deep/.el-slider__button-wrapper {
    height: 34px;
  }
}
.detail-middle {
  height: calc(100vh - 175px);
  box-sizing: border-box;
}
.middle-img {
  position: relative;
  width: 100%;
  height: 100%;
  .img-top {
    position: absolute;
    left: 50%;
    top: 0;
    transform: translateX(-15%) rotate(-30deg);
    transform-origin: 19px 32px;
    width: 92px;
    height: 143px;
    transition: all 0.5s linear;
    z-index: 99;
    &.active {
      transform: translateX(-15%) rotate(-5deg);
    }
    img {
      width: 92px;
      height: 143px;
    }
  }

  .img-outer {
    position: absolute;
    left: 50%;
    top: 80px;
    margin-left: -140px;
    animation: contimg 5s linear infinite;
    animation-play-state: paused;
    &.active {
      animation-play-state: running;
    }
    img {
      width: 280px;
      height: 280px;
    }
  }

  .img-inside {
    position: absolute;
    left: 50%;
    margin-left: -100px;
    top: 120px;
    width: 200px;
    height: 200px;
    border-radius: 50%;
    overflow: hidden;
    animation: contimg 5s linear infinite;
    animation-play-state: paused;
    &.active {
      animation-play-state: running;
    }
    img {
      width: 200px;
      height: 200px;
    }
  }
}
.middle-lyric {
  //歌词
  position: relative;
  width: 100%;
  height: 100%;
  .content-volume {
    height: 30px;
    width: calc(100vw - 60px);
    display: flex;
    align-items: center;
    margin: 0 30px;
    .volume-img {
      flex: 0 0 18px;
      height: 18px;
      margin-left: -5px;
      margin-right: 20px;
      img {
        width: 18px;
        height: 18px;
      }
    }
    .volume-block {
      flex: 1;
      padding-right: 20px;
    }
    /deep/.el-slider__button {
      width: 10px;
      height: 10px;
      border: 0px;
    }
    /deep/.el-slider__runway {
      height: 3px;
      background: #a9a8a8;
    }
    /deep/.el-slider__bar {
      height: 3px;
      background: #e4e7ed;
    }
    /deep/.el-slider__button-wrapper {
      height: 32px;
    }
  }
  .lyric {
    text-align: center;
    font-size: 16px;
    color: #999;
    letter-spacing: 2px;
    height: calc(100% - 30px);
    line-height: 50px;
    overflow: hidden;
    li.active {
      color: #fff;
    }
  }
}
.detail-controller {
  display: flex;
  height: 72px;
  align-items: center;
  justify-content: center;
  overflow: hidden;

  .controller-mode {
    img {
      height: 40px;
      width: 40px;
    }
  }
  .controller-pre,
  .controller-next {
    padding: 0 10px;
    img {
      width: 60px;
      height: 60px;
    }
  }
  .controller-paly {
    img {
      width: 70px;
      height: 70px;
    }
  }
  .controller-menu {
    img {
      width: 55px;
      height: 55px;
    }
  }
}
@keyframes contimg {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>