<template>
  <div>
    <span>欢迎， </span>
    <span class="userName">{{ user }}</span>
  </div>
</template>

<script setup lang="ts">
import { LocalVue } from '@/common/utils'
const user = LocalVue.getLocal('user')?.split('"').join('')
</script>

<style scoped>
.userName {
  color: #409eff;
}
</style>
