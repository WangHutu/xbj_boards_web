<template>
  <el-dialog
    class="log"
    append-to-body
    :model-value="dialogLogVisible"
    title="Flash log"
    :close-on-click-modal="false"
    :show-close="false"
    width="610px"
  >
    <div v-loading="logLoading">
      <el-scrollbar height="380px">
        <pre v-html="logText"></pre>
      </el-scrollbar>
    </div>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="onCloseHandle()">close</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { reImage } from '@/api/api'
const logText = ref('')
const logLoading = ref(true)
const dialogLogVisible = ref(false)
const onCloseHandle = () => {
  logText.value = ''
  dialogLogVisible.value = false
}
const dilogInit = (ip: any): void => {
  logLoading.value = true
  dialogLogVisible.value = true
  reImage.getFlashLog({ ip }).then((res: any) => {
    logText.value = res.data.flashLog
    logLoading.value = false
  })
}
defineExpose({
  dilogInit
})
</script>

<style scoped>
.el-button--text {
  margin-right: 15px;
}

.dialog-footer button:first-child {
  margin-right: 10px;
}
</style>
