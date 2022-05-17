<template>
  <div class="cart">
    <!-- 导航 -->
    <nav-bar class="nav-bar">
      <template v-slot:center>
        <div>购物车({{ cartLength }})</div>
      </template>
    </nav-bar>
    <!-- 商品的列表 -->
    <cart-list />
    <!-- 底部汇总 -->
    <cart-button-bar @calcClick="calcClick" />
    <!-- 太麻烦不需要了 -->
    <toast :message="message" :isShow="isShow" />
  </div>
</template>

<script>
import NavBar from "components/common/navbar/NavBar";
import CartList from "./childComps/CartList";
import CartButtonBar from "./childComps/CartButtonBar";
import Toast from "components/common/toast/Toast.vue";

//这是vuex中的获取getters计算属性的方法
import { mapGetters } from "vuex";

export default {
  nam: "Cart",
  components: {
    NavBar,
    CartList,
    CartButtonBar,
    Toast,
  },
  data() {
    return {
      message: "",
      isShow: false,
    };
  },
  computed: {
    // cartLength() {
    //   // return this.$store.state.cartList.length
    //   return this.$store.getters.cartLength
    // }

    //直接拿取getters中的计算属性
    //这是特殊的直接导入的方法
    ...mapGetters(["cartLength"]),
  },
  methods: {
    calcClick() {
      if (this.$store.state.cartList.find((item) => item.checked)) {
        // if (!this.isSelectAll) {
        //这里的show是调用的Toast中的show方法
        //这里的$toast是插件，从main中已经注册到全局中了
        this.isShow = true;
        this.message = "购买成功";

        setTimeout(() => {
          this.isShow = false;
          this.message = "";
        }, 2000);
      } else {
        this.isShow = true;
        this.message = "您还没选定商品";

        setTimeout(() => {
          this.isShow = false;
          this.message = "";
        }, 2000);
      }
    },
  },
};
</script>

<style scoped>
.cart {
  /* height: calc(100vh - 40px); */
  height: 100vh;
}
.nav-bar {
  background-color: var(--color-tint);
  color: #fff;
  font-weight: 400;
}
</style>