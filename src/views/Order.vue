<template>
  <el-card class="order-container">
    <template #header>
      <div class="header">
        <el-input
          style="width: 200px; margin-right: 10px"
          placeholder="请输入订单号"
          v-model="State.id"
          @change="handleOption"
          clearable
          />
        <el-button type="primary" icon="el-icon-edit" @click="searchById">查询订单</el-button>
        <el-button type="danger" :icon="Delete" @click="deleteOrder()">删除订单</el-button>
        <el-button type="danger" :icon="Delete" @click="deleteBatch()">批量删除</el-button>
        <br><br>
        <el-input
            style="width: 200px; margin-right: 10px"
            placeholder="请输入仓库号"
            v-model="State.inStorageWarehouseId"
            @change="handleOption"
            clearable
        />
        <el-button type="primary" :icon="HomeFilled" @click="inStorage()">入库</el-button>
        &nbsp;
        <el-input
            style="width: 200px; margin-right: 10px"
            placeholder="请输入车辆号"
            v-model="State.carId"
            @change="handleOption"
            clearable
        />


        <el-button type="primary" :icon="HomeFilled" @click="outStorage()">出库</el-button>

      </div>
    </template>
    <el-table
      :load="State.loading"
      :data="State.tableData"
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="handleSelectionChange">
      <el-table-column
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column
        prop="order.id"
        label="订单号"
      >
      </el-table-column>
      <el-table-column
          prop="orderPrice"
          label="订单价格"
      >
      </el-table-column>
<!--      <el-table-column-->
<!--        prop="totalPrice"-->
<!--        label="订单总价"-->
<!--      >-->
<!--      </el-table-column>-->
      <el-table-column
        prop="order.state"
        label="订单状态"
      >
<!--        <template #default="scope">-->
<!--          <span>{{ $filters.orderMap(scope.row.orderStatus) }}</span>-->
<!--        </template>-->
      </el-table-column>
<!--      <el-table-column-->
<!--        prop="payType"-->
<!--        label="支付方式"-->
<!--      >-->
<!--        <template #default='scope'>-->
<!--          <span v-if="scope.row.payType == 1">微信支付</span>-->
<!--          <span v-else-if="scope.row.payType == 2">支付宝支付</span>-->
<!--          <span v-else>未知</span>-->
<!--        </template>-->
<!--      </el-table-column>-->
      <el-table-column
        prop="order.createTime"
        label="创建时间"
      >
      </el-table-column>
      <el-table-column
          prop="order.updateTime"
          label="完成时间"
      >
      </el-table-column>
      <el-table-column label="操作">
        <template v-slot="{row}">

          <el-button type="primary" @click="goToOrderDetail(row.order.id)">
            订单详情
          </el-button>

        </template>
      </el-table-column>


    </el-table>
<!--    <el-pagination-->
<!--      background-->
<!--      layout="prev, pager, next"-->
<!--      :total="state.total"-->
<!--      :page-size="state.pageSize"-->
<!--      :current-page="state.currentPage"-->
<!--      @current-change="changePage"-->
<!--    />-->
  </el-card>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'
import {ElMessage, ElMessageBox} from 'element-plus'
import { HomeFilled, Delete } from '@element-plus/icons-vue'
import axios from '@/utils/axios'
import OrderDetail from "@/views/OrderDetail.vue";
import { createApp } from 'vue'
import router from '@/router'
const State = reactive({
  loading: false,
  tableData: [], // 数据列表
  multipleSelection: [], // 选中项
  inStorageWarehouseId: '',
  carId: ''
  //total: 0, // 总条数
  ///currentPage: 1, // 当前页
  //pageSize: 10, // 分页大小
  //productNum: '', // 订单号
  //state: '', // 订单状态
  //订单状态筛选项默认值
  // options: [{
  //   value: '',
  //   label: '全部'
  // }, {
  //   value: 0,
  //   label: '待支付'
  // }, {
  //   value: 1,
  //   label: '已支付'
  // }, {
  //   value: 2,
  //   label: '配货完成'
  // }, {
  //   value: 3,
  //   label: '出库成功'
  // }, {
  //   value: 4,
  //   label: '交易成功'
  // }, {
  //   value: -1,
  //   label: '手动关闭'
  // }, {
  //   value: -2,
  //   label: '超时关闭'
  // }, {
  //   value: -3,
  //   label: '商家关闭'
  // }]
})
// 初始化获取订单列表
onMounted(() => {
  getOrderList()
})
const goToOrderDetail=(orderId)=> {
  console.log(orderId)
  router.push({ path: '/order_detail', query:{id:orderId}});
}
// 获取列表方法
const getOrderList = () => {
  axios.get('/order/search', {
    params: {
      //pageNumber: state.currentPage,
      //pageSize: state.pageSize,
      //productNum: State.productNum,
      //state: State.state
    }
  }).then(res => {
    State.tableData =[]
    State.tableData = res
    //state.total = res.totalCount
    //state.currentPage = res.currPage
    //State.loading = false
  }).catch(err => {
    console.error(err);
  })
}
// 触发过滤项方法
// const handleOption = () => {
//   state.currentPage = 1
//   getOrderList()
//}
// checkbox 选择项
const handleSelectionChange = (val) => {
  State.multipleSelection = val
}
// // 翻页方法
// const changePage = (val) => {
//   state.currentPage = val
//   getOrderList()
// }
// 查询方法
const searchById = () => {
  if(!State.id) getOrderList();
  else {
    axios.get('/order/search/id/'+State.id,{
    }).then(res => {
      State.tableData = [];
      State.tableData.push(res);
      //state.total = res.totalCount
      //state.currentPage = res.currPage
      //State.loading = false
    }).catch(err => {
      console.log(test);
    })
  }
}
// 批量删除方法
const deleteBatch = (id) => {
  let params
  let success = false
  if (id) {
    params = [id]
  } else {
    if (!State.multipleSelection.length) {
      ElMessage.error('请选择项')
      return
    }
    params = State.multipleSelection.map(i => i.order.id)
  }
  ElMessageBox.confirm('确定要删除订单吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    // 用户点击确定按钮后执行的操作
    params.forEach(param => {
      axios.delete('/order/delete/id/'+param,{})
      success = true
      getOrderList()
    })
    if(success){
      ElMessage.success('删除成功')
      getOrderList()
    }
    // 在这里可以添加执行操作的代码
  }).catch(() => {
    // 用户点击取消按钮后执行的操作
    ElMessage.success('取消成功')
    // 在这里可以添加取消操作的代码
  });

}

//出库方法
const outStorage = (id) => {
  let params
  if (id) {
    params = [id]
  } else {
    if (!State.multipleSelection.length) {
      ElMessage.error('请选择项')
      return
    }
    params = State.multipleSelection.map(i => i.order.id)
  }
  axios.put('/warehouse/outbound', {
    orderIds: params,
    carId: State.carId
  }).then(res=>{
    ElMessage.success('出库成功')
    getOrderList()
  }).catch((err) => {
    ElMessage.warning('出库失败')
    console.error(err);
  })
}
//入库方法
const inStorage = (id) => {
  let params
  if (id) {
    params = [id]
  } else {
    if (!State.multipleSelection.length) {
      ElMessage.error('请选择项')
      return
    }
    params = State.multipleSelection.map(i => i.order.id)
  }
  axios.put('/warehouse/inbound', {
    orderIds: params,
    warehouseId: State.inStorageWarehouseId
  }).then(res => {
    ElMessage.success('入库成功')
    getOrderList()
  }).catch((err) => {
    console.log(222);
    ElMessage.warning('入库失败')
  })
}


// 删除订单方法
const deleteOrder = (id) => {
    ElMessageBox.confirm('确定要删除订单吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    // 用户点击确定按钮后执行的操作
    if(State.id == null) getOrderList();
    axios.get('/order/search/id/'+State.id,{
    }).then(res => {
      State.tableData = res.list
    }).then(() => {
      axios.delete('/order/delete/id/'+State.id,)
      State.id=null
      getOrderList()
    }).then( ()=> {
      ElMessage.success('删除成功')
      getOrderList()
      State.id=null
    })
    // 在这里可以添加执行操作的代码
  }).catch(() => {
    // 用户点击取消按钮后执行的操作
      ElMessage.success('取消成功')
    // 在这里可以添加取消操作的代码
  });

}
</script>