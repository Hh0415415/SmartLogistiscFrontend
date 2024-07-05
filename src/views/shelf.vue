<template>
  <el-card class="transport-container">
    <template #header>
      <div class="header">
        <!--        <el-button type="primary" :icon="Plus" @click="handleSolve">解除禁用</el-button>-->
        <!--        <el-button type="danger" :icon="Delete" @click="handleForbid">禁用账户</el-button>-->
        <el-input
            style="width: 200px; margin-right: 10px"
            placeholder="请输入货架号"
            v-model="state.key"
            @change="handleOption"
            clearable
        />
        <el-button type="primary" icon="el-icon-edit" @click="searchById">查询货架信息</el-button>
        <el-button type="danger" icon="Delete" @click="deleteById">删除货架信息</el-button>
        <el-button type="danger" :icon="Delete" @click="deleteBatch()">批量删除</el-button>
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
          label="货架号"
      >
      </el-table-column>
      <el-table-column
          prop="warehouse.name"
          label="仓库名"
      >
      </el-table-column>
      <el-table-column
          prop="warehouse.position"
          label="仓库位置"
      >
        <!--          <template #default="scope">-->
        <!--            <span :style="scope.row.lockedFlag == 0 ? 'color: green;' : 'color: red;'">-->
        <!--              {{ scope.row.lockedFlag == 0 ? '正常' : '禁用' }}-->
        <!--            </span>-->
        <!--          </template>-->
      </el-table-column>
      <el-table-column

          label="剩余容量"
          :formatter="formatcapacity"
      >
        <!--          <template #default="scope">-->
        <!--            <span :style="scope.row.lockedFlag == 0 ? 'color: green;' : 'color: red;'">-->
        <!--              {{ scope.row.isDeleted == 0 ? '正常' : '注销' }}-->
        <!--            </span>-->
        <!--          </template>-->
      </el-table-column>
      <el-table-column label="操作">
        <template v-slot="{row}">
          <el-button type="primary" @click="goToShelfDetail(row.id)">
            货架详情
          </el-button>
        </template>
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
import {ElMessage, ElMessageBox} from 'element-plus'
import { Plus, Delete } from '@element-plus/icons-vue'
import axios from '@/utils/axios'
import router from "@/router";
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
const formatcapacity=(row)=>{
  return row.capacity-row.loadFactor;
}
const goToShelfDetail=(Id)=> {
  console.log(Id)
  router.push({ path: '/shelf_detail', query:{id:Id}});
  // axios.get(`/order/search/id/${orderId}`)
  //     .then(response => {
  //       // 假设响应数据中包含了需要的信息
  //       // 这里可以根据响应做一些处理，比如验证等
  //       state.tableData=[]
  //       state.tableData.push(response)
  //       console.log(state.tableData)
  //     })
  //     .catch(error => {
  //       console.error('获取订单详情失败:', error);
  //       // 可以在这里处理错误，比如显示一个错误消息
  //     });
}
// 获取轮播图列表
const getGoodList = () => {
  state.loading = true
  axios.get('/shelve/search', {

  }).then(res => {
    state.tableData = res
    state.loading = false
  }).catch(err => {
    state.tableData = err;
    console.log(err);
  })
}
const searchById = () => {
  if (state.key==null){
    getGoodList();
  }
  axios.get('/shelve/search/id/'+state.key, {

  }).then(res => {
    state.tableData=[]
    state.tableData.push(res)
    state.loading = false
  }).catch(err => {
    state.tableData = [];
    state.tableData.push(err) ;})
  console.log(1225);
  console.log(state.tableData);
}

const deleteById = () => {
  ElMessageBox.confirm('确定要删除该货架?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    if (!state.key)
      getGoodList();
    axios.delete('/shelve/delete/id/' + state.key, {}).then(res => {
      ElMessage.success('删除成功')
      state.key = null
      getGoodList()
      state.loading = false
    }).catch(err => {
      getGoodList()
      state.key = null
      ElMessage.success('删除成功')
      ;
    })
  }).catch(()=>{
    ElMessage.success('取消成功')
  })
}
const deleteBatch = (id) => {
  let params
  let success = false
  if (id) {
    params = [id]
  } else {
    if (!state.multipleSelection.length) {
      ElMessage.error('请选择项')
      return
    }
    params = state.multipleSelection.map(i => i.id)
  }
  ElMessageBox.confirm('确定要删除该货架信息?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    // 用户点击确定按钮后执行的操作
    params.forEach(param => {
      axios.delete('/shelve/delete/id/'+param,{})
      success = true

      getGoodList()
    })
    if(success){
      ElMessage.success('删除成功')
      state.key=null
      getGoodList()
    }
    // 在这里可以添加执行操作的代码
  }).catch(() => {
    // 用户点击取消按钮后执行的操作
    ElMessage.success('取消成功')
    // 在这里可以添加取消操作的代码
  });

}
//checkbox 选择项
const handleSelectionChange = (val) => {
  state.multipleSelection=val
}
// 翻页方法
const changePage = (val) => {
  state.currentPage = val
  getOrderList()
}
// 配货方法
const handleConfig = (id) => {
  let params
  // 当个配置
  if (id) {
    params = [id]
  } else {
    if (!state.multipleSelection.length) {
      console.log('state.multipleSelection', state.multipleSelection.length)
      ElMessage.error('请选择项')
      return
    }
    // 多选配置
    params = state.multipleSelection.map(i => i.orderId)
  }

  axios.put('/orders/checkDone', {
    ids: params
  }).then(() => {
    ElMessage.success('配货成功')
    getOrderList()
  })
}
// 出库方法
const handleSend = (id) => {
  let params
  if (id) {
    params = [id]
  } else {
    if (!state.multipleSelection.length) {
      ElMessage.error('请选择项')
      return
    }
    params = state.multipleSelection.map(i => i.orderId)
  }
  axios.put('/orders/checkOut', {
    ids: params
  }).then(() => {
    ElMessage.success('出库成功')
    getOrderList()
  })
}
// 关闭订单方法
const handleClose = (id) => {
  let params
  if (id) {
    params = [id]
  } else {
    if (!state.multipleSelection.length) {
      ElMessage.error('请选择项')
      return
    }
    params = state.multipleSelection.map(i => i.orderId)
  }
  axios.put('/orders/close', {
    ids: params
  }).then(() => {
    ElMessage.success('关闭成功')
    getOrderList()
  })
}
</script>