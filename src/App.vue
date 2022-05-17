<template>
  <div id="app" class="wrapper">
    <!-- keep-alive可以保持浏览的页面保存然后下一次访问继续 -->
    <!-- 这里指的是把router-view中的数据保存到v-slot="{ Component }中 -->
    <!-- 然后在里面使用keep-alive保存数据使用<component :is="Component" />取出数据 -->
    <!-- exclude是指的抛出那个不缓存数据 -->
    <router-view v-slot="{ Component }">
      <keep-alive exclude="Detail">
        <component :is="Component" />
      </keep-alive>
    </router-view>
    
    <main-tab-bar v-if="$route.meta.requiresAuth" />
  </div>
</template> 

<script>
import MainTabBar from 'components/content/mainTabbar/MainTabBar.vue'

export default {
  name: 'App',
  components: {
    MainTabBar
  },
}
</script>

<style scoped>
@import "assets/css/base.css";
</style>