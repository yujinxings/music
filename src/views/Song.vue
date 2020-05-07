<template>
  <div class="song">
    <div class="song-list" ref="songScroll">
      <ul>
        <li v-for="list in songList" :key="list.id" @click="setSong(list.id)">
          <div class="list-item-img">
            <img :src="list.imgUrl" />
          </div>
          <div class="list-item-name">{{list.name}}</div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import BScroll from "better-scroll";
import { mapState, mapMutations } from "vuex";
import { SET_SONGDETAILS } from "../store/mutation-types";
export default {
  data() {
    return {
      songList: []
    };
  },
  computed: {
    ...mapState(["songDetails"])
  },
  methods: {
    ...mapMutations({
      setSongDetails: SET_SONGDETAILS
    }),
    initalScroll() {
      //创建滚动
      if (!this.songScroll) {
        this.songScroll = new BScroll(this.$refs.songScroll, {
          click: true
        });
      } else {
        this.songScroll.refresh();
      }
    },
    destroyScroll() {
      if (this.songScroll) {
        this.songScroll.destroy();
        this.songScroll = null;
      }
    },
    //点击歌单获取歌单数据
    setSong(id) {
      this.axios.get(`/mus/?type=playlist&id=${id}`,{
        timeout: 5000
      }).then(res=>{
        console.log(res.data);
        this.setSongDetails(res.data.playlist)
        this.$router.push({path:"/songdetails"})
      }).catch(err => {
        console.log(err, '请求超时');
      })
    }
  },
  components: {
    // SongDetails
  },
  mounted() {
    this.axios.get("/api/song", { timeout: 5000 }).then(res => {
      this.songList = res.data.data;
    });
    this.$nextTick(() => {
      this.initalScroll();
    });
  },
  beforeDestroy() {
    this.destroyScroll();
  }
};
</script>

<style lang="less" scoped>
.song {
  width: 100vw;
  box-sizing: border-box;
  padding: 20px 20px;
}

.song-list {
  position: relative;
  width: 100%;
  height: calc(100vh - 120px);
  overflow: hidden;
  // .list-title {
  //   position: absolute;
  //   left: 50%;
  //   top: -40px;
  //   font-size: 20px;
  //   transform: translateX(-50%);
  // }
  ul {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;

    li {
      width: 40vw;
      margin-bottom: 20px;
      box-shadow: 1px 2px 9px rgba(179, 179, 179, 0.24);
      border-radius: 8px;
      overflow: hidden;
    }
  }
  .list-item-img {
    width: 40vw;
    height: 40vw;
    img {
      width: 40vw;
      height: 40vw;
    }
  }
  .list-item-name {
    height: 40px;
    margin: 10px;
    line-height: 20px;
    text-align: left;
    overflow: hidden;
    text-overflow: ellipsis;
    line-clamp: 2;
  }
}
</style>