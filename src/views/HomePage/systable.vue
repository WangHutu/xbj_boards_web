<template>
  <el-table :data="tableData" stripe border style="width: 100%">
    <el-table-column prop="type" label="Type" width="120" />
    <el-table-column prop="ip" label="Ip" min-width="180" />
    <el-table-column prop="status" label="Status" width="100px" align="center">
      <template #default="scope">
        <el-tag
          round
          effect="dark"
          :type="scope.row.status === 'True' ? 'success' : 'danger'"
          disable-transitions
        >
          {{ scope.row.status === 'True' ? 'vacant' : 'occupy' }}
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
          <el-link type="primary" :underline="false" :disabled="scope.row.status !== 'True'"
            >占用</el-link
          >
        </el-tooltip>

        <el-link type="primary" :underline="false" @click="editHandle(scope.row)">编辑</el-link>
        <el-link type="primary" :underline="false" :disabled="scope.row.status !== 'True'"
          >删除</el-link
        >
      </template>
    </el-table-column>
  </el-table>
</template>

<script setup lang="ts">
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
const emit = defineEmits(['showDialog'])
const editHandle = (row:any) => {
  emit('showDialog', row)
}
</script>
