<template>
  <div>
    <span class="nav_text">Welcome  </span>

    <div v-if="adminUser || loginUser" class="rightText">
      <span class="color_link">{{ adminUser || loginUser }}</span>
      |
      <el-link class="color_link" :underline="false" @click="exitUser()">Exit</el-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { LocalVue } from '@/common/utils'
import { ref, inject } from 'vue'
const adminUser = ref<string | undefined>(LocalVue.getLocal('adminUser')?.split('"').join(''))
const loginUser = ref<string | undefined>(LocalVue.getLocal('user')?.split('"').join(''))
const reload: any = inject('reload')

const exitUser = () => {
  LocalVue.removeLocal('user')
  LocalVue.removeLocal('adminUser')
  reload()
}
</script>

<style scoped>
.nav_text {
  font-weight: bold;
}
.color_link {
  color: #409eff;
}
.rightText {
  float: right;
}
</style>
