<template>
  <el-card class="order-container">
    <template #header>
      <div class="header">

      </div>
    </template>
    <el-table
        :load="state.loading"
        :data="state.tableData"
        tooltip-effect="dark"
        style="width: 100%">
      <el-table-column
          prop="order.id"
          label="订单号"
      >
      </el-table-column>

      <el-table-column
          prop="order.product.name"
          label="商品名称"
      >
      </el-table-column>
      <el-table-column
          prop="order.productNum"
          label="商品数量"
      >
      </el-table-column>
      <el-table-column
          prop="order.product.price"
          label="商品单价"
      >
      </el-table-column>
      <el-table-column
          prop="order.targetWarehouse.name"
          label="目标仓库"
      >
      </el-table-column>
      <el-table-column
          prop="orderPrice"
          label="订单总价"
      >
      </el-table-column>
    </el-table>



  </el-card>
</template>

<script setup>
import { onMounted, reactive } from 'vue'
import { useRoute } from 'vue-router'
const route = useRoute()
const orderid  = route.query.id
import axios from '@/utils/axios'
import {Delete, HomeFilled} from "@element-plus/icons-vue";
const state = reactive({
  data: {},
  tableData: []
})
onMounted(() => {
  // axios.get(`/order/search/${id}`).then(res => {
  //   console.log(res)
  //   state.data = res
  //   state.tableData = res.newBeeMallOrderItemVOS
  // })
  //let id = route.params.id

  console.log( orderid);
  axios.get(`/order/search/id/${orderid}`)
      .then(response => {
        // 假设响应数据中包含了需要的信息
        // 这里可以根据响应做一些处理，比如验证等
        state.tableData=[]
        state.tableData.push(response)
        console.log(state.tableData)
      })
      .catch(error => {
        console.error('获取订单详情失败:', error);
        // 可以在这里处理错误，比如显示一个错误消息
      });
})
</script>

<style scoped>
.data {
  display: flex;
  margin-bottom: 50px;
}
.data .data-item {
  flex: 1;
  margin: 0 10px;
}
.el-table {
  border: 1px solid #EBEEF5;
  border-bottom: none;
}
.has-gutter th {
  border-right: 1px solid #EBEEF5;
}

.has-gutter th:last-child {
  border-right: none;
}
.el-table__row td {
  border-right: 1px solid #EBEEF5;
}
.el-table__row td:last-child {
  border-right: none;
}
</style>