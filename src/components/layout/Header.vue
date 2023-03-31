<template>
  <div>
    <span class="nav_text">Welcome </span>

    <el-link :underline="false" v-if="!adminUser" class="rightText userName" @click="loginUser()"
      >Login</el-link
    >

    <div v-else class="rightText">
      <span class="userName">{{ adminUser }}</span>
      |
      <el-link class="userName" :underline="false" @click="exitUser()">Exit</el-link>
    </div>
    <userDialog ref="userDialogRef"></userDialog>
  </div>
</template>

<script setup lang="ts">
import { LocalVue } from '@/common/utils'
import userDialog from '@/components/userDialog.vue'
import { ref, inject } from 'vue'
const adminUser = ref<string | undefined>(LocalVue.getLocal('adminUser')?.split('"').join(''))
const userDialogRef = ref<InstanceType<typeof userDialog>>()
const reload: any = inject('reload')
const loginUser = () => {
  userDialogRef.value?.userInit()
}

const exitUser = () => {
  LocalVue.removeLocal('adminUser')
  reload()
}
</script>

<style scoped>
.nav_text {
  font-weight: bold;
}
.userName {
  color: #409eff;
}
.rightText {
  float: right;
}
</style>
