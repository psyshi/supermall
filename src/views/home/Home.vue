<template>
  <div id="home" class="wrapper">
    <nav-bar class="home-nav">
      <template v-slot:center>
        <div>购物街</div>
      </template>
    </nav-bar>
    <!-- 特殊的设置流行界面 -->
    <tab-control
      :titles="['流行', '新款', '精品']"
      @tabClick="tabClick"
      ref="tabControl1"
      class="tab-control"
      v-show="isTabFixed"
    />
    <!-- 使用第三方Scroll来实现滚动 -->
    <scroll
      class="content"
      ref="scroll"
      :probe-type="3"
      @scroll="contentScroll"
      :pull-up-load="true"
      @pullingUp="loadMore"
    >
      <!-- 轮播图homeswiper -->
      <home-swiper :banners="banners" @swiperImageLoad="swiperImageLoad" />
      <home-recommend-view :recommends="recommends" />
      <!-- 本周流行 -->
      <feature-view></feature-view>
      <!-- 选项卡 -->
      <tab-control
        class="tab-control"
        :titles="['流行', '新款', '精品']"
        @tabClick="tabClick"
        ref="tabControl2"
      />
      <!-- 具体的展示内容 -->
      <goods-list :goods="showGoods" />
    </scroll>

    <!-- 回到最上头的点击按钮   组件不能直接监听点击的要是想监听需要加上.native -->
    <back-top @click.native="backClick" v-show="isShowBackTop" />
  </div>
</template>

<script>
import HomeSwiper from "./chidComps/HomeSwiper.vue";
import HomeRecommendView from "./chidComps/HomeRecommendView";
import FeatureView from "./chidComps/FeatureView";

import NavBar from "components/common/navbar/NavBar";
import TabControl from "components/content/tabControl/TabControl";
import GoodsList from "components/content/goods/GoodsList";
import Scroll from "components/common/scroll/Scroll";
import BackTop from "components/content/backTop/BackTop";

import { getHomeMultidata, getHomeGoods } from "../../network/home";

import { getmittvalue } from "components/common/mitt/mitt.js";
import { debounce } from "common/utils";
// import { itemListenerMixin } from "common/mixin"

export default {
  name: "Home",
  //使用公共抽取的代码
  // mixins: [itemListenerMixin],
  components: {
    HomeSwiper,
    HomeRecommendView,
    FeatureView,
    FeatureView,
    NavBar,
    TabControl,
    GoodsList,
    Scroll,
    BackTop,
  },
  data() {
    return {
      banners: [], //轮播
      recommends: [], //推荐
      goods: {
        //商品数据
        pop: { page: 0, list: [] },
        new: { page: 0, list: [] },
        sell: { page: 0, list: [] },
      },
      currentType: "pop",
      isShowBackTop: false,
      tabOffsetTop: 0, //tabOffsetTop: 这个就是当前内容距离上面多远
      isTabFixed: false,
      saveY: 0,
      itemImgListener: null,
    };
  },
  computed: {
    showGoods() {
      return this.goods[this.currentType].list;
    },
  },
  unmounted() {
    // console.log('销毁函数');
  },
  //离开的时候的状态
  deactivated() {
    //1.保存Y值
    this.saveY = this.$refs.scroll.getScrollY();

    //2.取消全局事件的监听
    // this.$bus.$off('homeItemImgLoad', this.itemImgListener)
  },
  //进来的时候的状态
  activated() {
    //防止出现bug要进行刷新
    this.$refs.scroll.refresh();

    //跳转到当前位置   跳转的时间从0变成1是好像是怕0直接回到顶端
    //把代码和上面那个换一下位置也行的
    this.saveY = this.$refs.scroll.scrollTo(0, this.saveY, 0);
  },
  created() {
    //1.请求多个数据
    this.getHomeMultidata();

    //2.请求商品数据
    this.getHomeGoods("pop");
    this.getHomeGoods("new");
    this.getHomeGoods("sell");
  },
  mounted() {
    //1.图片加载完成的事件监听
    const refresh = debounce(
      this.$refs.scroll && this.$refs.scroll.refresh,
      300
    );

    //对监听的事件的保存
    this.itemImgListener = () => {
      //重新调用新的高度
      refresh();
    };

    //运用第三方mitt接受事件
    getmittvalue("homeItemImageLoad", this.itemImgListener);
  },
  methods: {
    /**
     * 事件监听相关的方法
     */
    tabClick(index) {
      switch (index) {
        case 0:
          this.currentType = "pop";
          break;
        case 1:
          this.currentType = "new";
          break;
        case 2:
          this.currentType = "sell";
          break;
      }
      this.$refs.tabControl1.currentIndex = index;
      this.$refs.tabControl2.currentIndex = index;
    },

    //点击按钮回到最上面
    backClick() {
      this.$refs.scroll.scrollTo(0, 0, 500);
    },

    // 隐藏还没到地方的返回最上面的图标
    contentScroll(position) {
      //1.判断BackTop是否显示
      this.isShowBackTop = -position.y > 1000;

      //2.决定tabControl是否吸顶（position：fixed）
      this.isTabFixed = -position.y > this.tabOffsetTop;
    },

    //上拉加载更多
    loadMore() {
      this.getHomeGoods(this.currentType);
    },

    //2.给流行  新品 。。 赋值
    //获取tabControl的offsetTop
    //因为这里是一个组件所以没法直接拿到属性
    //所有的组件都有一个属性$el: 用于获取组件中的元素
    // console.log(this.$refs.tabControl.$el.offsetTop);
    //轮播图加载完成之后
    swiperImageLoad() {
      this.tabOffsetTop = this.$refs.tabControl2.$el.offsetTop;
      console.log(this.tabOffsetTop);
    },

    /**
     * 网络请求相关的方法
     */
    //请求多个数据的具体
    getHomeMultidata() {
      getHomeMultidata().then((res) => {
        // this.result = res
        this.banners = res.data.banner.list;
        this.recommends = res.data.recommend.list;
      });
    },
    //请求商品数据的具体
    getHomeGoods(type) {
      const page = this.goods[type].page + 1;
      getHomeGoods(type, page).then((res) => {
        this.goods[type].list.push(...res.data.list); //...代表可以传入多个参数
        this.goods[type].page += 1;

        //因为srcoll默认只能加载一次，所以需要调用finishPullUp这个函数  这个是封装在Scroll.vue中的方法
        this.$refs.scroll.finishPullUp();
      });
    },
  },
};
</script>

// scodep相当于作用域 就是写vue代码的时候最好加上
//height: 100vh;: 相当于视图有多大这个页面能展示的内容就有多大
//height: calc(100% - 98px);: 计算属性页面内容减去想要的就是剩下的
<style scoped>
#home {
  /* padding-top: 44px; */
  height: 100vh;

  position: relative;
}

.home-nav {
  background-color: var(--color-tint);
  color: #fff;

  /* position: fixed;
  left: 0;
  right: 0;
  top: 0;
  z-index: 9; */
}

.tab-control {
  position: relative;
  z-index: 9;
}

/* .tab-control {
  position: sticky; 这个是把划到的导航条固定到上面
  top: 44px;
} */

.content {
  overflow: hidden;

  position: absolute;
  top: 45px;
  bottom: 45px;
  left: 0;
  right: 0;
}

/* .content {
  height: calc(100% - 93px);
  overflow-y: hidden;
  margin-top: 44px;
} */
</style>