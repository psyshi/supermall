import Toast from './Toast'

const obj = {
  install(Vue) {
    const toastConstructor = Vue.component('toast', Toast)

    // 1.实例化并绑定组件
    const instance = toastConstructor.mount(document.createElement('div'));

    // 2.将挂载的Node添加到body中
    document.body.appendChild(instance.$el);

    // 3.定义全局($toast即是此插件的名称)

    app.config.globalProperties.$toast = instance;
  }
}

//官方解释: 安装 Vue.js 插件。如果插件是一个对象，必须提供 install 方法。
//如果插件是一个函数，它会被作为 install 方法。install 方法调用时，会将 Vue 作为参数传入。
//   // Vue.component(Toast)

//   // //因为Toast是一个vue他不会把模板就是template中的内容放到$toast中，所以使用了下面这个方法
//   // //但下面这个方法不行，因为还没被注册就已经调用了这个方法
//   // // document.body.appendChild(Toast.$el)

//   // //1.创建组件构造器
//   // const toastContrustor = Vue.component(Toast)

//   // //2.new的方式，根据组件构造器，可以创建出来一个组件对象
//   // const toast = new toastContrustor()

//   // //3.将组件对象，手动挂载到某一个元素上
//   // toast.$mount(document.createElement('div'))

//   // //4.toast.$el对应的就是div
//   // document.body.appendChild(toast.$el)

//   // Vue.prototype.$toast =  instance

// }

export default obj