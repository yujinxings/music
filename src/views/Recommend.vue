<template>
  <div class="recom" ref="recomScroll">
    <div class="scroll">
      <div class="recom-header"></div>
      <div class="recom-content">
        <div class="content-item" v-for="(list,i) in recommendList" :key="list.id">
          <div class="content-num" :class="{active:list.id==currentSong.id}">{{i+1}}</div>
          <div class="content-details" @click="setpaly([list,recommendList])">
            <div class="content-img">
              <img :src="list.imgUrl" />
            </div>
            <p class="details-title">{{list.name}}</p>
          </div>
          <div class="content-look">
            <img src="../assets/img/bor.png" @click="showParit([list,recommendList])" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BScroll from "better-scroll";
import { mapState, mapMutations, mapActions } from "vuex";

import {
  ADD_RECOMMEND,
  SET_LOOKPARTICULARS,
  SET_ISLOOKPARTICULARS,
  SET_ISDETAIL
} from "../store/mutation-types";
export default {
  data() {
    return {
      loading: false
    };
  },
  computed: {
    ...mapState(["recommendList", "currentSong"])
  },
  methods: {
    ...mapMutations({
      addRecommend: ADD_RECOMMEND,
      setLookParitculars: SET_LOOKPARTICULARS,
      setIsLookParitculars: SET_ISLOOKPARTICULARS,
      setIsDetail:SET_ISDETAIL
    }),
    ...mapActions(["setCurren"]),
    //设置播放
    setpaly(arr) {
      if (arr[0].id == this.currentSong.id) {
        this.setIsDetail(true)
        return
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
    showParit(arr) {
      this.setLookParitculars(arr);
      this.setIsLookParitculars(true);
    },
    initalScroll() {
      //创建滚动
      if (!this.recomScroller) {
        this.recomScroller = new BScroll(this.$refs.recomScroll, {
          click: true
        });
      } else {
        this.recomScroller.refresh();
      }
    },
    destroyScroll() {
      if (this.recomScroller) {
        this.recomScroller.destroy();
        this.recomScroller = null;
      }
    }
  },
  mounted() {
    this.loading = true; // 表示正在请求
    let { CancelToken } = this.axios;

    this.axios
      .get("/api/recommend", {
        timeout: 5000,
        cancelToken: new CancelToken(c => {
          // 函数接收一个 cancel 函数作为参数
          this.axiosCancel = c;
        })
      })
      .then(res => {
        this.loading = false;
        this.addRecommend(res.data.data);
        this.$nextTick(() => {
          this.initalScroll();
        });
      })
      .catch(err => {
        console.log(err);
        this.loading = false;
      });
  },
  beforeDestroy() {
    this.destroyScroll();
    if (this.loading) {
      this.axiosCancel();
    }
  }
};
</script>

<style lang="less" scoped>
.recom {
  box-sizing: border-box;
  width: 100vw;
  height: calc(100vh - 100px);
  padding: 0 20px;
  overflow: hidden;
}

.content-item {
  display: flex;
  align-items: center;
  padding: 10px 0;
}
.content-num {
  width: 25px;
  padding-right: 5px;
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

.content-details {
  flex: 1;
  display: flex;
  align-items: center;
  .content-img {
    flex: 0 0 50px;
    height: 50px;
    img {
      width: 50px;
      height: 50px;
    }
  }
  .details-title {
    flex: 1;
    font-style: 16px;
    padding-left: 15px;
    color: #333;
  }
  .details-singer {
    font-size: 12px;
    color: #888;
  }
}

.content-look {
  flex: 0 0 20px;
  margin-left: 10px;
  img {
    width: 24px;
    height: 24px;
  }
}
</style>