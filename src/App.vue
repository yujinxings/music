<template>
  <div id="app">
    <div class="nav">
      <router-link tag="div" to="recommend">
        <span>每日推荐</span>
      </router-link>
      <router-link tag="div" to="/">
        <span>歌单</span>
      </router-link>
      <router-link tag="div" to="singer">
        <span>歌手</span>
      </router-link>
      <router-link tag="div" to="my">
        <span>我的</span>
      </router-link>
      <router-link tag="div" to="search" class="search">
        <img src="./assets/img/akl.png" alt="">
      </router-link>
    </div>
    <MinPaly />
    <keep-alive>
      <router-view />
    </keep-alive>
  </div>
</template>

<script>
import MinPaly from "./components/MinPaly";
export default {
  components: {
    MinPaly
  },
  mounted() {}
};
</script>

<style lang="less" scoped>

.nav {
  display: flex;
  margin-bottom: 10px;
  div {
    flex: 1;
    height: 40px;
    line-height: 40px;
    text-align: center;
    &.router-link-exact-active {
      color: #dd001b;
      span {
        border-bottom: 2px solid #dd001b;
      }
    }
    span {
      display: inline-block;
      height: 38px;
    }
  }
  .search{
    flex: 0 0 40px;
    padding-top: 2px;
    img{
      width: 35px ;
      height: 35px;
    }
  }
}

</style>
<style lang="less">
#app {
  font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB",
    "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
}
.part-message.el-message {
  min-width: 100px;
  padding: 8px 9px 8px 0;
  background-color: rgba(255, 255, 255, 0.9);
  .el-message__content {
    font-size: 14px;
  }
  .el-message__icon {
    font-size: 0;
  }
}
</style>