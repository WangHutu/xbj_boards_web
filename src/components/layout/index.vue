<template>
  <div class="app_wrap">
    <MenuVue v-if="showState" class="menu_container" />
    <div :class="showState ? 'main_container' : 'hide_main_container'">
      <HeaderVue class="navbar" :class="showState ? 'show_navbar' : ''"></HeaderVue>
      <ContentVue class="main_wrap" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { LocalVue } from '@/common/utils'
import { ref } from 'vue'
import HeaderVue from './Header.vue'
import MenuVue from './Menu.vue'
import ContentVue from './Content.vue'

const adminUser = ref<string | undefined>(LocalVue.getLocal('adminUser')?.split('"').join(''))
const showState = !!adminUser.value
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
.hide_main_container {
  width: 100%;
  margin: auto;
}

.navbar {
  background-color: #fff;
  position: fixed;
  top: 0;
  width: calc(100vw - 50px);
  padding: 0 20px;
  height: 50px;
  line-height: 50px;
  box-shadow: 0 1px 3px hsl(0deg 0% 7% / 10%);
  z-index: 5;
}
.show_navbar {
  left: 210px;
  width: calc(100vw - 250px);
}

.main_wrap {
  margin: 50px auto 30px;
  padding: 20px;
  width: calc(100% - 70px);
  min-width: 1000px;
}
</style>
