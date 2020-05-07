<template>
  <div class="search-list" v-loading="loading">
    <div class="search-back">
      <img src="../assets/img/bgf.png" @click="searchListBack" />
      <span>单曲</span>
    </div>
    <div class="list-scroll" ref="listScroll">
      <ul>
        <li class="list-item" v-for="(list,i) in songsList" :key="i">
          <div class="list-num" :class="{active:list.id==currentSong.id}">{{i+1}}</div>
          <div class="list-text" @click="setPaly([list,songsList])">
            <p class="list-name">{{list.name}}</p>
            <p class="list-ar">{{list.artists[0].name}}</p>
          </div>
          <div class="list-part" @click="showParit(list,songsList)">
            <img src="../assets/img/bor.png" alt />
          </div>
        </li>
        <li v-show="!iscurrenLoading" class="list-loading">正在加载中</li>
        <li v-show="isbottom" class="list-loading">——已经到底啦——</li>
      </ul>
    </div>
  </div>
</template>

<script>
import BScroll from "better-scroll";
import { mapMutations, mapActions, mapState } from "vuex";
import {
  SET_ISLOOKPARTICULARS,
  SET_LOOKPARTICULARS,
  SET_ISDETAIL
} from "../store/mutation-types";
export default {
  data() {
    return {
      songsList: null,
      offset: 0,
      loading: false,
      iscurrenLoading: true, //下拉加载显示loading
      isbottom: false //当全部数据加载完毕时显示
    };
  },
  computed: {
    ...mapState(["currentSong"])
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
    searchListBack() {
      this.songsList = null;
      this.$router.back();
    },
    getSongs() {
      this.loading = true;
      this.offset = 0;
      this.axios
        .get(
          `/search/?keyword=${this.$route.query.name}&offset=${this.offset}&limit=20`
        )
        .then(res => {
          this.songsList = res.data.data.songs;
          this.$nextTick(() => {
            this.loading = false;
            this.initalScroll();
            //定义上拉加载
            this.listScroll.on("pullingUp", () => {
              if (this.iscurrenLoading && this.isbottom == false) {
                this.iscurrenLoading = false;
                setTimeout(() => {
                  this.offset = this.offset + 1;
                  this.axios
                    .get(
                      `/search/?keyword=${this.$route.query.name}&offset=${this.offset}&limit=20`,
                      { timeout: 5000 }
                    )
                    .then(res => {
                      this.songsList = [
                        ...this.songsList,
                        ...res.data.data.songs
                      ];
                      if (res.data.data.songs == undefined) {
                        this.isbottom = true;
                      }
                      this.$nextTick(() => {
                        this.listScroll.refresh();
                        this.iscurrenLoading = true;
                        this.listScroll.finishPullUp();
                      });
                    });
                }, 1500);
              }
            });
          });
        })
        .catch(err => {
          console.log(err, "请求超时");
        });
    },
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
      if (!this.listScroll) {
        this.listScroll = new BScroll(this.$refs.listScroll, {
          click: true,
          pullUpLoad: { threshold: -100 }
        });
      } else {
        this.listScroll.refresh();
      }
    },
    destroyScroll() {
      //清除滚动
      if (this.listScroll) {
        this.listScroll.destroy();
        this.listScroll = null;
      }
    }
  },
  activated() {
    this.getSongs();
  },
  beforeDestroy() {
    this.destroyScroll();
  }
};
</script>

<style lang="less" scoped>
.search-list {
  position: fixed;
  left: 0;
  top: 0px;
  width: 100vw;
  height: calc(100vh - 50px);
  background-color: #fff;
  box-sizing: border-box;
  padding: 0 10px;
}
.search-back {
  height: 40px;
  display: flex;
  align-items: center;
  border-bottom: 1px solid rgba(158, 158, 158, 0.397);
  img {
    width: 25px;
    height: 25px;
  }
  span {
    font-size: 18px;
    margin-left: 10px;
  }
}
.list-scroll {
  height: calc(100vh - 90px);
  overflow: hidden;
  .list-item {
    width: 100vw;
    height: 50px;
    display: flex;
    align-items: center;
    padding: 10px 0;
  }
  .list-num {
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
  .list-text {
    flex: 1;
    width: 0;
    line-height: 20px;
  }
  .list-name {
    font-size: 18px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .list-ar {
    font-size: 14px;
    color: #999;
  }
  .list-part {
    flex: 0 0 60px;
    text-align: center;
    img {
      width: 25px;
      height: 25px;
    }
  }
  .list-loading {
    text-align: center;
    font-size: 10px;
  }
}
</style>