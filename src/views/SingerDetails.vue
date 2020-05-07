<template>
  <div class="singer-detalis" v-loading="loading">
    <div class="details-content" :style="{  backgroundImage: `url('${artist.picUrl}')`}">
      <div class="content-position">
        <div class="details-top">
          <img src="../assets/img/bgi.png" @click="$router.back()" />
        </div>
        <div class="content">
          <div class="content-name">{{artist.name}}</div>
        </div>
      </div>
    </div>
    <div class="details-singer" ref="singerScroll">
      <ul>
        <li class="singer-albums">
          专辑
          <span>{{`(${artist.albumSize})`}}</span>
        </li>
        <li
          class="singer-item"
          v-for="list in hotAlbums"
          :key="list.id"
          @click="redirectsAlbums({id:list.id,name:artist.name})"
        >
          <div class="singer-img">
            <img :src="`${list.picUrl}?param=50y50`" class="img1" />
            <img src="../assets/img/ayl.png" class="img2" />
          </div>
          <div class="singer-text">
            <p class="singer-name">
              {{list.name}}
              <span>{{list.alias.length==0?"":` ( ${list.alias[0]} )`}}</span>
            </p>
            <p class="singer-ar">{{list.publishTime | formatDate}} 歌曲{{list.size}}</p>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { formatDate } from "../time";
import BScroll from "better-scroll";
import { SET_SINGERALBUMS } from "../store/mutation-types";
import { mapState, mapMutations } from "vuex";
export default {
  data() {
    return {
      artist: {}, //歌手详情
      hotAlbums: [], //歌手专辑
      loading: false
    };
  },
  computed: {
    ...mapState(["singer"])
  },
  filters: {
    formatDate(time) {
      var date = new Date(time);
      return formatDate(date, "yyyy.MM.dd");
    }
  },
  methods: {
    ...mapMutations({
      setSingerAlbums: SET_SINGERALBUMS
    }),
    redirectsAlbums(id) {
      this.setSingerAlbums(id);
      this.$router.push({ name: "SingerAlbums" });
    },
    initalScroll() {
      //创建滚动歌单
      if (!this.singerScroll) {
        this.singerScroll = new BScroll(this.$refs.singerScroll, {
          click: true
        });
      } else {
        this.singerScroll.refresh();
      }
    },
    destroyScroll() {
      //清除滚动
      if (this.singerScroll) {
        this.singerScroll.destroy();
        this.singerScroll = null;
      }
    },
    //网络请求数据
    getAlbum() {
      console.log(this.singer.id);

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
        .get(`/album/${this.singer.id}`, {
          timeout: 5000
        })
        .then(res => {
          console.log(res);
          if (res.data.code == 404) {
            this.loading = false;
            this.$message.closeAll();
            this.$message({
              message: "暂无该歌手信息",
              center: true,
              duration: 2500,
              customClass: "part-message",
              offset: 100
            });
            clearTimeout(this.timer);
            this.$router.back();
          } else {
            this.artist = res.data.artist;
            this.hotAlbums = res.data.hotAlbums;
          }
          this.$nextTick(() => {
            this.initalScroll();
            this.loading = false;
            clearTimeout(this.timer);
          });
        })
        .catch(err => {
          console.log(err, "请求超时");
          this.loading = false;
        });
    }
  },
  mounted() {
    this.getAlbum();
  },
  beforeDestroy() {
    this.destroyScroll();
    clearTimeout(this.timer);
  }
};
</script>

<style lang="less" scoped>
.singer-detalis {
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  background-color: #fff;
  overflow: hidden;
}
.details-content {
  height: 230px;
  background-repeat: no-repeat;
  background-size: 100vw 290px;
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
}
.content {
  position: absolute;
  left: 20px;
  bottom: -120px;
  .content-name {
    font-size: 20px;
    color: #fff;
  }
}

.details-singer {
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
    padding: 0 20px;
  }
  .singer-albums {
    height: 40px;
    line-height: 40px;
    font-size: 18px;
    padding-left: 20px;
    span {
      font-size: 12px;
      color: #999;
    }
  }
  .singer-item {
    position: relative;
    height: 50px;
    display: flex;
    align-items: center;
    padding: 10px 0;
  }
  .singer-img {
    flex: 0 0 70px;
    height: 50px;
    .img1 {
      width: 50px;
      height: 50px;
      border-radius: 7px;
    }
    .img2 {
      position: absolute;
      left: 49px;
      top: 10px;
      width: 10px;
      height: 50px;
    }
  }
  .singer-text {
    flex: 1;
    width: 0;
    line-height: 20px;
  }
  .singer-name {
    font-size: 16px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    span {
      font-size: 14px;
    }
  }
  .singer-ar {
    font-size: 12px;
    color: #999;
    padding-top: 5px;
  }
  .singer-part {
    flex: 0 0 60px;
    text-align: center;
    img {
      width: 25px;
      height: 25px;
    }
  }
}
</style>