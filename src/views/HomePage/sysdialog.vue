<template>
  <el-dialog
    :model-value="dialogFormVisible"
    :title="dialogTitle"
    :close-on-click-modal="false"
    :show-close="false"
    width="600px"
  >
    <el-form :model="formData" ref="ruleFormRef" :rules="rules" label-width="60px">
      <el-form-item label="Type: " prop="type">
        <el-select v-model="formData.type" placeholder="Please select a type">
          <el-option
            :key="index"
            v-for="(item, index) in types"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="Ip: " prop="ip">
        <el-input v-model="formData.ip" autocomplete="off" placeholder="Please input" />
      </el-form-item>
      <el-form-item label="">
        <el-switch
          :model-value="formData.status === 'False'"
          class="mb-2"
          style="--el-switch-on-color: #13ce66"
          active-text="occupy"
          inactive-text="vacant"
        />
      </el-form-item>
      <el-form-item label="Remark: ">
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
defineProps<{
  types: Array<any>
}>()
interface Dialogform {
  type: string
  ip: string
  status: string
  remark: string
}
const ruleFormRef = ref<FormInstance>()
const emit = defineEmits(['getBoardsList'])
const dialogTitle = ref<string>('New Board')
const rules = reactive<FormRules>({
  type: [{ required: true, message: 'Please select Type', trigger: 'blur' }],
  ip: [{ required: true, message: 'Please input Ip', trigger: 'blur' }]
})

const dialogFormVisible = ref(false)
// const emit = defineEmits(['update:dialogFormVisible'])
const formData = reactive<Dialogform>({
  type: '',
  ip: '',
  status: '',
  remark: ''
})
const onCloseHandle = (formEl: FormInstance | undefined) => {
  dialogTitle.value = 'New Board'
  if (!formEl) return
  formEl.resetFields()
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
      console.log(res, 'res')
      if (res.code == 200) {
        emit('getBoardsList', '')
      }
    })
  } else {
    Boards.insertTypeList(formData).then((res: any) => {
      console.log(res, 'res')
      if (res.code == 200) {
        emit('getBoardsList', '')
      }
    })
  }
}
const dilogInit = (data?: any): void => {
  if (data) {
    const { type, ip, status, remark } = JSON.parse(JSON.stringify(data))
    formData['type'] = type
    formData['ip'] = ip
    formData['status'] = status
    formData['remark'] = remark
    dialogTitle.value = 'Edit Board'
  } else {
    formData['type'] = ''
    formData['ip'] = ''
    formData['status'] = ''
    formData['remark'] = ''
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
