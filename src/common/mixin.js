//这就是一个抽取重复代码的东西
//使用的时候就是直接导入这个代码的位置然后  mixins: [itemListenerMixin]
//有一点要注意：好像要注册的组件不能在这地方使用，要在具体的代码显示处使用
export const backTopMinxin = {
  data() {
    return {
      BackTopscrollTo: false,
    }
  },
  methods: {
    //点击按钮回到最上面
    backClick() {
      this.$refs.scroll.scrollTo(0, 0, 500)
    },
    isShowBackTopCC(position) {
      //1.判断BackTop是否显示
      // console.log(position);
      this.BackTopscrollTo = -position.y > 1000;
    }
  }
}