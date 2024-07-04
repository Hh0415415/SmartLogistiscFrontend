<template>
  <el-card class="good-container">
    <template #header>
            <div class="header">
              <el-button type="primary" :icon="Plus" @click="handleAdd">新增商品</el-button>
            </div>
      <el-input
          style="width: 200px; margin-right: 10px"
          placeholder="请输入商品号"
          v-model="state.key"
          clearable
      />

      <el-button type="primary" icon="el-icon-edit" @click="searchById">查询商品信息</el-button>
      <el-button type="primary" icon="el-icon-edit" @click="deleteById">删除商品信息</el-button>

      <!--      <el-button type="primary" icon="el-icon-edit" @click="submitOrder">提交订单</el-button>-->
      <!--      <el-input-->
      <!--          style="width: 200px; margin-right: 10px"-->
      <!--          placeholder="请输入商品号"-->
      <!--          v-model="state.data.productId"-->
      <!--          clearable-->
      <!--      />-->
      <!--      <el-input-->
      <!--          style="width: 200px; margin-right: 10px"-->
      <!--          placeholder="请输入商品数量"-->
      <!--          v-model="state.data.productNum"-->
      <!--          clearable-->
      <!--      />-->
      <!--      <el-input-->
      <!--          style="width: 200px; margin-right: 10px"-->
      <!--          placeholder="请输入仓库名"-->
      <!--          v-model="state.data.targetWarehouseId"-->
      <!--          clearable-->
      <!--      />-->
      <!--      <el-button type="primary" icon="el-icon-edit" @click="submitOrder">提交订单</el-button>-->
      <!--&lt;!&ndash;      </form>&ndash;&gt;-->
      <router-link to="/addorder">
        <el-button>
          <el-icon>
            <AddOrder />
          </el-icon>
          添加订单
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
      <!--      <el-table-column-->
      <!--        label="商品图片"-->
      <!--        width="150px"-->
      <!--      >-->
      <!--        <template #default="scope">-->
      <!--          <img style="width: 100px; height: 100px;" :key="scope.row.goodsId" :src="$filters.prefix(scope.row.goodsCoverImg)" alt="商品主图">-->
      <!--        </template>-->
      <!--      </el-table-column>-->

      <el-table-column
          prop="price"
          label="商品价格"
      >
      </el-table-column>
      <!--      <el-table-column-->
      <!--        prop="sellingPrice"-->
      <!--        label="商品售价"-->
      <!--      >-->
      <!--      </el-table-column>-->
      <!--      <el-table-column-->
      <!--        label="上架状态"-->
      <!--      >-->
      <!--        <template #default="scope">-->
      <!--          <span style="color: green;" v-if="scope.row.goodsSellStatus == 0">销售中</span>-->
      <!--          <span style="color: red;" v-else>已下架</span>-->
      <!--        </template>-->
      <!--      </el-table-column>-->

      <!--      <el-table-column-->
      <!--        label="操作"-->
      <!--        width="100"-->
      <!--      >-->
      <!--        <template #default="scope">-->
      <!--          <a style="cursor: pointer; margin-right: 10px" @click="handleEdit(scope.row.goodsId)">修改</a>-->
      <!--          <a style="cursor: pointer; margin-right: 10px" v-if="scope.row.goodsSellStatus == 0" @click="handleStatus(scope.row.goodsId, 1)">下架</a>-->
      <!--          <a style="cursor: pointer; margin-right: 10px" v-else @click="handleStatus(scope.row.goodsId, 0)">上架</a>-->
      <!--        </template>-->
      <!--      </el-table-column>-->
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
    state.tableData = res;
  }).catch(err => {
    console.log(err);
  })
}



const searchById = () => {
  if (state.key<=0)
    getGoodList();
  axios.get('/product/search/id/'+state.key, {
  }).then(res => {
    state.tableData = [];
    state.tableData.push(res);
  }).catch(err => {

  })
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
      getGoodList()
      state.key = null
      ElMessage.success('删除成功');
    }).catch(err => {

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
