<template>
  <el-card class="good-container">
    <template #header>
      <!--      <div class="header">-->
      <!--        <el-button type="primary" :icon="Plus" @click="handleAdd">新增商品</el-button>-->
      <!--      </div>-->
      <el-input
          style="width: 200px; margin-right: 10px"
          placeholder="请输入车辆号"
          v-model="state.key"
          clearable
      />
      <el-button type="primary" icon="el-icon-edit" @click="searchById">查询车辆信息</el-button>
      <el-button type="danger" icon="el-icon-edit" @click="deleteById">删除车辆信息</el-button>
      &nbsp;
      <router-link to="/insertcar">
        <el-button type="primary" icon="el-icon-edit">添加车辆信息</el-button>
      </router-link>  &nbsp;
      <el-input
          style="width: 135px; margin-right: 10px"
          placeholder="请输入目的仓库号"
          v-model="state.targetWarehouse"
          clearable
      />
      <el-button type="primary" icon="el-icon-edit" @click="carDepart()">车辆出发</el-button>
      <br>
      <br>
      <el-input
          style="width: 200px; margin-right: 10px"
          placeholder="请输入驾驶员名字"
          v-model="state.name"
          clearable
      />
      <el-button type="primary" icon="el-icon-edit" @click="searchByname">查询车辆信息</el-button>

      <!--      <el-button type="danger" icon="el-icon-edit" @click="deleteById">删除车辆信息</el-button>-->
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
          label="车辆编号"
      >
      </el-table-column>
      <el-table-column
          prop="transporter"
          label="驾驶员名字"
      >
      </el-table-column>
      <el-table-column
          prop="warehouse.name"
          label="停靠仓库"
      >
      </el-table-column>

      <el-table-column
          prop="state"
          label="状态"
      >
      </el-table-column>

      <el-table-column label="操作">
        <template v-slot="{ row }">
          <el-button size="mini" type="primary" @click="carArrive(row.id)">到达</el-button>
          <el-button size="mini" type="primary" @click="upDateMap(row.id)">物流显示</el-button>
        </template>
      </el-table-column>

    </el-table>
    <!--总数超过一页，再展示分页器-->
    <el-pagination
        background
        layout="prev, pager, next"
        :total="state.total"
        :page-size="state.pageSize"
        :current-page="state.currentPage"
        @current-change="changePage"
    />
    <div id="container">
      <div id="panel"></div>
    </div>

  </el-card>
</template>

<script setup>
import { onMounted, reactive, getCurrentInstance } from 'vue'
import axios from '@/utils/axios'
import {ElMessage, ElMessageBox} from 'element-plus'
import { Plus, Delete } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'

const app = getCurrentInstance()
const { goTop } = app.appContext.config.globalProperties
const router = useRouter()
let driving = null;
const state = reactive({
  targetWarehouse: '',
  loading: false,
  tableData: [], // 数据列表
  multipleSelection: [], // 选中项
  namedata:[],
  data:{
    productId: '',
    productNum: '',
    targetWarehouseId: ''
  },
  map:'',
  total: 0, // 总条数
  key:null,
  currentMarker:'',
  currentInfoWindow:'',
  warehouses:[],
  name:'',
  currentPage: 1, // 当前页
  pageSize: 10 // 分页大小
})
// checkbox 选择项
const handleSelectionChange = (val) => {
  state.multipleSelection = val
}
const submitOrder=()=> {
  console.log(state.data)
  axios.post("/order/submit", state.data)
      .then(response => {
        console.log('Order submitted successfully:', response.data);
        // Handle success response
      })
      .catch(error => {
        console.error('Error submitting order:');
        // Handle error response
      });
};
onMounted(() => {
  getGoodList()
  loadMap()
})
//车辆出发
const carDepart = () => {
  let params
  if (!state.multipleSelection.length) {
    ElMessage.error('请选择项')
    return
  }
  params = state.multipleSelection[0].id

  axios.put('/car/setout', {
    carId: params,
    targetWarehouseId: state.targetWarehouse
  }).then(() => {
    ElMessage.success('车辆已出发')
    getGoodList()
  })
}

//车辆到达
const carArrive = (carId) => {
  axios.put('/car?carId=' + carId,).then(() => {
    ElMessage.success('车辆已到达')
    getGoodList()
  })
}
//
const getGoodList = () => {
  state.loading = true
  axios.get('/car/search', {
    params: {
      pageNumber: state.currentPage,
      pageSize: state.pageSize
    }
  }).then(res => {
    state.tableData = res
    state.loading = false
    //goTop && goTop()
  }).catch(err => {
    //state.tableData = err;
    console.log(err);
  })
}


const searchById = () => {
  if (!state.key)
    return getGoodList();
  axios.get('/car/search/id/'+state.key, {
  }).then(res => {
    state.tableData=[]
    state.tableData.push(res)
    //state.total = res.totalCount
    //state.currentPage = res.currPage
    state.loading = false
  }).catch(err => {
    state.tableData = [];
    //state.tableData.push(err) ;
    console.log(state.tableData);
  })
}

const searchByname = () => {
  if (state.name=='')
    getGoodList();
  axios.get('/car/search/name/'+state.name, {
  }).then(res => {
    state.tableData = res.list
    //state.total = res.totalCount
    //state.currentPage = res.currPage
    state.loading = false
  }).catch(err => {
    console.log(err)
    state.tableData = [];


    state.tableData.push(err) ;
    console.log(state.tableData);
    //getGoodList()

  })
  // console.log(111);
}


const deleteById = () => {
  ElMessageBox.confirm('确定要删除商品吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    if (state.key == null)
      getGoodList();
    axios.delete('/car/delete/id/' + state.key, {}).then(res => {
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

const upDateMap = (carId) => {
  axios.get('/car/search/id/' + carId).then(res => {
    let car = res
    console.log(car)
    let warehouse = car.warehouse
    let lngLat = warehouse.lngLat
    let lng = lngLat.lng
    let lat = lngLat.lat
    if (state.map) {
      state.map.setCenter([lng, lat])
      ElMessage.success('物流更新成功')
      if(car.targetWarehouse){
        planRouteForCar(car)
      }else {
        driving.clear()
      }
    }
  }).catch(err => {
    console.log(err)
    ElMessage.error('请选择物流！')
  })
}

const addMarkersAndInfoWindows = (warehouses) => {
  warehouses.forEach(warehouse => {
    let lngLat = warehouse.lngLat;
    let lng = lngLat.lng;
    let lat = lngLat.lat;

    // 创建新的 marker
    const marker = new AMap.Marker({
      position: new AMap.LngLat(lng, lat),
      icon: new AMap.Icon({
        size: new AMap.Size(20, 30),
        image: '//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-default.png',
        imageSize: new AMap.Size(20, 30)
      }),
      offset: new AMap.Pixel(-0, -0),
      anchor: 'center'
    });

    // 创建新的 infoWindow
    const infoWindow = new AMap.InfoWindow({
      isCustom: true,
      content: `<div class="cus_info_window">仓库名：${warehouse.name}, 仓库位置：${warehouse.position}</div>`,
      offset: new AMap.Pixel(16, -45)
    });

    // 在 marker 上添加点击事件，切换 infoWindow 的显示/隐藏
    marker.on('click', function (e) {
      if (state.currentInfoWindow && state.currentInfoWindow.getIsOpen()) {
        state.currentInfoWindow.close();
      } else {
        infoWindow.open(state.map, e.target.getPosition());
        state.currentInfoWindow = infoWindow;
      }
    });

    state.map.add(marker);
  });
};

const loadMap = () => {
  state.mapVisible = true

  loadAMapScript().then(() => {
    state.map = new AMap.Map("container", {
      zoom: 14,
      center: [113.53591,34.817077],
      resizeEnable: true
    })
    axios.get("/warehouse/search").then(res=>{
      console.log(res)
      state.warehouses=res
      addMarkersAndInfoWindows(state.warehouses)
    })
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

const planRoute = (start, end) => {
  AMap.plugin('AMap.Driving', function() {
    if (driving) {
      driving.clear();
    }
    driving = new AMap.Driving({
      map: state.map,
      policy: 5,
      panel: 'panel'
    })
    // 规划驾车路线
    driving.search(start, end, function(status, result) {
          if (status === 'complete') {
            console.log('路线规划成功')
          } else {
            console.error('路线规划失败：', result)
          }
        }
    )
  })
}

const planRouteForCar = (car) => {
  const start = new AMap.LngLat(car.warehouse.lngLat.lng, car.warehouse.lngLat.lat)
  const end = new AMap.LngLat(car.targetWarehouse.lngLat.lng, car.targetWarehouse.lngLat.lat)
  planRoute(start, end)
}
</script>

<style scoped>
.good-container {
  min-height: 100%;
}
.el-card.is-always-shadow {
  min-height: 100%!important;
}
</style>
<style>
#container {
  width: 100%;
  height: 400px;
  position: relative;
}
#panel {
  width: 300px;
  height: 100%;
  overflow-y: auto;
  background-color: rgba(255, 255, 255, 0.5);
  border-left: 1px solid #ccc;
  position: absolute;
  top: 0;
  right: 0;
  z-index: 1000;
}
</style>