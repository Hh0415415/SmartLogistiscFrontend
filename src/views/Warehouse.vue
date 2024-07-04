<template>
  <el-card class="transport-container">
    <template #header>
      <div class="header">
        <!--        <el-button type="primary" :icon="Plus" @click="handleSolve">解除禁用</el-button>-->
        <!--        <el-button type="danger" :icon="Delete" @click="handleForbid">禁用账户</el-button>-->
        <el-input
            style="width: 200px; margin-right: 10px"
            placeholder="请输入仓库号"
            v-model="state.key"
            @change="handleOption"
            clearable
        />
        <el-button type="primary" icon="el-icon-edit" @click="searchById">查询仓库</el-button>
        <el-button type="danger" icon="el-icon-edit" @click="deleteById">删除仓库</el-button>
      </div>
    </template>
    <el-table
        :load="state.loading"
        :data="state.tableData"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange">

      <el-table-column
          type="selection"
          width="55">
      </el-table-column>
      <el-table-column
          prop="id"
          label="仓库号"
      >
      </el-table-column>
      <el-table-column
          prop="name"
          label="仓库名"
      >
      </el-table-column>
      <el-table-column
          prop="position"
          label="仓库位置"
      >
        <!--          <template #default="scope">-->
        <!--            <span :style="scope.row.lockedFlag == 0 ? 'color: green;' : 'color: red;'">-->
        <!--              {{ scope.row.lockedFlag == 0 ? '正常' : '禁用' }}-->
        <!--            </span>-->
        <!--          </template>-->
      </el-table-column>
      <el-table-column
          prop="capacity"
          label="剩余容量"
      >
        <!--          <template #default="scope">-->
        <!--            <span :style="scope.row.lockedFlag == 0 ? 'color: green;' : 'color: red;'">-->
        <!--              {{ scope.row.isDeleted == 0 ? '正常' : '注销' }}-->
        <!--            </span>-->
        <!--          </template>-->
      </el-table-column>
      <!--        <el-table-column-->
      <!--            prop="createTime"-->
      <!--            label="备注"-->
      <!--        >-->
      <!--        </el-table-column>-->
    </el-table>
  </el-card>
</template>

<script setup>
import {onMounted, reactive, ref} from 'vue'
import Table from '@/components/Table.vue'
import { ElMessage } from 'element-plus'
import { Plus, Delete } from '@element-plus/icons-vue'
import axios from '@/utils/axios'
const state = reactive({
  loading: false,
  tableData: [], // 数据列表
  total: 0, // 总条数
  currentPage: 1, // 当前页
  pageSize: 10 // 分页大小
})
onMounted(() => {
  getGoodList()
})
// 获取轮播图列表
const getGoodList = () => {
  state.loading = true
  axios.get('/warehouse/search', {
    params: {
      pageNumber: state.currentPage,
      pageSize: state.pageSize
    }
  }).then(res => {
    state.tableData = res;
  }).catch(err => {
    console.log(err);
  })
}
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