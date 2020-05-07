<template>
  <transition name="details">
    <div class="details" v-loading="loading">
      <div
        class="details-content"
        :style="{  backgroundImage: `url('${songDetails.coverImgUrl}')`}"
      >
        <div class="content-position">
          <div class="details-top">
            <img src="../assets/img/bgi.png" @click="$router.back()" />
            <span>歌单</span>
          </div>
          <div class="content">
            <div class="content-img">
              <img :src="songDetails.coverImgUrl" />
              <div class="content-paly-count">
                <img src="../assets/img/aw1.png" />
                <span>{{songDetails.playCount | filCount }}</span>
              </div>
            </div>
            <div class="content-text">
              <div class="text-title">{{songDetails.name}}</div>
              <div class="text-author">
                <img :src="songDetails.creator.avatarUrl" />
                <span>{{songDetails.creator.nickname}}</span>
              </div>
              <div class="text-det">{{songDetails.description}}</div>
              <div class="text-more" @click="setIsMore">
                <img src="../assets/img/ax8.png" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="details-song" ref="songScroll">
        <ul>
          <li class="song-item" v-for="(list,i) in songDetails.tracks" :key="list.id">
            <div class="song-num" :class="{active:list.id==currentSong.id}">{{i+1}}</div>
            <div class="song-text" @click="clickSong([list,songDetails.tracks])">
              <p class="song-name">{{list.name}}</p>
              <p class="song-ar">{{list.ar[0].name}}</p>
            </div>
            <div class="song-part" @click="showParit(list,songDetails.tracks)">
              <img src="../assets/img/bor.png" alt />
            </div>
          </li>
        </ul>
      </div>
      <div
        class="details-more"
        :style="{  backgroundImage: `url('${songDetails.coverImgUrl}')`}"
        v-show="isMore"
      >
        <div class="more-content" ref="moreScroll">
          <div class="more-scroll">
            <div class="more-img">
              <img :src="songDetails.coverImgUrl" />
            </div>
            <div class="more-title">{{songDetails.name}}</div>
            <div class="more-tags">
              标签：
              <span v-for="tags in songDetails.tags" :key="tags">{{tags}}</span>
            </div>
            <div class="more-signature">{{songDetails.creator.signature}}</div>
            <div class="more-description">{{songDetails.description}}</div>
          </div>
          <div class="more-close" @click="setIsMore">
            <img src="../assets/img/bnv.png" />
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import BScroll from "better-scroll";
import { mapState, mapMutations, mapActions } from "vuex";
import {
  SET_LOOKPARTICULARS,
  SET_ISLOOKPARTICULARS,
  SET_ISDETAIL
} from "../store/mutation-types";
export default {
  data() {
    return {
      isMore: false,
      loading: false
    };
  },
  computed: {
    ...mapState(["isSongDetails", "songDetails", "currentSong"])
  },
  filters: {
    filCount(num) {
      num = num + "";
      if (num.length >= 5) {
        return Math.floor(num / 10000) + "万";
      } else {
        return num;
      }
    }
  },
  methods: {
    ...mapMutations({
      setLookParitculars: SET_LOOKPARTICULARS,
      setIsLookParitculars: SET_ISLOOKPARTICULARS,
      setIsDetail: SET_ISDETAIL
    }),
    ...mapActions(["setCurren"]),
    //歌单更多详情的隐藏显示并创建滚动
    setIsMore() {
      this.isMore = !this.isMore;
      if (this.isMore) {
        //创建歌单更多详情滚动
        this.$nextTick(() => {
          if (!this.moreScroll) {
            this.moreScroll = new BScroll(this.$refs.moreScroll, {
              click: true
            });
          } else {
            this.moreScroll.refresh();
          }
        });
      }
    },
    //点击歌单中相应的歌曲 播放
    clickSong(arr) {
      if (arr[0].id == this.currentSong.id) {
        this.setIsDetail(true);
        return;
      }
      this.setCurren(arr);
      this.$message.closeAll();
      this.$message({
        message: "正在努力加载歌曲中",
        center: true,
        duration: 2000,
        customClass: "part-message",
        offset: 100
      });
    },
    //点击显示 查看歌曲详情并获取对应的图片
    showParit(item, list) {
      clearTimeout(this.timer);
      this.loading = true;
      this.timer = setTimeout(() => {
        this.loading = false;
        this.$message.closeAll();
        this.$message({
          message: "加载失败,请检查下网络哦",
          center: true,
          duration: 1500,
          customClass: "part-message",
          offset: 100
        });
      }, 6000);
      this.axios
        .get(`/mus/?type=detail&id=${item.id}&br=128000`, {
          timeout: 5000
        })
        .then(res => {
          item = { ...item, imgUrl: res.data.songs[0].al.picUrl };
          this.setLookParitculars([item, list]);
          this.setIsLookParitculars(true);
          this.loading = false;
          clearTimeout(this.timer);
        });
    },
    initalScroll() {
      //创建滚动歌单
      if (!this.songScroll) {
        this.songScroll = new BScroll(this.$refs.songScroll, {
          click: true
        });
      } else {
        this.songScroll.refresh();
      }
    },
    destroyScroll() {
      //清除滚动
      if (this.songScroll) {
        this.songScroll.destroy();
        this.songScroll = null;
      }
      if (this.moreScroll) {
        this.moreScroll.destroy();
        this.moreScroll = null;
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initalScroll();
    });
  },
  beforeDestroy() {
    this.destroyScroll();
    clearTimeout(this.timer);
  }
};
</script>


<style lang="less" scoped>
.details {
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  background-color: #fff;
  z-index: 10;
  &.details-enter,
  &.details-leave-to {
    transform: translateY(30%);
    opacity: 1;
  }
  &.details-enter-active,
  &.details-leave-active {
    transition: all 0.3s linear;
  }
  &.details-leave,
  &.details-enter-to {
    transform: translateY(0);
    opacity: 1;
  }
}
.details-content {
  height: 230px;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  &:after {
    content: "";
    width: 100%;
    height: 200px;
    position: absolute;
    left: 0;
    top: 0;
    background: inherit;
    transform: scale(1.5);
    filter: blur(38px);
    z-index: 10;
  }
}
.content-position {
  position: absolute;
  left: 0;
  top: 0;
  z-index: 20;
}
.details-top {
  width: 100vw;
  height: 55px;
  display: flex;
  align-items: center;
  z-index: 20;
  margin-bottom: 10px;
  img {
    flex: 0 0 30px;
    height: 30px;
    padding-left: 15px;
  }
  span {
    flex: 1;
    font-size: 22px;
    color: #fff;
    margin-left: 15px;
  }
}
.content {
  display: flex;
  align-items: center;
}

.content-img {
  position: relative;
  flex: 0 0 120px;
  height: 120px;
  background-color: #000;
  margin-left: 20px;
  border-radius: 10px;
  overflow: hidden;
  img {
    width: 120px;
    height: 120px;
  }
}
.content-paly-count {
  position: absolute;
  right: 4px;
  top: 5px;
  img {
    width: 12px;
    height: 15px;
    vertical-align: middle;
  }
  span {
    color: #fff;
    font-style: 10px;
  }
}
.content-text {
  flex: 1;
  width: 0;
  padding: 0 20px;
  .text-title {
    font-size: 20px;
    text-overflow: -o-ellipsis-lastline;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    color: #fff;
  }
  .text-author {
    padding-top: 10px;
    img {
      width: 30px;
      height: 30px;
      border-radius: 50%;
      vertical-align: middle;
    }
    span {
      font-size: 14px;
      color: #fff;
      padding-left: 5px;
      vertical-align: middle;
    }
  }
  .text-det {
    padding-top: 10px;
    padding-right: 10px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: rgb(218, 218, 218);
  }
  .text-more {
    position: absolute;
    right: 25px;
    bottom: 5px;
    img {
      width: 15px;
      height: 15px;
    }
  }
}
.details-song {
  position: absolute;
  left: 0;
  top: 210px;
  height: calc(100vh - 260px);
  border-radius: 20px 20px 0 0;
  width: 100vw;
  background-color: #fff;
  overflow: hidden;
  z-index: 20;
  ul {
    margin-top: 25px;
  }
  .song-item {
    width: 100vw;
    height: 50px;
    display: flex;
    align-items: center;
    padding: 10px 0;
  }
  .song-num {
    flex: 0 0 50px;
    text-align: center;
    &.active {
      font-size: 0;
      width: 25px;
      height: 25px;
      margin-left: -15px;
      padding-right: 20px;
      background: url("../assets/img/ap_.png") no-repeat center center;
      background-size: 25px 25px;
    }
  }
  .song-text {
    flex: 1;
    width: 0;
    line-height: 20px;
  }
  .song-name {
    font-size: 18px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .song-ar {
    font-size: 14px;
    color: #999;
  }
  .song-part {
    flex: 0 0 60px;
    text-align: center;
    img {
      width: 25px;
      height: 25px;
    }
  }
}
.details-more {
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  z-index: 30;
  &:after {
    content: "";
    width: 100vw;
    height: 100vh;
    position: absolute;
    left: 0;
    top: 0;
    background: inherit;
    transform: scale(1.5);
    filter: blur(25px);
    z-index: 10;
  }
}
.more-content {
  position: absolute;
  left: 0;
  top: 40px;
  width: 100vw;
  height: calc(100vh - 120px);
  z-index: 40;
  overflow: hidden;

  .more-scroll {
    padding-top: 30px;
  }
  .more-img {
    margin: 0 auto;
    width: 65vw;
    height: 65vw;
    img {
      width: 65vw;
      height: 65vw;
    }
  }
  .more-title {
    text-align: center;
    font-size: 18px;
    color: #fff;
    padding: 20px 40px 30px;
    line-height: 25px;
  }
  .more-tags {
    font-size: 14px;
    color: #fff;
    padding-left: 25px;
    span {
      display: inline-block;
      padding: 6px 12px;
      border-radius: 20px;
      background-color: rgba(218, 218, 218, 0.253);
      margin-right: 10px;
    }
  }
  .more-signature {
    font-size: 14px;
    padding: 15px 30px;
    color: rgb(238, 238, 238);
  }
  .more-description {
    font-size: 14px;
    padding: 15px 25px;
    color: rgb(238, 238, 238);
    letter-spacing: 2px;
    line-height: 20px;
  }
  .more-close {
    position: absolute;
    right: 20px;
    top: 0px;
    width: 30px;
    height: 30px;
    text-align: right;
    img {
      width: 20px;
      height: 20px;
    }
  }
}
</style>