<template>
  <el-card class="transport-container">
    <template #header>
      <div class="header">
        <p>仓库编号:{{id}}    &nbsp;&nbsp; 仓库名称:{{state.Date.join('')}}</p>
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
          prop="id"
          label="货架号"
      >
      </el-table-column>
      <el-table-column
          label="货架位置"
          :formatter="formatPosition"
      >
      </el-table-column>


      <el-table-column
          prop="capacity"
          label="剩余容量"
      >
      </el-table-column>
      <el-table-column
          prop="loadFactor"
          label="负载因子"
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
const warehouse_name=()=>{
  axios.get('/warehouse/search/id/'+id, {
  }).then(res => {

    state.Date.push(res)
    console.log(state.Date)
    state.loading = false
  }).catch(err => {
  })
}
onMounted(() => {
  console.log( id);
  axios.get(`/shelve/search/${id}`)
      .then(response => {
        state.tableData=[]
        state.tableData=response
        console.log(state.tableData)
      })
      .catch(error => {
        console.error('获取订单详情失败:', error);
        // 可以在这里处理错误，比如显示一个错误消息
      });
  axios.get('/warehouse/search/id/'+id, {
  }).then(res => {
    state.Date.push(res.name)
    console.log(state.Date)
    state.loading = false
  }).catch(err => {
  })

})
// 获取轮播图列表

</script>