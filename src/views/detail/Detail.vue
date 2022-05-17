<template>
  <div id="detail">
    <detail-nav-bar class="detail-nav" @titleClick="titleClick" ref="nav" />
    <scroll
      class="content"
      ref="scroll"
      :probe-type="3"
      @scroll="contentScroll"
    >
      <detail-swiper :top-images="topImages" />
      <detail-base-info :goods="goods" />
      <detail-shop-info :shop="shop" />
      <detail-goods-info :detail-info="detailInfo" @imageLoad="imageLoad" />
      <detail-param-info ref="params" :param-info="paramInfo" />
      <detail-comment-info ref="comment" :commentInfo="commentInfo" />
      <goods-list ref="recommend" :goods="recommends" />
    </scroll>
    <!-- 回到顶部按钮 -->
    <back-top @click.native="backClick" v-show="BackTopscrollTo" />
    <!-- 底部 -->
    <detail-bottom-bar @addCart="addToCart" />

    <!-- 太麻烦不需要了 -->
    <toast :message="message" :isShow="isShow"/>
  </div>
</template>

<script>
import DetailNavBar from "./childComps/DetailNavBar";
import DetailSwiper from "./childComps/DetailSwiper";
import DetailBaseInfo from "./childComps/DetailBaseInfo";
import DetailShopInfo from "./childComps/DetailShopInfo";
import DetailGoodsInfo from "./childComps/DetailGoodsInfo";
import DetailParamInfo from "./childComps/DetailParamInfo";
import DetailCommentInfo from "./childComps/DetailCommentInfo";
import DetailBottomBar from "./childComps/DetailBottomBar";
import BackTop from "components/content/backTop/BackTop";

import Scroll from "components/common/scroll/Scroll";
import GoodsList from "components/content/goods/GoodsList";

import {
  getDetail,
  getRecommend,
  Goods,
  Shop,
  GoodsParam,
} from "network/detail";
import { getmittvalue } from "components/common/mitt/mitt.js";
import { debounce } from "common/utils";
import { backTopMinxin } from "common/mixin";
import { mapActions } from "vuex";

import Toast from 'components/common/toast/Toast.vue'

export default {
  name: "Detail",
  components: {
    DetailNavBar,
    DetailSwiper,
    DetailBaseInfo,
    DetailShopInfo,
    DetailGoodsInfo,
    DetailParamInfo,
    DetailCommentInfo,
    DetailBottomBar,
    BackTop,
    Scroll,
    GoodsList,
    Toast
  },
  mixins: [backTopMinxin],
  data() {
    return {
      iid: null,
      topImages: [],
      goods: {},
      shop: {},
      detailInfo: {},
      paramInfo: {},
      commentInfo: {},
      recommends: [],
      themeTopYs: [],
      currentIndex: 0,
      message: '',
      isShow: false
    };
  },
  //activated   created
  created() {
    // 1.保存传入的iid
    this.iid = this.$route.params.iid;

    // 2.根据iid请求详情数据
    getDetail(this.iid).then((res) => {
      // 1.获取顶部的图片轮播数据
      const data = res.result;
      this.topImages = data.itemInfo.topImages;

      // 2.获取商品信息
      this.goods = new Goods(
        data.itemInfo,
        data.columns,
        data.shopInfo.services
      );

      // 3.创建店铺信息的对象
      this.shop = new Shop(data.shopInfo);

      // 4.保存商品的详情数据
      this.detailInfo = data.detailInfo;

      // 5.获取参数的信息
      this.paramInfo = new GoodsParam(
        data.itemParams.info,
        data.itemParams.rule
      );

      //6.获取评论的信息
      if (data.rate.cRate != 0) {
        this.commentInfo = data.rate.list[0];
      }

      // //等所有东西都渲染成功后才进行调用
      // this.$nextTick(() => {
      //   //根据最新的数据，对应的DOM是已经渲染出来了
      //   //但是图片依然是没有加载完成（目前获取到offsetTop不包含其中的图片的）
      //   //offsetTop值不对的时候，一般都是因为图片的问题
      //   this.themeTopYs = [];

      //   this.themeTopYs.push(0);
      //   this.themeTopYs.push(this.$refs.params.$el.offsetTop-44);
      //   this.themeTopYs.push(this.$refs.comment.$el.offsetTop-44);
      //   this.themeTopYs.push(this.$refs.recommend.$el.offsetTop-44);

      //   console.log(this.themeTopYs);
      // });
    });

    //3.请求推荐数据
    getRecommend().then((res) => {
      this.recommends = res.data.list;
    });
  },
  activated() {},
  mounted() {
    //1.图片加载完成的事件监听
    const refresh = debounce(
      this.$refs.scroll && this.$refs.scroll.refresh,
      500
    );
    //运用第三方mitt接受事件
    getmittvalue("detailItemImageLoad", () => {
      //重新调用新的高度
      refresh();
    });
  },
  methods: {
    ...mapActions(["addCart"]),
    imageLoad() {
      this.$refs.scroll.refresh();
      // this.reload();

      this.themeTopYs = [];

      this.themeTopYs.push(0);
      this.themeTopYs.push(this.$refs.params.$el.offsetTop - 44);
      this.themeTopYs.push(this.$refs.comment.$el.offsetTop - 44);
      this.themeTopYs.push(this.$refs.recommend.$el.offsetTop - 44);
      this.themeTopYs.push(Number.MAX_VALUE);
    },
    //点击导航上的参数  评论跳转
    titleClick(index) {
      this.$refs.scroll.scrollTo(0, -this.themeTopYs[index], 100);
    },
    //看到评论的时候评论变红 依次类推
    contentScroll(position) {
      //1.获取y值
      const positionY = -position.y;

      //positionY和主题中值进行对比
      let length = this.themeTopYs.length;
      for (let i = 0; i < length - 1; i++) {
        //把str类型的转化成数字类型
        // parseInt(i);
        //注意哈下面必须是三个===
        // if (
        //   this.currentIndex !== i &&
        //   ((i < length - 1 &&
        //     positionY >= this.themeTopYs[i] &&
        //     positionY < this.themeTopYs[i + 1]) ||
        //     (i === length - 1 && positionY >= this.themeTopYs[i]))
        // ) {
        //   this.currentIndex = i;
        //   console.log(this.currentIndex);
        //   this.$refs.nav.currentIndex = this.currentIndex
        // }

        if (
          this.currentIndex !== i &&
          positionY >= this.themeTopYs[i] &&
          positionY < this.themeTopYs[i + 1]
        ) {
          this.currentIndex = i;
          this.$refs.nav.currentIndex = this.currentIndex;
        }
      }

      // //1.判断BackTop是否显示
      // this.isShowBackTop = -position.y > 1000
      this.isShowBackTopCC(position);
    },
    addToCart() {
      //1.获取购物车需要展示的信息
      const product = {};
      product.image = this.topImages[0];
      product.title = this.goods.title;
      product.desc = this.goods.desc;
      product.price = this.goods.realPrice;
      product.iid = this.iid;

      //2.将商品添加到购物车中  (1.Promise 2.mapActions)
      // this.$store.cartList.push(product)
      //调用mutations方法，因为想让它经过生命周期所以不这样调用
      // this.$store.commit('addCart', product)

      //通过vuex导入这个方法
      this.addCart(product).then((res) => {
        this.isShow = true;
        this.message = res;
        console.log(res);

        setTimeout(() => {
          this.isShow = false;
          this.message = '';
        }, 1500)

        // 把这个一会消失的东东封装到一个文件中
        // this.$toast.show(res, 1500)
        // 获取全局对象`
        // console.log(this.$toast.show());
      });

      //直接调用这个方法
      // this.$store.dispatch('addCart', product).then(res => {
      //   console.log(res);
      // })
    },
  },
};
</script>

<style scoped>
#detail {
  position: relative;
  z-index: 9;
  background-color: #fff;
  height: 100vh;
}

.detail-nav {
  position: relative;
  z-index: 9;
  background-color: #fff;
}

.content {
  height: calc(100% - 44px - 55px);
}
</style>
