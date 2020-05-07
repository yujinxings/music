<template>
  <transition name="part">
    <div class="part" v-if="isLookParticulars">
      <div class="part-mask" @click="setIsLookParticulars(false)"></div>
      <transition name="mask">
        <div class="part-content" v-show="isLookParticulars">
          <div class="content-hade">
            <img :src="isLookParticulars>0?lookParticulars[0].imgUrl:''" />
            <div class="content-hade-text">
              <p class="text-title">{{isLookParticulars>0?lookParticulars[0].name:''}}</p>
              <p class="text-singer">{{isLookParticulars>0?lookParticulars[0].singer:''}}</p>
            </div>
          </div>
          <div class="content-operation">
            <ul>
              <li @click="clickNextPlay('已添加到下一首播放')">
                <img src="../assets/img/bmp.png" />
                <p class="operation-text">下一首播放</p>
              </li>
              <li @click="addCollect">
                <img src="../assets/img/bmf.png" />
                <p class="operation-text">{{isCollect?'取消收藏':'收藏'}}</p>
              </li>
              <li>
                <img src="../assets/img/bmd.png" />
                <p class="operation-text">下载</p>
              </li>
              <li>
                <img src="../assets/img/bma.png" />
                <p class="operation-text">评论</p>
              </li>
              <li>
                <img src="../assets/img/bmj.png" />
                <p class="operation-text">分享</p>
              </li>
              <li @click="clickSinger">
                <img src="../assets/img/bmx.png" />
                <p
                  v-if="$route.name=='Recommend' || $route.name=='My'"
                  class="operation-text"
                >歌手:{{isLookParticulars?lookParticulars[0].singer:""}}</p>
                <p
                  v-else-if="$route.name=='SearchList'"
                  class="operation-text"
                >歌手:{{isLookParticulars?lookParticulars[0].artists[0].name:""}}</p>
                <p
                  v-else
                  class="operation-text"
                >歌手:{{isLookParticulars?lookParticulars[0].ar[0].name:""}}</p>
              </li>
            </ul>
          </div>
          <div class="content-hint"></div>
        </div>
      </transition>
    </div>
  </transition>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import {
  SET_ISLOOKPARTICULARS,
  SET_ADVANCEPLAY,
  SET_SINGER,
  SET_ISLOOKCOLLECT
} from "../store/mutation-types";
export default {
  data() {
    return {
      isCollect: false
    };
  },
  computed: {
    ...mapState(["lookParticulars", "isLookParticulars", "isLogin", "user","isLookCollect"])
  },
  watch: {
    //通过isLookParticulars的改变去判断该歌曲是否已经收藏
    isLookParticulars(val, oldVal) {
      this.isCollect = false;
      if (val != oldVal && val == true && this.isLogin) {
        console.log("我只写了", this.lookParticulars);

        let result = window.localStorage.getItem(`user_${this.user}`);
        result = JSON.parse(result);
        console.log(result);
        result.collect.find(item => {
          if (item.id == this.lookParticulars[0].id) {
            this.isCollect = true;
          }
        });
      }
    }
  },
  methods: {
    ...mapMutations({
      setIsLookParticulars: SET_ISLOOKPARTICULARS,
      setIsLookCollect: SET_ISLOOKCOLLECT,
      setAdvancePlay: SET_ADVANCEPLAY,
      setSinger: SET_SINGER
    }),
    //提示框
    message(text) {
      this.$message.closeAll();
      this.$message({
        message: text,
        center: true,
        duration: 2000,
        customClass: "part-message",
        offset: 100
      });
    },
    //设置下一首播放
    clickNextPlay(text) {
      this.setAdvancePlay(this.lookParticulars);
      this.message(text);
      this.setIsLookParticulars(false);
    },
    //收藏
    addCollect() {
      let result = window.localStorage.getItem(`user_${this.user}`);
      result = JSON.parse(result);
      let imgUrl = this.lookParticulars[0].imgUrl;
      let name = this.lookParticulars[0].name;
      let singer =
        this.lookParticulars[0].singer || this.lookParticulars[0].ar[0].name;
      let id = this.lookParticulars[0].id;
      if (this.isLogin && !this.isCollect) {
        result = {
          ...result,
          collect: [...result.collect, { id, name, imgUrl, singer }]
        };
        window.localStorage.setItem(
          `user_${this.user}`,
          JSON.stringify(result)
        );
        this.setIsLookParticulars(false);
        this.message("收藏成功");
      } else if (this.isCollect) {
        let collect = result.collect.filter(r => r.id != id);
        result = {
          ...result,
          collect
        };
        window.localStorage.setItem(
          `user_${this.user}`,
          JSON.stringify(result)
        );
        this.setIsLookParticulars(false);
        if (this.$route.name == "My") {
          this.setIsLookCollect(!this.isLookCollect);
        }
        this.message("取消收藏成功");
      } else {
        this.message("登录后才可以收藏哦");
        this.setIsLookParticulars(false);
      }
    },
    //转跳歌手详情页
    clickSinger() {
      if (this.lookParticulars[0].singerId) {
        this.setSinger({
          id: this.lookParticulars[0].singerId,
          name: this.lookParticulars[0].singer
        });
        this.setIsLookParticulars(false);
        this.$router.push({ name: "SingerDetails" });
      }
      if (this.lookParticulars[0].dt) {
        this.setSinger({
          id: this.lookParticulars[0].ar[0].id,
          name: this.lookParticulars[0].ar[0].name
        });
        this.setIsLookParticulars(false);
        this.$router.push({ name: "SingerDetails" });
      }
    }
  }
};
</script>

<style lang="less" scoped>
.part {
  position: fixed;
  left: 0;
  top: 0;
  height: 100vh;
  width: 100vw;
  &.part-enter,
  &.part-leave-to {
    opacity: 0;
  }
  &.part-enter-active,
  &.part-leave-active {
    transition: all 0.5s linear;
  }
  &.part-leave,
  &.part-enter-to {
    opacity: 1;
  }
}
.part-mask {
  position: absolute;
  left: 0;
  top: 0;
  height: 100vh;
  width: 100vw;
  background: rgba(2, 2, 2, 0.4);
}
.part-content {
  box-sizing: border-box;
  position: absolute;
  left: 0;
  bottom: 20px;
  width: calc(100vw - 40px);
  background-color: #fff;
  border-radius: 20px;
  padding: 10px 0px 0px;
  margin: 0 20px;
  &.mask-enter,
  &.mask-leave-to {
    transform: translateY(100%);
    opacity: 0;
  }
  &.mask-enter-active,
  &.mask-leave-active {
    transition: all 0.2s linear;
  }
  &.mask-leave,
  &.mask-enter-to {
    transform: translateY(0);
    opacity: 1;
  }
  .content-hade {
    display: flex;
    align-items: center;
    padding: 20px;
    img {
      flex: 0 0 50px;
      width: 50px;
      height: 50px;
    }
    .content-hade-text {
      padding-left: 10px;
    }
    .text-title {
      font-size: 18px;
    }
    .text-singer {
      font-size: 14px;
      color: #999;
      padding-top: 5px;
    }
  }
  .content-operation {
    li {
      display: flex;
      align-items: center;
      border-top: 1px solid rgba(160, 162, 163, 0.2);
      padding: 0 10px;
      &:last-child {
        border-bottom: 1px solid rgba(160, 162, 163, 0.2);
      }
      img {
        flex: 0 0 40px;
        height: 40px;
      }
      .operation-text {
        flex: 1;
        font-size: 14px;
      }
    }
  }
}
</style>
