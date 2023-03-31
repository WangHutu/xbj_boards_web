<template>
  <el-table v-loading="loading" :data="tableData" stripe border style="width: 100%">
    <el-table-column prop="type" label="Type" width="120" />
    <el-table-column prop="ip" label="Ip" min-width="180" />
    <el-table-column prop="number" label="Number" min-width="150" />
    <el-table-column prop="status" label="Status" width="100px" align="center">
      <template #default="scope">
        <el-tag
          round
          effect="dark"
          :type="scope.row.status === 'vacant' ? 'success' : 'danger'"
          disable-transitions
        >
          {{ scope.row.status === 'vacant' ? 'vacant' : 'occupy' }}
        </el-tag>
      </template>
    </el-table-column>
    <el-table-column prop="user" label="User" width="160px">
      <template #default="scope">
        {{ scope.row.user ? scope.row.user : '-' }}
      </template>
    </el-table-column>
    <el-table-column prop="remark" label="Remark" min-width="180" />
    <el-table-column label="operate " width="180px" align="center">
      <template #default="scope">
        <el-link
          v-if="scope.row.status !== 'vacant'"
          type="primary"
          :underline="false"
          @click="operaHandle(scope.row, 0)"
          >Release</el-link
        >
        <el-tooltip
          v-else
          class="box-item"
          :disabled="scope.row.status === 'True'"
          effect="dark"
          content="Occupancy status unavailable"
          placement="top-start"
        >
          <el-link
            type="primary"
            :underline="false"
            :disabled="scope.row.status !== 'vacant'"
            @click="occhandle(scope.row)"
            >Occupy</el-link
          >
        </el-tooltip>

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
  status: '',
  remark: '',
  user: ''
})
const loginDialogRef = ref<InstanceType<typeof loginDialog>>()
const occhandle = (data: any) => {
  const { type, ip, remark, id, number } = data
  row['id'] = id
  row['type'] = type
  row['ip'] = ip
  row['number'] = number
  row['remark'] = remark
  loginDialogRef.value?.loginInit()
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
    // ElMessageBox.confirm(
    //   `Hi ${data},  是否要occupyIP为【 ${row['ip']} 】的 ${row['type']}?`,
    //   'Tip',
    //   {
    //     confirmButtonText: 'OK',
    //     cancelButtonText: 'Cancel',
    //     type: 'info'
    //   }
    // ).then(() => {
    //   Boards.occBoard(row).then((res: any) => {
    //     console.log(res, 'res')
    //     if (res.code == 200) {
    //       reloadBoardsList()
    //     }
    //   })
    // })
  } else {
    const { type, ip, remark, id, number } = data
    row['id'] = id
    row['type'] = type
    row['ip'] = ip
    row['number'] = number
    row['status'] = 'vacant'
    row['remark'] = remark
    row['user'] = ''
    ElMessageBox.confirm(`是否要释放IP为【 ${data.ip} 】的 ${data.type}?`, 'Tip', {
      confirmButtonText: 'OK',
      cancelButtonText: 'Cancel',
      type: 'info'
    }).then(() => {
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
  const { type, ip, status, remark, id, number } = data
  row['id'] = id
  row['type'] = type
  row['ip'] = ip
  row['number'] = number
  row['status'] = status
  row['remark'] = remark
  ElMessageBox.confirm(`是否要DelIP为【 ${data.ip} 】的 ${data.type}?`, 'Tip', {
    confirmButtonText: 'OK',
    cancelButtonText: 'Cancel',
    type: 'warning'
  }).then(() => {
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
</style>
