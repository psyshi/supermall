<template>
  <div id="profile">
    <nav-bar class="nav-bar">
      <template v-slot:center>
        <div>个人档案</div>
      </template>
    </nav-bar>
    <user-info-vue></user-info-vue>
  </div>
</template>

<script>
import NavBar from "components/common/navbar/NavBar";
import UserInfoVue from "./childComps/UserInfo.vue";

export default {
  name: "Profiles",
  components: {
    NavBar,
    UserInfoVue
  }
}
</script>

<style scoped>
#profile {
  background-color: #f2f2f2;
}

.nav-bar {
  background-color: var(--color-tint);
  font-weight: 700;
  columns: #fff;
}
</style>