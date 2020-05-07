<template>
  <div class="singer-albums" v-loading="loading">
    <div class="details-content" :style="{  backgroundImage: `url('${album.blurPicUrl}')`}">
      <div class="content-position">
        <div class="details-top">
          <img src="../assets/img/bgi.png" @click="$router.back()" />
          <span>专辑</span>
        </div>
        <div class="content">
          <div class="content-img">
            <img :src="`${album.blurPicUrl}?param=120y120`" />
          </div>
          <div class="content-text">
            <div class="text-title">{{album.name}}</div>
            <div class="text-ar-name">歌手：{{singerAlbums.name}}</div>
            <div class="text-det">{{album.description}}</div>
            <div class="text-more" @click="setIsMore">
              <img src="../assets/img/ax8.png" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="details-song" ref="albumsScroll">
      <ul>
        <li class="song-item" v-for="(list,i) in songList" :key="list.id">
          <div class="song-num" :class="{active:list.id==currentSong.id}">{{i+1}}</div>
          <div class="song-text" @click="setPaly([list,songList])">
            <p class="song-name">{{list.name}}</p>
            <p class="song-ar">{{list.ar[0].name}}</p>
          </div>
          <div class="song-part" @click="showParit(list,songList)">
            <img src="../assets/img/bor.png" alt />
          </div>
        </li>
      </ul>
    </div>
    <div
      class="details-more"
      :style="{  backgroundImage: `url('${album.blurPicUrl}')`}"
      v-show="isMore"
    >
      <div class="more-content" ref="moreScroll">
        <div class="more-scroll">
          <div class="more-img">
            <img :src="album.blurPicUrl" />
          </div>
          <div class="more-title">{{album.name}}</div>
          <div class="more-description">{{album.description}}</div>
        </div>
        <div class="more-close" @click="setIsMore">
          <img src="../assets/img/bnv.png" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BScroll from "better-scroll";
import { mapState, mapActions, mapMutations } from "vuex";
import {
  SET_LOOKPARTICULARS,
  SET_ISLOOKPARTICULARS,
  SET_ISDETAIL
} from "../store/mutation-types";
export default {
  data() {
    return {
      isMore: false,
      album: {},
      songList: [],
      loading: false
    };
  },
  computed: {
    ...mapState(["singerAlbums", "currentSong"])
  },
  methods: {
    ...mapMutations({
      setLookParitculars: SET_LOOKPARTICULARS,
      setIsLookParitculars: SET_ISLOOKPARTICULARS,
      setIsDetail: SET_ISDETAIL
    }),
    ...mapActions(["setCurren"]),
    setPaly(arr) {
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
    //点击显示 查看歌曲详情并获取对应的图片
    showParit(item, list) {
      //优化用户体验请求超时时会有提示
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
          this.$nextTick(() => {
            this.loading = false;
            clearTimeout(this.timer);
          });
        })
        .catch(err => {
          console.log(err, "请求超时");
          this.loading = false;
        });
    },
    initalScroll() {
      //创建滚动歌单
      if (!this.albumsScroll) {
        this.albumsScroll = new BScroll(this.$refs.albumsScroll, {
          click: true
        });
      } else {
        this.albumsScroll.refresh();
      }
    },
    destroyScroll() {
      //清除滚动
      if (this.albumsScroll) {
        this.albumsScroll.destroy();
        this.albumsScroll = null;
      }
      clearTimeout(this.timer);
    }
  },
  mounted() {
    this.loading = true;
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
      this.$router.back();
    }, 6000);
    this.axios
      .get(`/mus/?type=album&id=${this.singerAlbums.id}`, {
        timeout: 5000
      })
      .then(res => {
        console.log(res);
        this.album = res.data.album;
        this.songList = res.data.songs;
        this.$nextTick(() => {
          this.initalScroll();
          this.loading = false;
          clearTimeout(this.timer);
        });
      });
  },
  beforeDestroy() {
    this.destroyScroll();
    clearTimeout(this.timer);
  }
};
</script>

<style lang="less" scoped>
.singer-albums {
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  background-color: #fff;
}
.details-content {
  height: 230px;
  background-repeat: no-repeat;
  background-size: 100vw 390px;
  &:after {
    content: "";
    width: 100%;
    height: 200px;
    position: absolute;
    left: 0;
    top: 0;
    background: inherit;
    transform: scale(1.5);
    filter: blur(15px);
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

.content-text {
  flex: 1;
  width: 0;
  padding: 0 20px;
  .text-ar-name {
    font-size: 12px;
    color: rgb(218, 218, 218);
    padding-top: 15px;
  }
  .text-title {
    font-size: 18px;
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
  }
  .text-det {
    padding-top: 30px;
    padding-right: 70px;
    text-overflow: -o-ellipsis-lastline;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    font-size: 10px;
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
    font-size: 12px;
    color: #999;
  }
  .song-part {
    flex: 0 0 60px;
    text-align: center;
    img {
      width: 21px;
      height: 21px;
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