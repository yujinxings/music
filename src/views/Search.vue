<template>
  <div class="search">
    <div class="search-bar">
      <nut-searchbar
        placeText="请输入歌名"
        v-model="text"
        @blur="blurFun"
        :hasSearchButton="false"
        @input="inputFun"
      ></nut-searchbar>
      <div class="bar-list" v-show="isSearch">
        <ul>
          <li
            v-for="item in searchSongs"
            :key="item.id"
            @click="clickSearch(item.name)"
          >{{item.name}}</li>
          <li v-if="isSearchNull">暂无该歌曲</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      text: "",
      searchSongs: null, //搜索结果前十条
      isSearchNull: false, //当搜索不到时显示暂无歌曲
      isSearch: false //显示隐藏搜索结果
    };
  },
  methods: {
    blurFun() {
      setTimeout(() => {
        this.isSearch = false;
      }, 100);
    },
    inputFun() {
      clearTimeout(this.inputTimer);
      if (this.text.length == 0) {
        this.isSearch = false;
      }
      if (this.text != "") {
        this.inputTimer = setTimeout(() => {
          this.axios
            .post(`/search/?keyword=${this.text}&limit=10`)
            .then(res => {
              this.isSearchNull = false;
              this.isSearch = true;
              this.searchSongs = res.data.data.songs;
            })
            .catch(err => {
              console.log(err, "请求超时");
              this.isSearchNull = true;
            });
        }, 500);
      } else {
        this.isSearchNull = false;
      }
    },
    clickSearch(name) {
      this.$router.push({ path: `/searchlist`, query: { name: name } });
    }
  },
  activated(){
    this.text=""
  },
  beforeDestroy() {
    clearTimeout(this.inputTimer);
  }
};
</script>

<style lang="less" scoped>
.search {
  width: 100vw;
  height: calc(100vh - 90px);
  background-color: #fff;
  box-sizing: border-box;
  padding: 5px 20px 0;
  overflow: hidden;
}
.search-bar {
  .bar-list {
    width: 100%;
    background-color: #fff;
    box-shadow: 1px 1px 5px rgba(182, 182, 182, 0.226);
    margin-top: 10px;
    ul {
      max-height: 500px;
      overflow: hidden;
    }
    li {
      height: 50px;
      line-height: 50px;
      border-bottom: 1px solid rgba(233, 233, 233, 0.226);
      padding: 0px 20px;
      color: rgba(95, 95, 95, 0.582);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
}
/deep/.nut-searchbar .search-input {
  margin-right: 0px;
}
</style>