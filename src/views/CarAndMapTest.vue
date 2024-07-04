<template>
  <el-card class="good-container">
    <template #header>
      <el-input
          style="width: 200px; margin-right: 10px"
          placeholder="请输入车辆号"
          v-model="state.key"
          clearable
      />
      <el-button type="primary" icon="el-icon-edit" @click="searchById">查询车辆信息</el-button>
      <el-button type="danger" icon="el-icon-edit" @click="deleteById">删除车辆信息</el-button>
      <router-link to="/insertcar">
        <el-button type="primary" icon="el-icon-edit">添加车辆信息</el-button>
      </router-link>
      <br>
      <br>
      <el-input
          style="width: 200px; margin-right: 10px"
          placeholder="请输入驾驶员名字"
          v-model="state.name"
          clearable
      />
      <el-button type="primary" icon="el-icon-edit" @click="searchByname">查询车辆信息</el-button>
      <el-button type="primary" @click="loadMap">加载地图</el-button>
    </template>

    <el-table
        :load="state.loading"
        :data="state.tableData"
        tooltip-effect="dark"
        style="width: 100%"
    >
      <el-table-column prop="id" label="车辆编号"></el-table-column>
      <el-table-column prop="transporter" label="驾驶员名字"></el-table-column>
      <el-table-column prop="warehouse.name" label="停靠仓库"></el-table-column>
      <el-table-column prop="state" label="状态"></el-table-column>
    </el-table>
    <el-pagination
        background
        layout="prev, pager, next"
        :total="state.total"
        :page-size="state.pageSize"
        :current-page="state.currentPage"
        @current-change="changePage"
    />
    <div id="container" v-if="state.mapVisible" style="height: 400px;"></div>
  </el-card>
</template>

<script setup>
import { onMounted, reactive, getCurrentInstance } from 'vue'
import axios from '@/utils/axios'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useRouter } from 'vue-router'

const app = getCurrentInstance()
const { goTop } = app.appContext.config.globalProperties
const router = useRouter()
const state = reactive({
  loading: false,
  tableData: [],
  data: {
    productId: '',
    productNum: '',
    targetWarehouseId: ''
  },
  total: 0,
  key: null,
  name: '',
  currentPage: 1,
  pageSize: 10,
  mapVisible: false
})

const submitOrder = () => {
  axios.post("/order/submit", state.data)
      .then(response => {
        console.log('Order submitted successfully:', response.data);
      })
      .catch(error => {
        console.error('Error submitting order:', error);
      });
}

const getGoodList = () => {
  state.loading = true
  axios.get('/car/search', {
    params: {
      pageNumber: state.currentPage,
      pageSize: state.pageSize
    }
  }).then(res => {
    state.tableData = res.list
    state.total = res.totalCount
    state.currentPage = res.currPage
    state.loading = false
    goTop && goTop()
  }).catch(err => {
    state.tableData = err;
    console.log(err);
  })
}

const searchById = () => {
  if (!state.key) return getGoodList()
  axios.get('/car/search/id/' + state.key)
      .then(res => {
        state.tableData = res.list
        state.loading = false
      })
      .catch(err => {
        state.tableData = [];
        state.tableData.push(err);
        console.log(state.tableData);
      })
}

const searchByname = () => {
  if (!state.name) return getGoodList()
  axios.get('/car/search/name/' + state.name)
      .then(res => {
        state.tableData = res.list
        state.loading = false
      })
      .catch(err => {
        state.tableData = [];
        state.tableData.push(err);
        console.log(state.tableData);
      })
}

const deleteById = () => {
  ElMessageBox.confirm('确定要删除该车辆信息吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    if (!state.key) return getGoodList()
    axios.delete('/car/delete/id/' + state.key)
        .then(res => {
          ElMessage.success('删除成功')
          state.key = null
          getGoodList()
          state.loading = false
        })
        .catch(err => {
          getGoodList()
          state.key = null
          ElMessage.success('删除成功')
        })
  }).catch(() => {
    ElMessage.success('取消成功')
  })
}

const handleAdd = () => {
  router.push({ path: '/add' })
}

const handleEdit = (id) => {
  router.push({ path: '/add', query: { id } })
}

const changePage = (val) => {
  state.currentPage = val
  getGoodList()
}

const handleStatus = (id, status) => {
  axios.put(`/goods/status/${status}`, {
    ids: id ? [id] : []
  }).then(() => {
    ElMessage.success('修改成功')
    getGoodList()
  })
}

const loadMap = () => {
  state.mapVisible = true
  let currentPosition
  let targetPosition
  axios.get('/car/search/id/'+state.key).then(res=>{
    currentPosition = res.data.warehouse.position
    targetPosition = res.data.targetWarehouse.position
  }).catch(err=>{
    console.log(err)
  })
  loadAMapScript().then(() => {
    const map = new AMap.Map("container", {
      zoom: 13,
      center: [116.39, 39.92],
      resizeEnable: true
    })

    if (currentPosition) {
      const marker1 = new AMap.Marker({
        position: new AMap.LngLat(116.39, 39.92),
        icon: '//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-default.png',
        offset: new AMap.Pixel(-0, -0)
      })
      map.add(marker1)

      const infoWindow1 = new AMap.InfoWindow({
        isCustom: true,
        content: `<div class="cus_info_window">当前位置：${currentPosition}</div>`,
        offset: new AMap.Pixel(16, -45)
      })

      marker1.on('click', function (e) {
        infoWindow1.open(map, e.target.getPosition())
      })
    }

    if (targetPosition) {
      const marker2 = new AMap.Marker({
        position: new AMap.LngLat(116.39, 39.92),
        icon: '//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-default.png',
        offset: new AMap.Pixel(-0, -10)
      })
      map.add(marker2)

      const infoWindow2 = new AMap.InfoWindow({
        isCustom: true,
        content: `<div class="cus_info_window">目标位置：${targetPosition}</div>`,
        offset: new AMap.Pixel(16, -45)
      })

      marker2.on('click', function (e) {
        infoWindow2.open(map, e.target.getPosition())
      })
    }
  }).catch(err => {
    console.error('Error loading AMap script:', err)
  })
}


const loadAMapScript = () => {
  return new Promise((resolve, reject) => {
    if (typeof AMap !== 'undefined') {
      resolve()
      return
    }

    window._AMapSecurityConfig = {
      securityJsCode: "5f7752579675ac312515981df9425f82"
    }

    const script = document.createElement('script')
    script.src = 'https://webapi.amap.com/maps?v=2.0&key=f49d3c320f244055cce066494c7e0e03'
    script.async = true
    script.onload = () => resolve()
    script.onerror = (err) => reject(err)
    document.head.appendChild(script)
  })
}

onMounted(() => {
  getGoodList()
})
</script>

<style scoped>
.good-container {
  min-height: 100%;
}
.el-card.is-always-shadow {
  min-height: 100%!important;
}
#container {
  height: 400px;
  width: 100%;
}
</style>
