import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import FastClick from 'fastclick'
import lazyPlugin from 'vue3-lazy'

//先执行安装fastclick的命令 npm install fastclick -S,再在main主文件使用
//解决移动端300ms延迟
FastClick.attach(document.body);

const app = createApp(App)

app.use(store).use(router).mount('#app')

//使用图片懒加载
app.use(lazyPlugin, {
  loading: require('assets/img/common/placeholder.png'), // 加载时默认图片
  // error: require('@/assets/img/sp.png')// 图片失败时默认图片
})
