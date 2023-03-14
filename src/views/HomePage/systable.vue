<template>
  <el-table :data="tableData" stripe border style="width: 100%">
    <el-table-column prop="type" label="Type" width="120" />
    <el-table-column prop="ip" label="Ip" min-width="180" />
    <el-table-column prop="status" label="Status" width="100px" align="center">
      <template #default="scope">
        <el-tag
          round
          effect="dark"
          :type="scope.row.status === 'vacant' ? 'success' : 'danger'"
          disable-transitions
        >
          {{ scope.row.status === 'vacant' ? "空闲" : "占用" }}
        </el-tag>
      </template>
    </el-table-column>
    <el-table-column prop="user" label="User" width="160px">
      <template #default="scope">
        {{ scope.row.user ? scope.row.user : '-' }}
      </template>
    </el-table-column>
    <el-table-column prop="remark" label="Remark" min-width="180" />
    <el-table-column label="operate " width="150px" align="center">
      <template #default="scope">
        <el-tooltip
          class="box-item"
          :disabled="scope.row.status === 'True'"
          effect="dark"
          content="Occupancy status unavailable"
          placement="top-start"
        >
          <el-link type="primary" :underline="false" :disabled="scope.row.status !== 'vacant'"
            >占用</el-link
          >
        </el-tooltip>

        <el-link type="primary" :underline="false" @click="editHandle(scope.row)">编辑</el-link>
        <el-link type="primary" :underline="false" :disabled="scope.row.status !== 'vacant'" @click="delRow(scope.row)"
          >删除</el-link
        >
      </template>
    </el-table-column>
  </el-table>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { ElMessageBox } from 'element-plus'
import { Boards } from '@/api/api'
// defineProps({
//   tableData: {
//     type: Array,
//     required: true,
//     default: []
//   }
// })
defineProps<{
  tableData: Array<object>
}>()
const emit = defineEmits(['showDialog', 'getBoardsList'])
const editHandle = (row:any) => {
  emit('showDialog', row)
}
const row = reactive({
  id: '',
  type: '',
  ip: '',
  status: '空闲',
  remark: ''
})
const delRow = (data: any) => {
  const { type, ip, status, remark, id } = data
  row['id'] = id
  row['type'] = type
  row['ip'] = ip
  row['status'] = status
  row['remark'] = remark
  ElMessageBox.confirm(`是否要删除IP为【 ${data.ip} 】的 ${data.type}?`, 'Warning', {
    confirmButtonText: 'OK',
    cancelButtonText: 'Cancel',
    type: 'warning'
  }).then(() => {
    Boards.delBoardList(row).then((res:any)=>{
      console.log(res, 'res')
      if (res.code == 200) {
        emit('getBoardsList', '')
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
