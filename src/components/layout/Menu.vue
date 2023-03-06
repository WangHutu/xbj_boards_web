<template>
  <el-menu
    active-text-color="#409EFF"
    background-color="#304156"
    class="el-menu-vertical-demo"
    :default-active="route.path"
    text-color="#fff"
    :router="true"
  >
    <!-- <div class="logo">LOGO</div> -->
    <el-menu-item index="/">
      <el-icon><House /></el-icon>
      <template #title>首页</template>
    </el-menu-item>
    <el-menu-item index="/type">
      <el-icon>
        <Document />
      </el-icon>
      <template #title>类型</template>
    </el-menu-item>
    <!-- <el-menu-item index="/user">
            <el-icon>
                <User />
            </el-icon>
            <template #title>用户</template>
        </el-menu-item> -->
  </el-menu>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()
</script>
