<template>
  <el-scrollbar>
    <div class="home">
      <div class="home_head">
        <el-row justify="space-between">
          <el-col :span="10" style="padding-right: 20px">
            <el-input
              :suffix-icon="Search"
              :model-value="selectType.typeName"
              placeholder="Enter Type to search"
              clearable
              @input="change('type', $event)"
              @keyup.enter="searchHandle"
            />
          </el-col>
          <el-col :span="2" style="text-align: right">
            <el-button v-if="stateBtn" type="primary" @click="showDialog()">添加</el-button>
          </el-col>
        </el-row>
      </div>
      <el-table v-loading="loading" :data="tableData" stripe border style="width: 100%">
        <el-table-column prop="typeName" label="Type" min-width="150" />
        <el-table-column prop="remark" label="Remark" min-width="180" />
        <el-table-column v-if="stateBtn" label="operate " width="150px" align="center">
          <template #default="scope">
            <el-link type="primary" :underline="false" @click="showDialog(scope.row)">编辑</el-link>
            <el-link type="primary" :underline="false" @click="delRow(scope.row)">删除</el-link>
          </template>
        </el-table-column>
      </el-table>
      <sysdialog
        @getTypeList="getTypeList"
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
import { Boards } from '@/api/api'
import { LocalVue } from '@/common/utils'
import { useCounterStore } from '@/stores/counter'
import { ElMessage } from 'element-plus'

const selectType = ref({
  typeName: ''
})
const loading = ref(true)
const userList = useCounterStore()
const stateBtn = ref(false)
const row = reactive({
  id: '',
  typeName: '',
  remark: ''
})
const tableData = ref([])
const sysdialogRef = ref<InstanceType<typeof sysdialog>>()
const dialogFormVisible = ref(false)
const showDialog = (data?: any) => {
  sysdialogRef.value?.dilogInit(data)
}
const delRow = (data: any) => {
  const { typeName, remark, id } = data
  row['id'] = id
  row['typeName'] = typeName
  row['remark'] = remark
  ElMessageBox.confirm(`是否要删除【 ${data.typeName} 】?`, 'Warning', {
    confirmButtonText: 'OK',
    cancelButtonText: 'Cancel',
    type: 'warning'
  }).then(() => {
    Boards.delTypeList(row).then((res:any)=>{
      console.log(res, 'res')
      if (res.code == 200) {
        getTypeList('')
      }
    })
  })
}

const searchHandle = () => {
  getTypeList(selectType.value)
}
const change = (val: String, event: any) => {
  if (val === 'type') {
    selectType.value.typeName = event
    let timer: any = null
    if (timer != null) {
      clearTimeout(timer)
      timer = null
    }
    timer = setTimeout(searchHandle, 300)
  }
}

const getTypeList = (data: any) => {
  loading.value = true
  LocalVue.clearLocal()
  Boards.getTypeList(data).then((res: any) => {
    // console.log(res, 'res')
    if (res.code == '200') {
      if (res.data) {
        tableData.value = res.data.typeInfo
        if (res.data.user) {
            LocalVue.setLocal('user', res.data.user)
          } else {
            ElMessage.error('没有获取到当前用户！')
          }
          console.log(LocalVue.getLocal('user'))
          stateBtn.value = userList.count.includes(res.data.user)
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
  getTypeList(selectType.value)
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
