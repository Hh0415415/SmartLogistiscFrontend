<template>
  <el-card class="transport-container">
    <template #header>
      <div class="header">
        <el-button type="primary" :icon="Plus" @click="handleSolve">解除禁用</el-button>
        <el-button type="danger" :icon="Delete" @click="handleForbid">禁用账户</el-button>
      </div>
    </template>
    <Table
      action='/transport'
      ref="table"
    >
      <template #column>
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          prop="nickName"
          label="订单号"
        >
        </el-table-column>
        <el-table-column
          prop="loginName"
          label="车辆号"
        >
        </el-table-column>
        <el-table-column
          label="驾驶员编号"
        >
          <template #default="scope">
            <span :style="scope.row.lockedFlag == 0 ? 'color: green;' : 'color: red;'">
              {{ scope.row.lockedFlag == 0 ? '正常' : '禁用' }}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          label="运输状态"
        >
          <template #default="scope">
            <span :style="scope.row.lockedFlag == 0 ? 'color: green;' : 'color: red;'">
              {{ scope.row.isDeleted == 0 ? '正常' : '注销' }}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="备注"
        >
        </el-table-column>
      </template>
    </Table>
  </el-card>
</template>

<script setup>
import { ref } from 'vue'
import Table from '@/components/Table.vue'
import { ElMessage } from 'element-plus'
import { Plus, Delete } from '@element-plus/icons-vue'
import axios from '@/utils/axios'

let table = ref(null)
const handleSolve = () => {
if (!table.value.state.multipleSelection.length) {
  ElMessage.error('请选择项')
  return
}
axios.put(`/users/0`, {
  ids: table.value.state.multipleSelection.map(item => item.userId)
}).then(() => {
  ElMessage.success('解除成功')
  table.value.getList()
})
}
const handleForbid = () => {
if (!table.value.state.multipleSelection.length) {
  ElMessage.error('请选择项')
  return
}
axios.put(`/users/1`, {
  ids: table.value.state.multipleSelection.map(item => item.userId)
}).then(() => {
  ElMessage.success('禁用成功')
  table.value.getList()
})
}
</script>

<style>

</style>