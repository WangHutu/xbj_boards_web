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
      <template #title>Home</template>
    </el-menu-item>
    <el-menu-item index="/type">
      <el-icon>
        <More />
      </el-icon>
      <template #title>Type</template>
    </el-menu-item>
    <el-menu-item index="/admin">
      <el-icon>
        <User />
      </el-icon>
      <template #title>Admin</template>
    </el-menu-item>
    <el-menu-item index="/logs">
      <el-icon>
        <Tickets />
      </el-icon>
      <template #title>Log</template>
    </el-menu-item>
  </el-menu>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()
</script>
