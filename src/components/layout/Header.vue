<template>
  <div v-ir="state">
    <span class="nav_text">Welcome </span>

    <el-link :underline="false" v-if="!adminUser" class="rightText userName" @click="loginUser()"
      >Login</el-link
    >

    <div v-else class="rightText">
      <span class="userName">{{ adminUser }}</span>
      |
      <el-link class="userName" :underline="false" @click="exitUser()">Exit</el-link>
    </div>
    <userDialog @reloadVue="reloadVue" ref="userDialogRef"></userDialog>
  </div>
</template>

<script setup lang="ts">
import { LocalVue } from '@/common/utils'
import userDialog from '@/components/userDialog.vue'
import { ref } from 'vue'
const adminUser = ref<string | undefined>(LocalVue.getLocal('adminUser')?.split('"').join(''))
const state = ref(true)
const userDialogRef = ref<InstanceType<typeof userDialog>>()

const loginUser = () => {
  userDialogRef.value?.userInit()
}

const exitUser = () => {
  LocalVue.removeLocal('adminUser')
}

const reloadVue = () => {
  console.log('87468764')
  state.value = false
  state.value = true
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
