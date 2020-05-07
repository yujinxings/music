<template>
  <div class="my">
    <div class="my-head">
      <img v-if="isLogin" src="../assets/img/asj.png" />
      <img v-else src="../assets/img/avn.png" />
      <p v-if="isLogin">{{userName}}</p>
      <p v-else>登录收藏喜欢的音乐吧</p>
      <div @click="setLogin">{{!isLogin?'立即登录':'退出登录'}}</div>
    </div>
    <p class="collect-title">我的收藏</p>
    <div class="my-content" ref="collectScroll">
      <div class="content-unlist" v-if="!collect&&isLogin">亲,您没有收藏的歌曲哦</div>
      <div class="content-unlist" v-if="!isLogin">亲,您没有登录哦,登录后可以收藏歌曲</div>
      <div class="content-list" v-if="isLogin">
        <div class="content-item" v-for="(list,i) in collect" :key="list.id">
          <div class="content-num" :class="{active:list.id==currentSong.id}">{{i+1}}</div>
          <div class="content-details" @click="setpaly([list,collect])">
            <div class="content-img">
              <img :src="list.imgUrl" />
            </div>
            <p class="details-title">{{list.name}}</p>
          </div>
          <div class="content-look">
            <img src="../assets/img/bor.png" @click="showParit([list,collect])" />
          </div>
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
  SET_ISDETAIL,
  SET_ISLOGIN
} from "../store/mutation-types";
export default {
  data() {
    return {
      userName: "",
      collect: null
    };
  },
  computed: {
    ...mapState(["isLogin", "currentSong", "user", "isLookCollect"])
  },
  watch: {
    isLookCollect(val, oldval) {
      if (val != oldval) {
        this.getLocalStorage();
      }
    }
  },
  methods: {
    ...mapMutations({
      setLookParitculars: SET_LOOKPARTICULARS,
      setIsLookParitculars: SET_ISLOOKPARTICULARS,
      setIsDetail: SET_ISDETAIL,
      setIsLogin: SET_ISLOGIN
    }),
    ...mapActions(["setCurren"]),
    //登录或退出登录
    setLogin() {
      if (this.isLogin) {
        this.setIsLogin(false)
        window.WebIM.conn.close();
      } else {
        this.$router.push({ name: "Login" });
      }
    },
    //显示歌曲详情
    showParit(arr) {
      this.setLookParitculars(arr);
      this.setIsLookParitculars(true);
    },
    //设置播放
    setpaly(arr) {
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
    //获取用户名
    getUser(username) {
      let { token, apiUrl, orgName, appName } = window.WebIM.conn;
      this.axios
        .get(`${apiUrl}/${orgName}/${appName}/users/${username}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          }
        })
        .then(res => {
          this.userName = res.data.entities[0].nickname;
          console.log(res);
        });
    },
    //获取本地缓存
    getLocalStorage() {
      if (this.isLogin == true) {
        let result = window.localStorage.getItem(`user_${this.user}`);
        result = JSON.parse(result);
        console.log(result);
        this.getUser(result.account);
        this.collect = result.collect;
        this.$nextTick(() => {
          this.initalScroll();
        });
      }
    },
    initalScroll() {
      //创建滚动
      if (!this.collectScroll) {
        this.collectScroll = new BScroll(this.$refs.collectScroll, {
          click: true
        });
      } else {
        this.collectScroll.refresh();
      }
    },
    destroyScroll() {
      if (this.collectScroll) {
        this.collectScroll.destroy();
        this.collectScroll = null;
      }
    }
  },
  activated() {
    //如果已登录 获取本地缓存收藏的歌曲
    this.getLocalStorage();
  },
  beforeDestroy() {
    this.destroyScroll();
  }
};
</script>

<style lang="less" scoped>
.my {
  width: 100vw;
  height: calc(100vh - 90px);
}
.my-head {
  height: 70px;
  width: 100vw;
  display: flex;
  align-items: center;
  padding: 0 30px;
  box-sizing: border-box;
  img {
    flex: 0 0 50px;
    height: 50px;
    border-radius: 50%;
    margin-right: 15px;
  }
  p {
    flex: 1;
    font-size: 14px;
  }
  div {
    flex: 0 0 54px;
    text-align: center;
    font-size: 13px;
    border: 1px solid #666;
    padding: 4px 5px;
    border-radius: 12px;
  }
}
.collect-title {
  font-size: 18px;
  padding: 10px 20px 20px;
}
.my-content {
  padding: 0 20px;
  height: calc(100vh - 218px);
  border-radius: 20px 20px 0 0;
  box-shadow: 0px 0px 5px rgba(53, 53, 53, 0.418);
  overflow: hidden;
  .content-unlist {
    height: 40px;
    line-height: 40px;
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
}
</style>