<template>
  <!-- ref/children绑定子组件用来获取信息  相当于加强版的id/class -->
  <div class="wrapper" ref="wrapper">
    <div class="content">
      <slot></slot>
    </div>
  </div>
</template>

<script scoped>
import BScroll from "better-scroll";
import Pullup from "@better-scroll/pull-up";
// import ObserveImage from '@better-scroll/observe-image'

//注册插件
BScroll.use(Pullup);

export default {
  name: "Scroll",
  props: {
    probeType: {
      type: Number,
      default: 0,
    },
    pullUpLoad: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      scroll: null,
    };
  },
  mounted() {
    //1.创建BScroll对象
    //observeDOM: true,:  新版本如果滚动不成功就需要加上这句话
    this.scroll = new BScroll(this.$refs.wrapper, {
      observeDOM: true,
      click: true,
      probeType: this.probeType,
      pullUpLoad: this.pullUpLoad, //上拉加载事件
      observeImage: true,
    });

    //2.监听滚动的位置
    //当时间为2或3时才进行监听
    if (this.probeType == 2 || this.probeType == 3) {
      this.scroll.on("scroll", (position) => {
        // console.log(position);
        this.$emit("scroll", position);
      });
    }

    //重新调用新的高度
    // this.scroll.refresh();

    //3.监听上拉事件
    //当事件为true的时候才进行下拉
    if (this.pullUpLoad) {
      //on是监听滑动事件
      this.scroll.on("pullingUp", () => {
        //返回事件
        this.$emit('pullingUp')
      });
    }
  },
  methods: {
    //封装一个回到之前位置的方法
    scrollTo(x, y, time = 500) {
      this.scroll && this.scroll.scrollTo && this.scroll.scrollTo(x, y, time);
    },
    finishPullUp() {
      //finishPullUp:结束上拉加载行为。  告诉 BetterScroll 准备好下一次的 pullingUp 钩子。  
      this.scroll && this.scroll.finishPullUp()
    },
    refresh() {
      this.scroll && this.scroll.refresh()
    },
    getScrollY() {
      return this.scroll ? this.scroll.y : 0
    }
  },
};
</script>

<style>
</style>