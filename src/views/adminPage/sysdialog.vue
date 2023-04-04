<template>
  <el-dialog
    :model-value="dialogFormVisible"
    :title="dialogTitle"
    :close-on-click-modal="false"
    :show-close="false"
    width="600px"
  >
    <el-form :model="formData" ref="ruleFormRef" :rules="rules" :label-width="formLabelWidth">
      <el-form-item label="Admin: " prop="admin">
        <el-input
          v-model="formData.admin"
          autocomplete="off"
          :disabled="dialogTitle == 'Edit Admin'"
          placeholder="Please input"
          @keyup.enter="submitDialog(ruleFormRef)"
        />
      </el-form-item>
      <el-form-item label="Remark: " prop="remark">
        <el-input v-model="formData.remark" type="textarea" placeholder="Please input" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="onCloseHandle(ruleFormRef)">Cancel</el-button>
        <el-button type="primary" @click="submitDialog(ruleFormRef)"> Confirm </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { Admin } from '@/api/api'
import type { FormInstance, FormRules } from 'element-plus'
interface Dialogform {
  id: string
  admin: string
  remark: string
}
const dialogTitle = ref<string>('New Admin')
const ruleFormRef = ref<FormInstance>()
const formLabelWidth = '60px'
const dialogFormVisible = ref(false)
const emit = defineEmits(['getAdminList'])
const formData = reactive<Dialogform>({
  id: '',
  admin: '',
  remark: ''
})
const rules = reactive<FormRules>({
  admin: [{ required: true, message: 'Please input name', trigger: 'blur' }]
})
const onCloseHandle = (formEl: FormInstance | undefined) => {
  dialogTitle.value = 'New Admin'
  if (!formEl) return
  formEl.resetFields()
  formData['id'] = ''
  formData['admin'] = ''
  formData['remark'] = ''
  dialogFormVisible.value = false
}
const submitDialog = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      await submitHandle()
      onCloseHandle(formEl)
    } else {
      console.log('error submit!', fields)
    }
  })
}
const submitHandle = () => {
  if (dialogTitle.value == 'Edit Admin') {
    Admin.updateAdminList(formData).then((res: any) => {
      if (res.code == 200) {
        emit('getAdminList', '')
      }
    })
  } else {
    Admin.insertAdminList(formData).then((res: any) => {
      if (res.code == 200) {
        emit('getAdminList', '')
      }
    })
  }
}
const dilogInit = (data?: any): void => {
  if (data) {
    const { admin, remark, id } = JSON.parse(JSON.stringify(data))
    formData['id'] = id
    formData['admin'] = admin
    formData['remark'] = remark
    dialogTitle.value = 'Edit Admin'
  } else {
    formData['id'] = ''
    formData['admin'] = ''
    formData['remark'] = ''
    dialogTitle.value = 'New Admin'
  }
  dialogFormVisible.value = true
}
defineExpose({
  dilogInit
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
