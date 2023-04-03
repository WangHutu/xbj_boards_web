<template>
  <el-dialog
    :close-on-click-modal="false"
    :show-close="false"
    :model-value="userDialogState"
    title="Please enter an administrator account to maintain system information."
    width="600px"
  >
    <template #title >
      <span >Please enter an administrator account to maintain system information.</span>
    </template>
    <el-form :model="loginForm" ref="ruleFormRef" :rules="rules" label-width="60px" @submit.prevent>
      <el-form-item label="admin" prop="admin">
        <el-input v-model="loginForm.admin" autocomplete="off" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="onCloseHandle(ruleFormRef)">Cancel</el-button>
        <el-button type="primary" @click="accHandle(ruleFormRef)"> Confirm </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, inject } from 'vue'
import { LocalVue } from '@/common/utils'
import type { FormInstance, FormRules } from 'element-plus'
import { useCounterStore } from '@/stores/counter'
interface Dialogform {
  admin: string
}
const loginForm = reactive<Dialogform>({
  admin: ''
})
const userList = useCounterStore()
const reload: any = inject('reload')
const ruleFormRef = ref<FormInstance>()
const userDialogState = ref(false)
const validatePass = (rule: any, value: any, callback: any) => {
  console.log(loginForm.admin, 'loginForm.admin')
  if (loginForm.admin === '') {
    callback(new Error('Please input admin'))
  } else if (!userList.count.includes(loginForm.admin)) {
    callback(new Error('The administrator does not exist.'))
  } else {
    callback()
  }
}
const rules = reactive<FormRules>({
  admin: [{ required: true, validator: validatePass, trigger: 'blur' }]
})
const accHandle = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      LocalVue.setLocal('adminUser', loginForm.admin)
      reload()
      userDialogState.value = false
    } else {
      console.log('error submit!', fields)
    }
  })
}
const onCloseHandle = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
  loginForm['admin'] = ''
  userDialogState.value = false
}
const userInit = () => {
  userDialogState.value = true
}
defineExpose({
  userInit
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
