<template>
  <el-card class="add-container">

    <div>
      <b>商品号 : </b>
      <el-input
          style="width: 600px; height:50px;margin-right: 20px"
          placeholder="请输入商品号"
          v-model="state.data.productId"
          clearable
      />
    </div>

    <br>
    <br>
    <div>
      <b>商品数量: </b>
      <el-input
          style="width: 600px; height:50px;margin-right: 20px"
          placeholder="请输入商品数量"
          v-model="state.data.productNum"
          clearable
      /></div>

    <br><br>
    <div>
      <b>仓库名称: </b>
      <el-input
          style="width: 600px; height:50px;margin-right: 20px"
          placeholder="请输入仓库名"
          v-model="state.data.targetWarehouseId"
          clearable
      />
    </div>

    <br><br>
    <!--    <el-button  type="primary" icon="el-icon-edit" @click="submitOrder">提交订单</el-button>-->
    <div class="button-container">
      <el-button type="primary" icon="el-icon-edit" @click="submitOrder">提交订单</el-button>
    </div>
    <!--      </form>-->
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
const state = reactive({
  loading: false,
  tableData: [], // 数据列表
  data:{
    productId: '',
    productNum: '',
    targetWarehouseId: ''
  },
  total: 0, // 总条数
  key:null,
  currentPage: 1, // 当前页
  pageSize: 10 // 分页大小
})

const submitOrder=()=> {
  console.log(state.data)
  axios.post("/order/submit", state.data)
      .then(() => {
        ElMessage.success('提交成功')
      })
      .catch(error => {
        ElMessage.success('提交成功')
        // Handle error response
      });
};
onMounted(() => {
  getGoodList()
})
// 获取轮播图列表
const getGoodList = () => {
  state.loading = true
  axios.get('/product/search', {
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
  if (state.key<=0)
    getGoodList();
  axios.get('/product/search/id/'+state.key, {
  }).then(res => {
    state.tableData = res.list
    //state.total = res.totalCount
    //state.currentPage = res.currPage
    state.loading = false
  }).catch(err => {
    state.tableData = [];
    state.tableData.push(err) ;})
  console.log(1225);
  console.log(State.tableData);
}

const deleteById = () => {
  ElMessageBox.confirm('确定要删除商品吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    if (state.key == null)
      getGoodList();
    axios.delete('/product/delete/id/' + state.key, {}).then(res => {
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
</script>

<style scoped>
.good-container {
  min-height: 100%;
}
.el-card.is-always-shadow {
  min-height: 100%!important;
}

.center-button {
  text-align: center;
}

.center-button .el-button {
  display: block;
  margin: 0 auto;
}
.button-container {
  position: absolute;
  top: 370px; /* Adjust the top position as needed */
  left: 36%; /* Position the button at the center horizontally */
  transform: translateX(-50%); /* Center the button horizontally */
}
</style>
