<template>
  <el-scrollbar>
    <div class="home">
      <div class="home_head">
        <el-row>
          <el-col :span="12" style="padding-right: 20px">
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
          <el-col :span="5" style="padding-right: 20px"
            ><el-select
              v-model="selectStatus"
              clearable
              placeholder="Select Status"
              style="width: 100%"
              @change="change('status', $event)"
            >
              <el-option
                v-for="item in status"
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
          <el-col :span="2" style="text-align: right">
            <el-button v-if="stateBtn" type="primary" @click="showDialog()">ADD</el-button>
          </el-col>
        </el-row>
      </div>
      <systable
        v-model:tableData="tableData"
        v-model:loading="loading"
        v-model:stateBtn='stateBtn'
        @showDialog="showDialog"
        @getBoardsList="getBoardsList"
      ></systable>
      <sysdialog
        @getBoardsList="getBoardsList"
        ref="sysdialogRef"
        v-model:dialog-form-visible="dialogFormVisible"
        v-model:types="types"
      ></sysdialog>
    </div>
  </el-scrollbar>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Search } from '@element-plus/icons-vue'
import { Boards } from '@/api/api'
import systable from './systable.vue'
import sysdialog from './sysdialog.vue'
import { LocalVue } from '@/common/utils'
import { useCounterStore } from '@/stores/counter'
import { ElMessage } from 'element-plus'

interface Homeform {
  type: Array<string>
  ip: string
  status: string
}
interface TypeObject {
  remark: string
  typeName: string
}
const userList = useCounterStore()
const loading = ref(true)
const stateBtn = ref(false)
const selectType = ref([])
const selectStatus = ref([])
const searchIp = ref<string>('')
const dialogFormVisible = ref(false)
const tableData = ref([])
const types = ref<Array<TypeObject>>([])
const status = [
  { value: 'vacant', label: '空闲' },
  { value: 'occupy', label: '占用' }
]
const searchForm = ref<Homeform>({
  type: [],
  ip: '',
  status: ''
})
const searchhandle = () => {
  getBoardsList(searchForm.value)
}
const sysdialogRef = ref<InstanceType<typeof sysdialog>>()
const showDialog = (data?: object) => {
  sysdialogRef.value?.dilogInit(data)
}
const change = (val: String, event: any) => {
  if (val === 'type') {
    searchForm.value.type = event.join(',')
    searchhandle()
  } else if (val === 'status') {
    searchForm.value.status = event
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

const getBoardsList = (data: any) => {
  loading.value = true
  LocalVue.clearLocal()
  Boards.getBoardList(data)
    .then((res: any) => {
      if (res.code == '200') {
        if (res.data) {
          tableData.value = res.data.boardInfo
          if (res.data.user) {
            LocalVue.setLocal('user', res.data.user)
          } else {
            ElMessage.error('没有获取到当前用户！')
          }
          console.log(LocalVue.getLocal('user'))
          stateBtn.value = userList.count.includes(res.data.user)
          
        }
      }
      setTimeout(() => {
        loading.value = false
      }, 300)
    })
    .catch(() => {
      setTimeout(() => {
        loading.value = false
      }, 300)
    })
}

onMounted(() => {
  getTypeList('')
  getBoardsList('')
})
</script>

<style scoped>
.home .home_head {
  height: 50px;
  line-height: 50px;
  margin-bottom: 10px;
}
</style>
