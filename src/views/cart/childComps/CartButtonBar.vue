<template>
  <div class="bottom-bar">
    <div class="check-content">
      <check-button
        class="check-button"
        @click.native="checkClick"
        :is-checked="isSelectAll"
      />
      <span>全选</span>
    </div>

    <div class="price">合计: {{ totalprice }}</div>

    <div class="calculate" @click="calcClick">去计算:({{ checkLength }})</div>
  </div>
</template>

<script>
import CheckButton from "components/content/checkButton/CheckButton";

import { mapGetters } from "vuex";

export default {
  name: "CartButtonBar",
  components: {
    CheckButton,
  },
  computed: {
    ...mapGetters(["cartList"]),
    totalprice() {
      return (
        "￥" +
        this.cartList
          .filter((item) => {
            return item.checked;
          })
          .reduce((preValue, item) => {
            return preValue + item.price * item.count;
          }, 0)
          .toFixed(2)
      );
    },
    checkLength() {
      return this.cartList.filter((item) => item.checked).length;
    },
    isSelectAll() {
      //这个可能性能不是太高
      // return !(this.cartList.filter(item => !item.checked).length) && !(this.cartList.length === 0)

      return (
        !this.cartList.find((item) => !item.checked) &&
        !(this.cartList.length === 0)
      );
    },
  },
  methods: {
    checkClick() {
      //全部选中
      if (this.isSelectAll) {
        //forEach就是循环遍历
        this.cartList.forEach((item) => {
          item.checked = false;
        });
      } else {
        //部分选中或全不选中
        this.cartList.forEach((item) => {
          item.checked = true;
        });
      }

      //这个不行
      // this.cartList.forEach(item => {item.checked = !this.isSelectAll})
    },
    calcClick() {
      this.$emit("calcClick");
    },
  },
};
</script>

<style scoped>
.bottom-bar {
  position: absolute;
  bottom: 49px;
  left: 0;
  right: 0;

  height: 40px;
  line-height: 40px;

  display: flex;

  background-color: #eee;

  font-size: 15px;
}

.check-content {
  display: flex;
  align-items: center;
  margin-left: 10px;
  width: 60px;
}

.check-button {
  width: 20px;
  height: 20px;
  line-height: 20px;
  margin-right: 5px;
}

.price {
  margin-left: 10px;
  flex: 1;
}

.calculate {
  width: 90px;
  background: rgb(241, 79, 79);
  color: #fff;
  text-align: center;
}
</style>