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
                :key="item.value"
                :label="item.label"
                :value="item.value"
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
              @keyup.enter="searchIpHandle"
          /></el-col>
          <el-col :span="2" style="text-align: right">
            <el-button type="primary" @click="showDialog">ADD</el-button>
          </el-col>
        </el-row>
      </div>
      <systable v-model:tableData="tableData" @showDialog="showDialog"></systable>
      <sysdialog
        ref="sysdialogRef"
        v-model:dialog-form-visible="dialogFormVisible"
        v-model:types="types"
      ></sysdialog>
    </div>
  </el-scrollbar>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Search } from '@element-plus/icons-vue'
import systable from './systable.vue'
import sysdialog from './sysdialog.vue'

interface Homeform {
  type: Array<string>
  ip: string
  status: string
}
const selectType = ref([])
const selectStatus = ref([])
const searchIp = ref<string>('')
const dialogFormVisible = ref(false)
const tableData = ref([
  {
    type: 'kv260',
    ip: '10.176.179.103',
    user: 'runfengw',
    status: 'True',
    remark: '备注'
  },
  {
    type: 'kv260',
    ip: '10.176.179.103',
    user: 'runfengw',
    status: 'True',
    remark: '备注'
  },
  {
    type: 'kv260',
    ip: '10.176.179.103',
    user: '',
    status: 'True',
    remark: '备注'
  },
  {
    type: 'kv260',
    ip: '10.176.179.103',
    user: 'runfengw',
    status: 'False',
    remark: '备注'
  },
  {
    type: 'kv260',
    ip: '10.176.179.103',
    user: 'runfengw',
    status: 'True',
    remark: '备注'
  },
  {
    type: 'kv260',
    ip: '10.176.179.103',
    user: 'runfengw',
    status: 'True',
    remark: '备注'
  },
  {
    type: 'kv260',
    ip: '10.176.179.103',
    user: '',
    status: 'True',
    remark: '备注'
  },
  {
    type: 'kv260',
    ip: '10.176.179.103',
    user: 'runfengw',
    status: 'False',
    remark: '备注'
  },
  {
    type: 'kv260',
    ip: '10.176.179.103',
    user: 'runfengw',
    status: 'True',
    remark: '备注'
  },
  {
    type: 'kv260',
    ip: '10.176.179.103',
    user: 'runfengw',
    status: 'True',
    remark: '备注'
  },
  {
    type: 'kv260',
    ip: '10.176.179.103',
    user: '',
    status: 'True',
    remark: '备注'
  },
  {
    type: 'kv260',
    ip: '10.176.179.103',
    user: 'runfengw',
    status: 'False',
    remark: '备注'
  },
  {
    type: 'kv260',
    ip: '10.176.179.103',
    user: 'runfengw',
    status: 'True',
    remark: '备注'
  },
  {
    type: 'kv260',
    ip: '10.176.179.103',
    user: 'runfengw',
    status: 'True',
    remark: '备注'
  },
  {
    type: 'kv260',
    ip: '10.176.179.103',
    user: '',
    status: 'True',
    remark: '备注'
  },
  {
    type: 'kv260',
    ip: '10.176.179.103',
    user: 'runfengw',
    status: 'False',
    remark: '备注'
  },
  {
    type: 'kv260',
    ip: '10.176.179.103',
    user: 'runfengw',
    status: 'True',
    remark: '备注'
  },
  {
    type: 'kv260',
    ip: '10.176.179.103',
    user: 'runfengw',
    status: 'True',
    remark: '备注'
  },
  {
    type: 'kv260',
    ip: '10.176.179.103',
    user: '',
    status: 'True',
    remark: '备注'
  },
  {
    type: 'kv260',
    ip: '10.176.179.103',
    user: 'runfengw',
    status: 'False',
    remark: '备注'
  },
  {
    type: 'kv260',
    ip: '10.176.179.103',
    user: 'runfengw',
    status: 'True',
    remark: '备注'
  },
  {
    type: 'kv260',
    ip: '10.176.179.103',
    user: 'runfengw',
    status: 'True',
    remark: '备注'
  },
  {
    type: 'kv260',
    ip: '10.176.179.103',
    user: '',
    status: 'True',
    remark: '备注'
  },
  {
    type: 'kv260',
    ip: '10.176.179.103',
    user: 'runfengw',
    status: 'False',
    remark: '备注'
  },
  {
    type: 'kv260',
    ip: '10.176.179.103',
    user: 'runfengw',
    status: 'True',
    remark: '备注'
  },
  {
    type: 'kv260',
    ip: '10.176.179.103',
    user: 'runfengw',
    status: 'True',
    remark: '备注'
  },
  {
    type: 'kv260',
    ip: '10.176.179.103',
    user: '',
    status: 'True',
    remark: '备注'
  },
  {
    type: 'kv260',
    ip: '10.176.179.103',
    user: 'runfengw',
    status: 'False',
    remark: '备注'
  },
  {
    type: 'kv260',
    ip: '10.176.179.103',
    user: 'runfengw',
    status: 'True',
    remark: '备注'
  },
  {
    type: 'kv260',
    ip: '10.176.179.103',
    user: 'runfengw',
    status: 'True',
    remark: '备注'
  },
  {
    type: 'kv260',
    ip: '10.176.179.103',
    user: '',
    status: 'True',
    remark: '备注'
  },
  {
    type: 'kv260',
    ip: '10.176.179.103',
    user: 'runfengw',
    status: 'False',
    remark: '备注'
  },
  {
    type: 'kv260',
    ip: '10.176.179.103',
    user: 'runfengw',
    status: 'True',
    remark: '备注'
  },
  {
    type: 'kv260',
    ip: '10.176.179.103',
    user: 'runfengw',
    status: 'True',
    remark: '备注'
  },
  {
    type: 'kv260',
    ip: '10.176.179.103',
    user: '',
    status: 'True',
    remark: '备注'
  },
  {
    type: 'kv260',
    ip: '10.176.179.103',
    user: 'runfengw',
    status: 'False',
    remark: '备注'
  }
])
const types = ref([
  {
    value: 'kv260',
    label: 'kv260'
  },
  {
    value: 'vck190',
    label: 'vck190'
  },
  {
    value: 'vek280',
    label: 'vek280'
  },
  {
    value: 'zcu104',
    label: 'zcu104'
  },
  {
    value: 'zcu102',
    label: 'zcu102'
  }
])
const status = [
  {
    value: 'vacant',
    label: 'vacant'
  },
  {
    value: 'occupy',
    label: 'occupy'
  }
]
const searchForm = ref<Homeform>({
  type: [],
  ip: '',
  status: ''
})
const searchhandle = () => {
  console.log(searchForm.value)
}
const searchIpHandle = () => {
  searchForm.value.ip = searchIp.value
  console.log(searchForm.value)
  searchhandle()
}
const sysdialogRef = ref<InstanceType<typeof sysdialog>>()
const showDialog = (data: object) => {
  sysdialogRef.value?.dilogInit(data)
}
const change = (val: String, event: any) => {
  if (val === 'type') {
    searchForm.value.type = event
    searchhandle()
  } else if (val === 'status') {
    searchForm.value.status = event
    searchhandle()
  } else if (val === 'ip') {
    searchIp.value = event
  }
}
</script>

<style scoped>
.home .home_head {
  height: 50px;
  line-height: 50px;
  margin-bottom: 10px;
}
</style>
