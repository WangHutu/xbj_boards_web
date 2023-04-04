<template>
  <div>
    <span class="nav_text">Welcome  </span>
    <div style="display: inline-block;" v-if="!adminUser && loginUser" >
      <span class="color_link">{{ loginUser }}</span>
      |
      <el-link v-if="loginUser" class="color_link" :underline="false" @click="exitUser()">Exit</el-link>
    </div>

    <el-link :underline="false" v-if="!adminUser" class="rightText color_link" @click="userLogin()"
      >Admin Login</el-link
    >

    <div v-else class="rightText">
      <span class="color_link">{{ adminUser }}</span>
      |
      <el-link class="color_link" :underline="false" @click="exitUser()">Exit</el-link>
    </div>
    <userDialog ref="userDialogRef"></userDialog>
  </div>
</template>

<script setup lang="ts">
import { LocalVue } from '@/common/utils'
import userDialog from '@/components/adminDialog.vue'
import { ref, inject } from 'vue'
const adminUser = ref<string | undefined>(LocalVue.getLocal('adminUser')?.split('"').join(''))
const loginUser = ref<string | undefined>(LocalVue.getLocal('user')?.split('"').join(''))
const userDialogRef = ref<InstanceType<typeof userDialog>>()
const reload: any = inject('reload')
const userLogin = () => {
  userDialogRef.value?.userInit()
}

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
