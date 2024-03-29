<template>
  <el-dialog
    :model-value="dialogFormVisible"
    :title="dialogTitle"
    :close-on-click-modal="false"
    :show-close="false"
    width="600px"
  >
    <el-form :model="formData" ref="ruleFormRef" :rules="rules" :label-width="formLabelWidth" @submit.prevent>
      <el-form-item label="Type: " prop="typeName">
        <el-input
          v-model="formData.typeName"
          autocomplete="off"
          :disabled="dialogTitle == 'Edit Type'"
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
import { Boards } from '@/api/api'
import type { FormInstance, FormRules } from 'element-plus'
interface Dialogform {
  id: string
  typeName: string
  remark: string
}
const dialogTitle = ref<string>('New Type')
const ruleFormRef = ref<FormInstance>()
const formLabelWidth = '60px'
const dialogFormVisible = ref(false)
const emit = defineEmits(['getTypeList'])
const formData = reactive<Dialogform>({
  id: '',
  typeName: '',
  remark: ''
})
const rules = reactive<FormRules>({
  typeName: [{ required: true, message: 'Please input Type name', trigger: 'blur' }]
})
const onCloseHandle = (formEl: FormInstance | undefined) => {
  dialogTitle.value = 'New Type'
  if (!formEl) return
  formEl.resetFields()
  formData['id'] = ''
  formData['typeName'] = ''
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
  if (dialogTitle.value == 'Edit Type') {
    Boards.updateTypeList(formData).then((res: any) => {
      if (res.code == 200) {
        emit('getTypeList', '')
      }
    })
  } else {
    Boards.insertTypeList(formData).then((res: any) => {
      if (res.code == 200) {
        emit('getTypeList', '')
      }
    })
  }
}
const dilogInit = (data?: any): void => {
  if (data) {
    const { typeName, remark, id } = JSON.parse(JSON.stringify(data))
    formData['id'] = id
    formData['typeName'] = typeName
    formData['remark'] = remark
    dialogTitle.value = 'Edit Type'
  } else {
    formData['id'] = ''
    formData['typeName'] = ''
    formData['remark'] = ''
    dialogTitle.value = 'New Type'
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
