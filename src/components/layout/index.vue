<template>
  <div class="app_wrap">
    <MenuVue class="menu_container" />
    <div class="main_container">
      <HeaderVue class="navbar"></HeaderVue>
      <ContentVue class="main_wrap" />
    </div>
  </div>
</template>

<script setup lang="ts">
import HeaderVue from './Header.vue'
import MenuVue from './Menu.vue'
import ContentVue from './Content.vue'
</script>

<style scoped>
.app_wrap {
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
}

.menu_container {
  width: 210px !important;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  z-index: 9;
}

.main_container {
  width: calc(100vw - 210px);
  margin-left: 210px;
}

.navbar {
  background-color: #fff;
  position: fixed;
  top: 0;
  left: 210px;
  width: calc(100vw - 250px);
  padding: 0 20px;
  height: 50px;
  line-height: 50px;
  box-shadow: 0 1px 3px hsl(0deg 0% 7% / 10%);
  z-index: 5;
}

.main_wrap {
  margin: 50px auto 30px;
  padding: 20px;
  width: calc(100% - 70px);
  min-width: 1024px;
}
</style>
