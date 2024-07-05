<template>
  <el-card class="good-container">
    <template #header>
      <el-input
          style="width: 200px; margin-right: 10px"
          placeholder="请输入商品号"
          v-model="state.key"
          clearable
      />
      <el-button type="primary" icon="el-icon-edit" @click="searchById">查询商品信息</el-button>
      <el-button type="danger" icon="el-icon-edit" @click="deleteById">删除商品信息</el-button>
      &nbsp;
      <br><br>

      <router-link to="/addorder">
        <el-button type="primary">
          <el-icon>
            <AddOrder />
          </el-icon>
          添加订单
        </el-button>
      </router-link>
      &nbsp; <router-link to="/add">
      <el-button type="primary">
        <el-icon>
          <Add />
        </el-icon>
        添加商品
      </el-button>
    </router-link>
      &nbsp;
      <router-link to="/updategood">
        <el-button type="primary">
          <el-icon>
            <UpdateGood />
          </el-icon>
          修改商品
        </el-button>
      </router-link>

    </template>
    <el-table
        :load="state.loading"
        :data="state.tableData"
        tooltip-effect="dark"
        style="width: 100%"
    >
      <el-table-column
          prop="id"
          label="商品编号"
      >
      </el-table-column>
      <el-table-column
          prop="name"
          label="商品类型"
      >
      </el-table-column>
      <el-table-column
          prop="mallName"
          label="商品型号"
      >
      </el-table-column>

      <el-table-column
          prop="price"
          label="商品价格"
      >
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
  </el-card>
  <!--  <DialogInsertOrser ref="insertcliclk"/>-->
</template>
<script setup>
import {onMounted, reactive, getCurrentInstance, ref} from 'vue'
import axios from '@/utils/axios'
import {ElMessage, ElMessageBox} from 'element-plus'
import { Plus, Delete } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'

const insertcliclk =ref()
const app = getCurrentInstance()
const { goTop } = app.appContext.config.globalProperties
const router = useRouter()
const state = reactive({
  loading: false,
  dialogFormVisible:false,
  formLabelWidth: '120px',
  tableData: [], // 数据列表
  data:{
    productId: '',
    productNum: '',
    targetWarehouseId: ''
  },
  form: {
    name: '',
    region: '',
    date1: '',
    date2: '',
    delivery: false,
    type: [],
    resource: '',
    desc: ''
  },
  total: 0, // 总条数
  key:null,
  currentPage: 1, // 当前页
  pageSize: 10 // 分页大小
})

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
})
// 获取轮播图列表
const getGoodList = () => {
  state.loading = true
  axios.get('/product/search'
  ).then(res => {
    state.tableData=[]
    state.tableData = res
    console.log(state.tableData)
    //state.tableData = res.list;
  }).catch(err => {
    state.tableData=err
    state.loading = false
  })
}
const searchById = () => {
  if (!state.key){
    getGoodList();
  }
  axios.get('/product/search/id/'+state.key, {
  }).then(res => {
    state.tableData=[];
    state.tableData.push(res);
    console.log(state.tableData)
    state.loading = false
  }).catch(err => {
    //state.tableData = [];
    //state.tableData.push(err)
  })
}
const deleteById = () => {
  ElMessageBox.confirm('确定要删除订单吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    if (!state.key){
      getGoodList();
    }
    axios.delete('/product/delete/id/' + state.key, {}).then(res => {
      ElMessage.success('删除成功')
      state.key = null
      getGoodList()
      state.loading = false
    }).catch(err => {
      getGoodList()
      state.key = null
      ElMessage.success('删除成功')
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
</script>

<style scoped>
.good-container {
  min-height: 100%;
}
.el-card.is-always-shadow {
  min-height: 100%!important;
}
</style>
