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
      <div class="tip_state">
        <div class="state_item">
          <span class="state_pub idle"></span>
          <span>Idle</span>
        </div>
        <div class="state_item">
          <span class="state_pub inuse"></span>
          <span>In use</span>
        </div>
      </div>
      <systable
        v-model:tableData="tableData"
        v-model:loading="loading"
        v-model:stateBtn="stateBtn"
        v-model:dailys="dailys"
        v-model:ipList="ipList"
        v-model:powerList="powerList"
        @showDialog="showDialog"
        @getBoardsList="getBoardsList"
      ></systable>
      <!-- <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
        <el-tab-pane label="first" name="first"
          ><systable
            v-model:tableData="tableData"
            v-model:loading="loading"
            v-model:stateBtn="stateBtn"
            v-model:dailys="dailys"
            v-model:ipList="ipList"
            v-model:powerList="powerList"
            @showDialog="showDialog"
            @getBoardsList="getBoardsList"
          ></systable
        ></el-tab-pane>
        <el-tab-pane label="daliy" name="second">daliy</el-tab-pane>
      </el-tabs> -->

      <sysdialog
        @getBoardsList="getBoardsList"
        ref="sysdialogRef"
        v-model:dialog-form-visible="dialogFormVisible"
        v-model:types="types"
      ></sysdialog>
      <loginDialog @reloadHandle="reloadHandle" ref="loginDialogRef"></loginDialog>
    </div>
  </el-scrollbar>
</template>

<script setup lang="ts">
import { ref, onMounted, inject } from 'vue'
import { Search } from '@element-plus/icons-vue'
import { Boards, Admin, Power } from '@/api/api'
import systable from './systable.vue'
import sysdialog from './sysdialog.vue'
import loginDialog from '@/components/loginDialog.vue'
import { LocalVue } from '@/common/utils'
import { useCounterStore } from '@/stores/counter'
import { ElMessage } from 'element-plus'
// import type { TabsPaneContext } from 'element-plus'

interface Homeform {
  type: Array<string>
  ip: string
  status: string
}
interface TypeObject {
  remark: string
  typeName: string
}
// const activeName = ref('first')
// const handleClick = (tab: TabsPaneContext, event: Event) => {
//   console.log(tab, event)
// }
const reload: any = inject('reload')
const loginUser = ref<string | undefined>(LocalVue.getLocal('user')?.split('"').join(''))
const adminUser = ref<string | undefined>(LocalVue.getLocal('adminUser')?.split('"').join(''))
const store = useCounterStore()
const loading = ref(true)
const stateBtn = ref(false)
const dailys = store.dailys
const selectType = ref([])
const selectStatus = ref([])
const searchIp = ref<string>('')
const dialogFormVisible = ref(false)
const tableData = ref<Array<object>>([])
const types = ref<Array<TypeObject>>([])
const powerList = ref<Object>([])
const ipList = ref<Array<string>>([])
const status = [
  { value: 'vacant', label: 'Idle' },
  { value: 'occupy', label: 'Inuse' }
]
const searchForm = ref<Homeform>({
  type: [],
  ip: '',
  status: ''
})
const searchhandle = () => {
  getBoardsList(searchForm.value)
}
const reloadHandle = () => {
  reload()
}
const sysdialogRef = ref<InstanceType<typeof sysdialog>>()
const loginDialogRef = ref<InstanceType<typeof loginDialog>>()
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
const getPowerList = (data: any) => {
  Power.getPowerList(data).then((res: any) => {
    if (res.code == '200') {
      if (res.data) {
        powerList.value = res.data.powerList
        ipList.value = Object.keys(powerList.value)
      }
    }
  })
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

const getAdminList = (data: any) => {
  Admin.getAdminList(data).then((res: any) => {
    if (res.code == '200') {
      if (res.data) {
        const list = res.data.adminInfo.map((item: any) => {
          return item.admin
        })
        if (list.length) {
          store.countChange(list)
        } else {
          store.countChange(store.adminUser)
        }
      }
    }
  })
}

const getBoardsList = (data: any) => {
  loading.value = true
  LocalVue.removeLocal('terminal_user')
  Boards.getBoardList(data)
    .then((res: any) => {
      if (res.code == '200') {
        if (res.data) {
          tableData.value = dataFilter2(res.data.boardInfo)
          if (res.data.user) {
            LocalVue.setLocal('terminal_user', res.data.user)
          } else {
            ElMessage.error('没有获取到终端用户！')
          }
          console.log('终端用户：', LocalVue.getLocal('terminal_user'))
          const name = LocalVue.getLocal('adminUser')?.split('"').join('') || ''
          stateBtn.value = store.count.includes(name)
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

const dataFilter = (data: any) => {
  const order = ['vek280', 'vck190', 'kv260', 'zcu102', 'zcu104']
  const sortedData = data.slice().sort((a: any, b: any) => {
    const indexA = order.indexOf(a.type)
    const indexB = order.indexOf(b.type)
    return indexA - indexB
  })
  return sortedData
}

const dataFilter2 = (data: any) => {
  const order = ['vek280', 'vck190', 'kv260', 'zcu102', 'zcu104']
  // const sortedData = data.slice().sort((a: any, b: any) => {
  //   const indexA = order.indexOf(a.type)
  //   const indexB = order.indexOf(b.type)
  //   return indexA - indexB
  // })
  let targetArr: any[] = []
  order.forEach((typeItem: any) => {
    const arr: any[] = []
    data.forEach((item: any) => {
      if (item.type == typeItem) {
        arr.push(item)
      }
    })
    const newArr = arr.sort((a, b) => {
      const ip1 = a.ip
        .split('.')
        .map((e:any) => e.padStart(3, '0'))
        .join('')
      const ip2 = b.ip
        .split('.')
        .map((e:any) => e.padStart(3, '0'))
        .join('')
      return ip1 - ip2
    })
    targetArr = targetArr.concat(newArr)
  })
  return targetArr
}

onMounted(async () => {
  // LocalVue.clearLocal()
  await getAdminList('')
  await getPowerList('')
  getTypeList('')
  getBoardsList('')

  if (!loginUser.value && !adminUser.value) {
    loginDialogRef.value?.loginInit()
  }
})
</script>

<style scoped>
.home .home_head {
  height: 50px;
  line-height: 50px;
  margin-bottom: 10px;
}
.tip_state {
  display: flex;
  margin: 10px 0;
  height: 20px;
}
.state_item {
  margin-right: 50px;
  color: #909399;
  font-size: 16px;
  font-weight: bold;
  line-height: 20px;
}
.state_pub {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin: auto 10px 2px auto;
}
.inuse {
  background: #f56c6c;
}
.idle {
  background: #67c23a;
}
</style>
