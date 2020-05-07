<template>
  <div class="singer">
    
    <nut-elevator
      :dataArray="dataList"
      :showIndicator="true"
      :navHeight="40"
      :otherHeight="60"
      :initIndex="0"
      :hiddenTime="500"
      @clickList="clickList"
    ></nut-elevator>
    <router-view></router-view>
  </div>
</template>

<script>
import pinyin from "pinyin";
import { SET_SINGER } from "../store/mutation-types";
import { mapMutations } from "vuex";
export default {
  data() {
    return {
      dataList: [
        {
          title: "A",
          list: []
        }
      ]
    };
  },
  methods: {
    ...mapMutations({
      setSinger: SET_SINGER
    }),
    clickList(item) {
      this.setSinger(item);
      this.$router.push({ name: "SingerDetails" });
    }
  },
  mounted() {
    this.dataList[0].list.push({ id: "1", name: "中国" });

    this.axios
      .get(`/api/singer`, {
        timeout: 5000
      })
      .then(res => {
        //对获取到的数据进行首字母排序 添加到nut ui库的电梯楼层数据中
        let data = res.data.data; //请求的数据
        let letter = []; //当前数据拥有的拼音首字母
        console.log(data);

        data.find((item, i) => {
          //利用pinyin插件给原数组添加拼音首字母
          let spell = pinyin(item.name, {
            style: pinyin.STYLE_FIRST_LETTER
          })[0][0][0].toUpperCase();
          data[i].initial = spell;
          letter.push(spell);
        });
        letter = Array.from(new Set(letter)).sort();
        this.dataList = [];
        letter.find(i => {
          this.dataList.push({ title: i, list: [] });
        });
        this.dataList.find((item, i) => {
          data = data.filter(dataItem => {
            if (dataItem.initial == item.title) {
              this.dataList[i].list.push({
                id: dataItem.id,
                name: dataItem.name,
                artistImgUrl: dataItem.artistImgUrl
              });
              return false;
            }
            return true;
          });
        });
      });
  }
};
</script>

<style lang="less" scoped>
.singer {
  width: 100vw;
  height: 100vh;
}

</style>