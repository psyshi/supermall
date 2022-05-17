<template>
  <div class="goods-item" @click="itemClick">
    <!-- @load="imageLoad"监听当前图片的加载 -->
    <!-- <img :src="showImage" alt="" @load="imageLoad" /> -->
    <img v-lazy="showImage" alt="" @load="imageLoad" :key="showImage"/>
    <div class="goods-info">
      <p>{{ goodsItem.title }}</p>
      <span class="price">{{ goodsItem.price }}</span>
      <span class="collect">{{ goodsItem.cfav }}</span>
    </div>
  </div>
</template>

<script>
import { setmitt } from "components/common/mitt/mitt.js";

export default {
  name: "goodsListItem",
  props: {
    goodsItem: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  computed: {
    showImage() {
      return (
        (this.goodsItem.show && this.goodsItem.show.img) || this.goodsItem.image
      );
    },
  },
  methods: {
    imageLoad() {
      //原生的图片加载完成方式
      // console.log(1111111);
      //this.$bus.emit()：往vuex中发射一个事件
      // this.$bus.$emit('itemImageLoad')

      //运用第三方mitt发送事件
      if (this.$route.path.indexOf("home") != -1) {
        setmitt("homeItemImageLoad");
      } else if (this.$route.path.indexOf("detail") != -1) {
        setmitt("detailItemImageLoad");
      }
    },
    itemClick() {
      //通过路由跳转到详情页
      this.$router.push("/detail/" + this.goodsItem.iid);
      // this.$router.push({
      //   path: '/detail',
      //   query: {
      //     iid: this.goodsItem.iid
      //   }
      // })
    },
  },
};
</script>

<style scoped>
.goods-item {
  padding-bottom: 40px;
  position: relative;

  width: 48%;
}

.goods-item img {
  width: 100%;
  border-radius: 5px;
}

.goods-info {
  font-size: 12px;
  position: absolute;
  bottom: 5px;
  left: 0;
  right: 0;
  overflow: hidden;
  text-align: center;
}

.goods-info p {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-bottom: 3px;
}

.goods-info .price {
  color: var(--color-high-text);
  margin-right: 20px;
}

.goods-info .collect {
  position: relative;
}

.goods-info .collect::before {
  content: "";
  position: absolute;
  left: -15px;
  top: -1px;
  width: 14px;
  height: 14px;
  background: url("~assets/img/common/collect.svg") 0 0/14px 14px;
}
</style>