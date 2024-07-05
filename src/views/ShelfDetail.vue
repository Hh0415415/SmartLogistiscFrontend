<template>
  <el-card class="transport-container">
    <template #header>
      <div class="header">
        <p>货架编号:{{id}}</p>
      </div>
    </template>
    <el-table
        :load="state.loading"
        :data="state.tableData"
        tooltip-effect="dark"
        style="width: 100%"
    >
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
          prop="order.product.name"
          label="商品名"
      >
      </el-table-column>
      <el-table-column
          prop="order.productNum"
          label="商品数量"
      >

      </el-table-column>
      <el-table-column
          prop="order.shelve.warehouse.name"
          label="当前仓库"
      >

      </el-table-column>
      <el-table-column
          prop="order.shelve.warehouse.position"
          label="当前位置"
      >
      </el-table-column>
      <el-table-column
          prop="order.targetWarehouse.name"
          label="目标仓库"
      >
      </el-table-column>
      <el-table-column
          prop="order.state"
          label="订单状态"
      >
      </el-table-column>
    </el-table>
  </el-card>
</template>
<script setup>

import axios from '@/utils/axios'
import router from "@/router";
import { onMounted, reactive } from 'vue'
import { useRoute } from 'vue-router'
import {Delete, Plus} from "@element-plus/icons-vue";
const route = useRoute()
const id  = route.query.id

const state = reactive({
  loading: false,
  tableData: []
  , // 数据列表
  Date:[],
  name:'',
  total: 0, // 总条数
  currentPage: 1, // 当前页
  pageSize: 10 // 分页大小
})
const formatPosition=(row)=>{
  return `${row.posX},${row.posY}`;
}
onMounted(() => {
  console.log( id);
  axios.get(`/order/search/shelveId/${id}`)
      .then(response => {
        state.tableData=[]
        state.tableData=response
        console.log(state.tableData)
      })
      .catch(error => {
        console.error('获取订单详情失败:', error);
        // 可以在这里处理错误，比如显示一个错误消息
      });
})
// 获取轮播图列表

</script>