<template>
  <el-scrollbar>
    <div class="log">
      <div class="log_head">
        <el-row>
          <el-col :span="8" style="padding-right: 20px">
            <el-select
              v-model="selectType"
              filterable
              multiple
              placeholder="Select Type"
              style="width: 100%"
              @change="change('type', $event)"
            >
              <el-option
                v-for="item in types"
                :key="item.typeName"
                :label="item.typeName"
                :value="item.typeName"
              />
            </el-select>
          </el-col>
          <el-col :span="6" style="padding-right: 20px"
            ><el-select
              v-model="operate"
              clearable
              placeholder="Select Status"
              style="width: 100%"
              @change="change('operate', $event)"
            >
              <el-option
                v-for="item in operateList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              /> </el-select
          ></el-col>
          <el-col :span="5" style="padding-right: 10px"
            ><el-input
              :suffix-icon="Search"
              :model-value="searchIp"
              placeholder="Enter ip to search"
              clearable
              @input="change('ip', $event)"
              @keyup.enter="searchhandle"
          /></el-col>
          <el-col :span="5" style="padding-right: 10px"
            ><el-input
              :suffix-icon="Search"
              :model-value="searchUser"
              placeholder="Enter user to search"
              clearable
              @input="change('user', $event)"
              @keyup.enter="searchhandle"
          /></el-col>
        </el-row>
      </div>
      <el-table
        :data="tableData"
        v-loading="loading"
        stripe
        border
        style="width: 100%"
        :default-sort="{ prop: 'time', order: 'ascending' }"
      >
        <el-table-column prop="time" sortable label="Time" width="180" />
        <el-table-column prop="user" label="User" width="115" />
        <el-table-column prop="operate" label="Operate" min-width="120" />
        <el-table-column prop="type" label="Type" width="120" />
        <el-table-column prop="newType" label="newType" width="120">
          <template #default="scope">
            <span
              :class="
                scope.row.operate === 'update' && scope.row.newType !== scope.row.type
                  ? 'importClass'
                  : ''
              "
            >
              {{ scope.row.newType }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="ip" label="Ip" min-width="150" />
        <el-table-column prop="newIp" label="newIp" min-width="150">
          <template #default="scope">
            <span
              :class="
                scope.row.operate === 'update' && scope.row.newIp !== scope.row.ip
                  ? 'importClass'
                  : ''
              "
            >
              {{ scope.row.newIp }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="remark" min-width="150" />
        <el-table-column prop="newRemark" label="newRemark" min-width="150">
          <template #default="scope">
            <span
              :class="
                scope.row.operate === 'update' && scope.row.newRemark !== scope.row.remark
                  ? 'importClass'
                  : ''
              "
            >
              {{ scope.row.newRemark }}
            </span>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </el-scrollbar>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Search } from '@element-plus/icons-vue'
import { Boards } from '@/api/api'
import { LocalVue } from '@/common/utils'

interface Homeform {
  type: Array<string>
  ip: string
  operate: string
  user: string
}
interface TypeObject {
  remark: string
  typeName: string
}
const loading = ref(true)
const selectType = ref([])
const operate = ref([])
const searchIp = ref<string>('')
const searchUser = ref<string>('')

const tableData = ref([])
const types = ref<Array<TypeObject>>([])
const operateList = [
  { value: 'add', label: 'add' },
  { value: 'update', label: 'update' },
  { value: 'del', label: 'del' },
  { value: 'occupancy', label: 'occupancy' },
  { value: 'release', label: 'release' }
]
const searchForm = ref<Homeform>({
  type: [],
  ip: '',
  operate: '',
  user: ''
})
const searchhandle = () => {
  getLogList(searchForm.value)
}
const change = (val: String, event: any) => {
  if (val === 'type') {
    searchForm.value.type = event.join(',')
    searchhandle()
  } else if (val === 'operate') {
    searchForm.value.operate = event
    searchhandle()
  } else if (val === 'ip') {
    searchIp.value = event
    searchForm.value.ip = event
    let timer: any = null
    if (timer != null) {
      clearTimeout(timer)
      timer = null
    }
    timer = setTimeout(searchhandle, 300)
  } else if (val === 'user') {
    searchUser.value = event
    searchForm.value.user = event
    let timer: any = null
    if (timer != null) {
      clearTimeout(timer)
      timer = null
    }
    timer = setTimeout(searchhandle, 300)
  }
}
const getTypeList = (data: any) => {
  Boards.getTypeList(data).then((res: any) => {
    if (res.code == '200') {
      if (res.data) {
        types.value = res.data.typeInfo
      }
    }
  })
}

const getLogList = (data: any) => {
  loading.value = true
  Boards.getLogList(data).then((res: any) => {
    if (res.code == '200') {
      if (res.data) {
        tableData.value = res.data.boardInfo
        if (res.data.user) {
            LocalVue.setLocal('user', res.data.user)
          }
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
  getTypeList('')
  getLogList('')
})
</script>

<style scoped>
.log .log_head {
  height: 50px;
  line-height: 50px;
  margin-bottom: 10px;
}
.importClass {
  color: red;
  font-weight: bold;
}
</style>
