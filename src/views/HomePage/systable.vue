<template>
  <el-table v-loading="loading" :data="tableData" stripe border style="width: 100%">
    <el-table-column fixed prop="type" label="Type" width="90" />
    <el-table-column fixed prop="ip" label="Ip" min-width="150" />
    <el-table-column prop="number" label="Hardware Rev" min-width="150" />
    <el-table-column prop="image" label="Image" min-width="120" />
    <el-table-column prop="status" label="State" width="80px" align="center">
      <template #default="scope">
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
      </template>
    </el-table-column>
    <el-table-column prop="user" label="User" width="130px">
      <template #default="scope">
        {{ scope.row.user ? scope.row.user : '-' }}
      </template>
    </el-table-column>
    <el-table-column prop="remark" label="Remark" min-width="180" />
    <el-table-column label="operate" fixed="right" width="180px" align="center">
      <template #default="scope">
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
          @click="occhandle(scope.row)"
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
      </template>
    </el-table-column>
  </el-table>
  <loginDialog
    @getBoardsList="reloadBoardsList"
    @occhandle="operaHandle"
    ref="loginDialogRef"
  ></loginDialog>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { ElMessageBox } from 'element-plus'
import { Boards } from '@/api/api'
import { LocalVue } from '@/common/utils'
import loginDialog from '@/components/loginDialog.vue'
// defineProps({
//   tableData: {
//     type: Array,
//     required: true,
//     default: []
//   }
// })
defineProps<{
  tableData: Array<object>
  loading: Boolean
  stateBtn: Boolean
}>()
const emit = defineEmits(['showDialog', 'getBoardsList'])
const editHandle = (row: any) => {
  emit('showDialog', row)
}
const row = reactive({
  id: '',
  type: '',
  ip: '',
  number: '',
  image: '',
  status: '',
  remark: '',
  user: ''
})
const loginDialogRef = ref<InstanceType<typeof loginDialog>>()
const occhandle = (data: any) => {
  const adminUser = LocalVue.getLocal('adminUser')?.split('"').join('') || ''
  console.log('adminUser', adminUser)
  const { type, ip, remark, id, number, image } = data
  row['id'] = id
  row['type'] = type
  row['ip'] = ip
  row['number'] = number
  row['image'] = image
  row['remark'] = remark
  row['status'] = 'occupy'
  row['user'] = adminUser
  if (adminUser) {
    ElMessageBox.confirm(
      `Hi ${adminUser}, Are you sure you want to occupy the ${row['type']} with IP address 【 ${row['ip']} 】?`,
      'Occupy',
      {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        type: 'info'
      }
    ).then(() => {
      Boards.occBoard(row).then((res: any) => {
        console.log(res, 'res')
        if (res.code == 200) {
          reloadBoardsList()
        }
      })
    })
  } else {
    loginDialogRef.value?.loginInit()
  }
}
const reloadBoardsList = () => {
  emit('getBoardsList', '')
}
const operaHandle = (data: any, opereState: any) => {
  if (opereState) {
    row['status'] = 'occupy'
    row['user'] = data
    Boards.occBoard(row).then((res: any) => {
      console.log(res, 'res')
      if (res.code == 200) {
        reloadBoardsList()
      }
    })
  } else {
    const { type, ip, remark, id, number, image } = data
    row['id'] = id
    row['type'] = type
    row['ip'] = ip
    row['number'] = number
    row['image'] = image
    row['status'] = 'vacant'
    row['remark'] = remark
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
      console.log(res, 'res')
      if (res.code == 200) {
        reloadBoardsList()
      }
    })
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
</style>
