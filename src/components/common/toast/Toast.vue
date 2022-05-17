<template>
  <div class="toast" v-show="isShow">
    <div>{{message}}</div>
  </div>
</template>

<script>
export default {
  name: "Toast",
  props: {
    message: {
      type: String,
      default: ''
    },
    isShow: {
      type: Boolean,
      default: false
    }
  },
  // data() {
  //   // return {
  //   //   message: '',
  //   //   isShow: falsse
  //   // }
  // },
  methods: {
    //这里也可以使用mitt来发射一个事件，然后全局都可以调用的到
    // show(message='默认文字', duration=2000) {
    //   this.isShow = true;
    //   this.message = message;

    //   setTimeout(() => {
    //     this.isShow = false;
    //     this.message = ''
    //   }, duration)
    // }
  }
}
</script>

<style scoped>
  .toast {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 8px 10px;

    color: #fff;
    background-color: rgba(0,0,0,.75);

    z-index: 99;

    border-radius: 5px
  }
</style>