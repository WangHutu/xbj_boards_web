<template>
  <el-dialog
    :model-value="dialogFormVisible"
    :title="dialogTitle"
    :close-on-click-modal="false"
    :show-close="false"
    width="600px"
  >
    <el-form :model="formData" ref="ruleFormRef" :rules="rules" label-width="115px" @submit.prevent>
      <el-form-item label="Type: " prop="type">
        <el-select v-model="formData.type" placeholder="Please select a type">
          <el-option
            :key="index"
            v-for="(item, index) in types"
            :label="item.typeName"
            :value="item.typeName"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="Ip: " prop="ip">
        <el-input v-model.trim="formData.ip" autocomplete="off" placeholder="Please input" />
      </el-form-item>
      <el-form-item label="Hardware Rev: " prop="number">
        <el-input v-model="formData.number" autocomplete="off" placeholder="Please input" />
      </el-form-item>
      <el-form-item label="Image: " prop="image">
        <el-input v-model="formData.image" autocomplete="off" placeholder="Please input" />
      </el-form-item>
      <el-form-item label="">
        <el-switch
          v-model="state"
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
import { LocalVue } from '@/common/utils'
import type { FormInstance, FormRules } from 'element-plus'
defineProps<{
  types: Array<any>
}>()
interface Dialogform {
  id: string
  type: string
  ip: string
  number: string
  image: string
  oldIp: string
  status: string
  remark: string
  user: string
  opearUser: string
}
const formData = reactive<Dialogform>({
  id: '',
  type: '',
  ip: '',
  number: '',
  image: '',
  oldIp: '',
  status: 'vacant',
  remark: '',
  user: '',
  opearUser: ''
})
const state = ref(false)
const oldState = ref(false)
const ruleFormRef = ref<FormInstance>()
const emit = defineEmits(['getBoardsList'])
const dialogTitle = ref<string>('New Board')
const validatePass = (rule: any, value: any, callback: any) => {
  const reg =
    /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/
  if (formData.ip === '') {
    callback(new Error('Please input the ip'))
  } else if (reg.test(value) === false) {
    callback(new Error('请输入正确格式IP,如: 11.11.11.11)'))
  } else {
    callback()
  }
}
const rules = reactive<FormRules>({
  type: [{ required: true, message: 'Please select Type', trigger: 'blur' }],
  ip: [{ required: true, trigger: 'blur', validator: validatePass }]
})

const dialogFormVisible = ref(false)
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
      await submitHandle(formEl)
      // onCloseHandle(formEl)
    } else {
      console.log('error submit!', fields)
    }
  })
}
const submitHandle = (formEl: FormInstance | undefined) => {
  formData['opearUser'] = LocalVue.getLocal('adminUser')?.split('"').join('') || LocalVue.getLocal('user')?.split('"').join('') || ''
  const adminUser = LocalVue.getLocal('adminUser')?.split('"').join('') || ''
  formData['status'] = state.value ? 'occupy' : 'vacant'
  if (dialogTitle.value == 'Edit Board') {
    if (!state.value) {
      formData['user'] = ''
    } else if (state.value !== oldState.value) {
      formData['user'] = adminUser
    }
    Boards.updateBoardList(formData).then((res: any) => {
      if (res.code == 200) {
        emit('getBoardsList', '')
        onCloseHandle(formEl)
      }
    })
  } else {
    if (!state.value) {
      formData['user'] = ''
    } else {
      formData['user'] = adminUser
    }
    Boards.insertBoardList(formData)
      .then((res: any) => {
        if (res.code == 200) {
          emit('getBoardsList', '')
          onCloseHandle(formEl)
        }
      })
      .catch((err) => {
        console.log(err)
      })
  }
}
const dilogInit = (data?: any): void => {
  if (data) {
    const { type, ip, status, remark, id, number, image, user } = JSON.parse(JSON.stringify(data))
    formData['id'] = id
    formData['type'] = type
    formData['ip'] = ip
    formData['oldIp'] = ip
    formData['number'] = number
    formData['image'] = image
    formData['status'] = status
    formData['remark'] = remark
    formData['user'] = user
    state.value = formData['status'] === 'occupy'
    oldState.value = formData['status'] === 'occupy'
    dialogTitle.value = 'Edit Board'
  } else {
    formData['id'] = ''
    formData['type'] = ''
    formData['ip'] = ''
    formData['oldIp'] = ''
    formData['number'] = ''
    formData['image'] = ''
    formData['status'] = 'vacant'
    formData['remark'] = ''
    formData['user'] = ''
    dialogTitle.value = 'New Board'
    state.value = false
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
