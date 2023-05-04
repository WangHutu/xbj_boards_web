<template>
  <el-table v-loading="loading" :data="tableData" stripe border style="width: 100%">
    <el-table-column fixed prop="type" label="Type" width="90" />
    <el-table-column fixed prop="ip" label="Ip" min-width="150" />
    <el-table-column prop="number" label="Hardware Rev" min-width="110" />
    <el-table-column prop="image" label="Image" min-width="120" />
    <el-table-column prop="status" label="State" width="120px" align="center">
      <template #default="scope: any">
        <el-tooltip
          class="box-item"
          effect="dark"
          :content="scope.row.status === 'vacant' ? 'idle' : 'inuse'"
          placement="top"
        >
          <span
            class="state_color"
            :class="scope.row.status === 'vacant' ? 'idle' : 'inuse'"
          ></span>
        </el-tooltip>
        <p class="pingStateText" v-if="scope.row.pingState && scope.row.pingState == 'fail'">
          lose connection
        </p>
      </template>
    </el-table-column>
    <el-table-column prop="user" label="User" width="175px">
      <template #default="scope: any">
        <span>{{ scope.row.user ? scope.row.user : '-' }}</span>
        <span v-if="!dailys.includes(scope.row.ip) && scope.row.user">
          <br />
          <span>{{ scope.row.startTime }}</span>
          <el-divider />
          <span>{{ diffTime(scope.row.startTime) }}</span>
        </span>
      </template>
    </el-table-column>
    <el-table-column prop="remark" label="Remark" min-width="180" />
    <el-table-column label="operate" fixed="right" width="185px" align="center">
      <template #default="scope: any">
        <el-link
          v-if="scope.row.status !== 'vacant'"
          type="primary"
          :underline="false"
          @click="operaHandle(scope.row, 0)"
          >Release</el-link
        >
        <el-link
          v-else
          type="primary"
          :underline="false"
          :disabled="scope.row.status !== 'vacant'"
          @click="operaHandle(scope.row, 1)"
          >Occupy</el-link
        >
        <el-link v-if="stateBtn" type="primary" :underline="false" @click="editHandle(scope.row)"
          >Edit</el-link
        >
        <el-link
          v-if="stateBtn"
          type="primary"
          :underline="false"
          :disabled="scope.row.status !== 'vacant'"
          @click="delRow(scope.row)"
          >Del</el-link
        >
        <!-- 前端不做ping 暂时搁置 -->
        <!-- <el-link
          v-if="showI == 'runfengw'"
          type="primary"
          :underline="false"
          @click="ping_ip(scope.row)"
          >Ping</el-link
        > -->

        <!-- @click="showTerminal = true" -->
        <el-link
          v-if="showI == 'runfengw'"
          type="primary"
          :underline="false"
          
          @click="openTerminal()"
          >openTerminal</el-link
        >
        <el-divider v-if="ipList.includes(scope.row.ip) || showSerial(scope.row.ip)" />
        <el-link
          v-if="ipList.includes(scope.row.ip) && showPower(scope.row.ip)"
          type="primary"
          :underline="false"
          @click="restartBoard(scope.row)"
          >PowerCycle</el-link
        >
        <el-link
          :disabled="scope.row.status !== 'vacant'"
          v-if="showSerial(scope.row.ip)"
          type="primary"
          :underline="false"
          @click="showImageDialog(scope.row)"
          >FlashImage</el-link
        >
      </template>
    </el-table-column>
  </el-table>
  <el-dialog
    :close-on-click-modal="false"
    :show-close="false"
    :model-value="imageDirState"
    title="Please enter the path to image."
    width="600px"
  >
    <el-form
      :model="imageForm"
      ref="imageFormRef"
      :rules="rules"
      label-width="100px"
      @submit.prevent
    >
      <el-form-item label="image path" prop="image">
        <el-input
          v-model.trim="imageForm.image"
          autocomplete="off"
          @keyup.enter="flashImage(imageFormRef)"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="onCloseHandle(imageFormRef)">Cancel</el-button>
        <el-button type="primary" @click="flashImage(imageFormRef)"> Confirm </el-button>
      </span>
    </template>
  </el-dialog>
  <div v-if="showTerminal">
    <terminal ref="ws"/>
    <button @click="closeWs()">close</button>
  </div>
</template>

<script setup lang="ts">
import { reactive, h, ref } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { Boards, Power, reImage } from '@/api/api'
import { LocalVue } from '@/common/utils'
import terminal from './terminal.vue'
const props = defineProps<{
  tableData: Array<object>
  loading: Boolean
  stateBtn: Boolean
  dailys: Array<string>
  ipList: Array<string>
  powerList: any
}>()
interface Dialogform {
  image: string
  ip: string
  id: string
  opearUser: string
}
const imageForm = reactive<Dialogform>({
  image: '',
  ip: '',
  id: '',
  opearUser: ''
})
const ws = ref<InstanceType<typeof terminal>>()
const showI = LocalVue.getLocal('adminUser')?.split('"').join('')
const showTerminal = ref(false)
const showSerial = (ip: any) => {
  return props.powerList[ip]
    ? !!(props.powerList[ip]['serial'] || props.powerList[ip]['jtag'])
    : false
}
const showPower = (ip: any) => {
  return props.powerList[ip] ? !!props.powerList[ip]['power'] : false
}
const closeWs = () => {
  showTerminal.value = false
  // ws.value?.wsInit()
}
const openTerminal = () => {
  window.open('http://117.50.174.56:8888/', '_blank')
}
const imageFormRef = ref<FormInstance>()
const rules = reactive<FormRules>({
  image: [{ required: true, message: 'Please enter the path to image', trigger: 'blur' }]
})
const emit = defineEmits(['showDialog', 'getBoardsList'])
const editHandle = (row: any) => {
  emit('showDialog', row)
}
const imageDirState = ref(false)
const row = reactive({
  id: '',
  type: '',
  ip: '',
  number: '',
  image: '',
  status: '',
  remark: '',
  user: '',
  opearUser: ''
})

const reloadBoardsList = () => {
  emit('getBoardsList', '')
}
const operaHandle = (data: any, opereState: any) => {
  row['opearUser'] =
    LocalVue.getLocal('adminUser')?.split('"').join('') ||
    LocalVue.getLocal('user')?.split('"').join('') ||
    ''
  const adminUser = LocalVue.getLocal('adminUser')?.split('"').join('') || ''
  const loginUser = LocalVue.getLocal('user')?.split('"').join('') || ''
  const { type, ip, remark, id, number, image } = data
  row['id'] = id
  row['type'] = type
  row['ip'] = ip
  row['number'] = number
  row['image'] = image
  row['remark'] = remark
  if (opereState) {
    row['user'] = adminUser ? adminUser : loginUser
    row['status'] = 'occupy'
    ElMessageBox.confirm(
      `Hi ${row['user']}, Are you sure you want to occupy the ${data.type} with IP address 【 ${data.ip} 】?`,
      'Release',
      {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        type: 'info'
      }
    ).then(() => {
      Boards.occBoard(row).then((res: any) => {
        if (res.code == 200) {
          reloadBoardsList()
        }
      })
    })
  } else {
    row['status'] = 'vacant'
    row['user'] = ''
    ElMessageBox.confirm(
      `Are you sure you want to release the ${data.type} with IP address 【 ${data.ip} 】?`,
      'Release',
      {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        type: 'info'
      }
    ).then(() => {
      Boards.reBoard(row).then((res: any) => {
        console.log(res, 'res')
        if (res.code == 200) {
          reloadBoardsList()
        }
      })
    })
  }
}
const delRow = (data: any) => {
  row['opearUser'] =
    LocalVue.getLocal('adminUser')?.split('"').join('') ||
    LocalVue.getLocal('user')?.split('"').join('') ||
    ''
  const { type, ip, status, remark, id, number, image } = data
  row['id'] = id
  row['type'] = type
  row['ip'] = ip
  row['number'] = number
  row['image'] = image
  row['status'] = status
  row['remark'] = remark
  ElMessageBox.confirm(
    `Are you sure you want to remove the ${data.type} with IP address【 ${data.ip} 】`,
    'Delete',
    {
      confirmButtonText: 'OK',
      cancelButtonText: 'Cancel',
      type: 'warning'
    }
  ).then(() => {
    Boards.delBoardList(row).then((res: any) => {
      if (res.code == 200) {
        reloadBoardsList()
      }
    })
  })
}
const diffTime = (time: any) => {
  const startT: any = new Date(time)
  const now: any = new Date()
  let diffStr: string = 'Occupy '
  const diff: any = now - startT
  const diffInDays = Math.floor(diff / (1000 * 60 * 60 * 24))
  const diffInHours = Math.floor((diff / (1000 * 60 * 60)) % 24)
  const diffInMinutes = Math.floor((diff % (60 * 60 * 1000)) / (60 * 1000))
  if (diffInDays > 0) {
    diffStr += `${diffInDays} day `
  }
  if (diffInHours > 0) {
    diffStr += `${diffInHours} h `
  }
  if (diffInMinutes > 0) {
    diffStr += `${diffInMinutes} min `
  }
  if (diffStr === 'Occupy ') {
    diffStr = '0 min'
  }
  return diffStr
}

const restartBoard = (data: any) => {
  const { type, ip, remark, id, number, status, image, user } = data
  row['id'] = id
  row['type'] = type
  row['ip'] = ip
  row['number'] = number
  row['image'] = image
  row['status'] = status
  row['remark'] = remark
  row['user'] = user
  row['opearUser'] =
    LocalVue.getLocal('adminUser')?.split('"').join('') ||
    LocalVue.getLocal('user')?.split('"').join('') ||
    ''
  Power.restartBoard(row).then((res: any) => {
    if (res.code == '200') {
      if (res.data) {
        const str = res.data.powerList.split('Reboot')[1]
        ElMessage({
          message: h('p', null, [h('span', null, str)])
        })
      }
    }
  })
}

// 前端不做 ping 暂时搁置
// const ping_ip = (row: any) => {
//   console.log(row.ip)
//   ElMessage({
//     type: 'warning',
//     showClose: true,
//     offset: 180,
//     duration: 12000,
//     message: 'Ping....'
//   })
//   Power.ping_ip({ ip: row.ip }).then((res: any) => {
//     if (res.code == '200') {
//       if (res.data) {
//         console.log(res.data)
//         let str = ''
//         if (res.data.success) {
//           str = res.data.success.split('\n').join('<br />')
//         } else {
//           str = res.data.error.split('\n').join('<br />')
//         }
//         ElMessageBox.alert(`${str}`, {
//           dangerouslyUseHTMLString: true
//         })
//       }
//     }
//   })
// }
const showImageDialog = (row: any) => {
  imageForm['ip'] = row.ip
  imageForm['id'] = row.id
  imageForm['opearUser'] =
    LocalVue.getLocal('adminUser')?.split('"').join('') ||
    LocalVue.getLocal('user')?.split('"').join('') ||
    ''
  imageDirState.value = true
}
const onCloseHandle = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
  imageForm['image'] = ''
  imageForm['ip'] = ''
  imageForm['id'] = ''
  imageDirState.value = false
}
const flashImage = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  console.log(imageForm)
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      reImage
        .restartImage(imageForm)
        .then((res: any) => {
          if (res.code == '200') {
            if (res.data) {
              // const str = res.data.restartImage
              ElMessage({
                showClose: true,
                offset: 180,
                duration: 12000,
                message: 'flashing....'
              })
            }
          }
        })
        .catch((err) => {
          console.log(err)
        })
      onCloseHandle(formEl)
    } else {
      console.log('error submit!', fields)
    }
  })
}
</script>

<style scoped>
a {
  margin-right: 10px;
}
.state_color {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
}
.inuse {
  background: #f56c6c;
}
.idle {
  background: #67c23a;
}
.pingStateText {
  font-size: 12px;
  color: #f56c6c;
}
::v-deep .el-divider {
  margin: 10px 0;
}
</style>
