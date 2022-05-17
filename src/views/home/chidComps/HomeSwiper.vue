<template>
  <swiper>
    <swiper-item v-for="(item, index) in banners" :key="index">
      <a :href="item.link">
        <img :src="item.image" alt="" @load="imageLoad" />
      </a>
    </swiper-item>
  </swiper>
</template>

<script>
import { Swiper, SwiperItem } from "components/common/swiper";

export default {
  name: "HomeSwiper",
  props: {
    banners: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      isLoad: false,
    };
  },
  components: {
    Swiper,
    SwiperItem,
  },
  //@load="imageLoad": 监听图片什么时候加载完成
  methods: {
    imageLoad() {
      if (!this.isLoad) this.$emit("swiperImageLoad");
      this.isLoad = true;
    },
  },
};
</script>

<style scoped>
img {
  width: 100%;
}
</style>