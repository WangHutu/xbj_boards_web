<template>
  <el-dialog :model-value="userDialogState" title="请输入管理员账号密码">
    <el-form :model="loginForm" ref="ruleFormRef" :rules="rules" label-width="60px">
      <el-form-item label="admin" prop="admin">
        <el-input v-model="loginForm.admin" autocomplete="off" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="userDialogState = false">Cancel</el-button>
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
  admin: string
}
const loginForm = reactive<Dialogform>({
  admin: ''
})
const emit = defineEmits(['reloadVue'])
const ruleFormRef = ref<FormInstance>()
const userDialogState = ref(false)
const rules = reactive<FormRules>({
  admin: [{ required: true, message: 'Please input admin', trigger: 'blur' }]
})
const accHandle = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      console.log('输入的用户：', loginForm.admin)
      LocalVue.setLocal('adminUser', loginForm.admin)
      emit('reloadVue', '')
      userDialogState.value = false
    } else {
      console.log('error submit!', fields)
    }
  })
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
