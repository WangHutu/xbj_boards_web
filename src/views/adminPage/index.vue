<template>
  <el-scrollbar>
    <div class="home">
      <div class="home_head">
        <el-row justify="space-between">
          <el-col :span="10" style="padding-right: 20px">
            <el-input
              :suffix-icon="Search"
              :model-value="selectAdmin.admin"
              placeholder="Enter Admin to search"
              clearable
              @input="change('admin', $event)"
              @keyup.enter="searchHandle"
            />
          </el-col>
          <el-col :span="2" style="text-align: right">
            <el-button v-if="stateBtn" type="primary" @click="showDialog()">ADD</el-button>
          </el-col>
        </el-row>
      </div>
      <el-table v-loading="loading" :data="tableData" stripe border style="width: 100%">
        <el-table-column prop="admin" label="Admin" min-width="150" />
        <el-table-column prop="remark" label="Remark" min-width="180" />
        <el-table-column v-if="stateBtn" label="operate " width="150px" align="center">
          <template #default="scope">
            <el-link v-if="!store.adminUser.includes(scope.row.admin)" type="primary" :underline="false" @click="showDialog(scope.row)">Edit</el-link>
            <el-link v-if="!store.adminUser.includes(scope.row.admin)" type="primary" :underline="false" @click="delRow(scope.row)">Del</el-link>
          </template>
        </el-table-column>
      </el-table>
      <sysdialog
        @getAdminList="getAdminList"
        ref="sysdialogRef"
        v-model:dialog-form-visible="dialogFormVisible"
      ></sysdialog>
    </div>
  </el-scrollbar>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { Search } from '@element-plus/icons-vue'
import { ElMessageBox } from 'element-plus'
import sysdialog from './sysdialog.vue'
import { Admin } from '@/api/api'
import { LocalVue } from '@/common/utils'
import { useCounterStore } from '@/stores/counter'
import { ElMessage } from 'element-plus'

const selectAdmin = ref({
  admin: ''
})
const loading = ref(true)
const store = useCounterStore()
const stateBtn = ref(false)
const row = reactive({
  id: '',
  admin: '',
  remark: ''
})
const tableData = ref([])
const sysdialogRef = ref<InstanceType<typeof sysdialog>>()
const dialogFormVisible = ref(false)
const showDialog = (data?: any) => {
  sysdialogRef.value?.dilogInit(data)
}
const delRow = (data: any) => {
  const { admin, remark, id } = data
  row['id'] = id
  row['admin'] = admin
  row['remark'] = remark
  ElMessageBox.confirm(`Are you sure you want to remove the 【 ${data.admin} 】?`, 'Delete', {
    confirmButtonText: 'OK',
    cancelButtonText: 'Cancel',
    type: 'warning'
  }).then(() => {
    Admin.delAdminList(row).then((res:any)=>{
      console.log(res, 'res')
      if (res.code == 200) {
        getAdminList('')
      }
    })
  })
}

const searchHandle = () => {
  getAdminList(selectAdmin.value)
}
const change = (val: String, event: any) => {
  if (val === 'admin') {
    selectAdmin.value.admin = event
    let timer: any = null
    if (timer != null) {
      clearTimeout(timer)
      timer = null
    }
    timer = setTimeout(searchHandle, 300)
  }
}

const getAdminList = (data: any) => {
  loading.value = true
  LocalVue.removeLocal('terminal_user')
  Admin.getAdminList(data).then((res: any) => {
    if (res.code == '200') {
      if (res.data) {
        tableData.value = res.data.adminInfo
        if (res.data.user) {
            LocalVue.setLocal('terminal_user', res.data.user)
          } else {
            ElMessage.error('没有获取到终端用户！')
          }
          const name = LocalVue.getLocal('adminUser')?.split('"').join('') || ''
          stateBtn.value = store.adminUser.includes(name)
      }
    }
    setTimeout(()=>{
        loading.value = false
      },300)
  }).catch(()=>{
    setTimeout(()=>{
        loading.value = false
      },300)
  })
}

onMounted(() => {
  loading.value = true
  getAdminList(selectAdmin.value)
})
</script>

<style scoped>
.home .home_head {
  height: 50px;
  line-height: 50px;
  margin-bottom: 10px;
}
a {
  margin-right: 10px;
}
</style>
