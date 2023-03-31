<template>
  <el-dialog
    :close-on-click-modal="false"
    :show-close="false"
    :model-value="loginDialogState"
    title="请输入用户名使用"
    width="600px"
  >
    <el-form :model="loginForm" ref="ruleFormRef" :rules="rules" label-width="60px" @submit.prevent>
      <el-form-item label="user" prop="user">
        <el-input v-model="loginForm.user" autocomplete="off" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="loginDialogState = false">Cancel</el-button>
        <el-button type="primary" @click="accHandle(ruleFormRef)"> Confirm </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { LocalVue } from '@/common/utils'
import type { FormInstance, FormRules } from 'element-plus'
interface Dialogform {
  user: string
}
const loginForm = reactive<Dialogform>({
  user: ''
})
const emit = defineEmits(['getBoardsList', 'occhandle'])
const ruleFormRef = ref<FormInstance>()
const loginDialogState = ref(false)
const rules = reactive<FormRules>({
  user: [{ required: true, message: 'Please input user', trigger: 'blur' }]
})
const accHandle = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      console.log('输入的用户：', loginForm.user)
      LocalVue.setLocal('user', loginForm.user)
      emit('getBoardsList', '')
      emit('occhandle', loginForm.user, 1)
      loginDialogState.value = false
    } else {
      console.log('error submit!', fields)
    }
  })
}
const loginInit = () => {
  loginDialogState.value = true
}
defineExpose({
  loginInit
})
</script>

<style scoped>
.el-button--text {
  margin-right: 15px;
}

.el-select {
  width: 100%;
}

.el-input {
  width: 100%;
}

.dialog-footer button:first-child {
  margin-right: 10px;
}
</style>
