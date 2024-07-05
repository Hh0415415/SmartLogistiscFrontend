<template>
  <el-card class="add-container">



    <div>
      <b>驾驶员 : </b>
      <el-input
          style="width: 600px; height:50px;margin-right: 20px"
          placeholder="请输入驾驶员名字"
          v-model="state.data.transporter"
          clearable
      />
    </div>

    <br>
    <br>
    <div>
      <b>仓库ID: </b>
      <el-input
          style="width: 600px; height:50px;margin-right: 20px"
          placeholder="请输入仓库ID"
          v-model="state.data.warehouseId"
          clearable
      /></div>
    <br><br>
    <!--    <el-button  type="primary" icon="el-icon-edit" @click="submitOrder">提交订单</el-button>-->
    <div class="button-container">
      <el-button type="primary" icon="el-icon-edit" @click="submitCar">提交添加</el-button>
    </div>


  </el-card>
  <!--  <el-radio-group v-model="labelPosition" size="small">-->
  <!--    <el-radio-button label="left">左对齐</el-radio-button>-->
  <!--    <el-radio-button label="right">右对齐</el-radio-button>-->
  <!--    <el-radio-button label="top">顶部对齐</el-radio-button>-->
  <!--  </el-radio-group>-->
  <!--  <div style="margin: 20px;"></div>-->
  <!--  <el-form :label-position="'right'" label-width="80px" :model="state">-->
  <!--&lt;!&ndash;    <el-form-item label="名称">&ndash;&gt;-->
  <!--&lt;!&ndash;      <el-input v-model="state.name"></el-input>&ndash;&gt;-->
  <!--&lt;!&ndash;    </el-form-item>&ndash;&gt;-->
  <!--    <el-form-item label="仓库ID">-->
  <!--      <el-input v-model="state.data.warehouseId"></el-input>-->
  <!--    </el-form-item>-->
  <!--    <el-form-item label="驾驶员">-->
  <!--      <el-input v-model="state.data.transporter"></el-input>-->
  <!--    </el-form-item>-->
  <!--    <el-button type="primary" @click="submitCar">立即添加</el-button>-->
  <!--  </el-form>-->
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
    transporter: null,
    warehouseId: null
  },
  total: 0, // 总条数
  key:null,
  currentPage: 1, // 当前页
  pageSize: 10 // 分页大小
})

const submitCar=()=> {
  console.log(state.data)
  axios.post("/car/insert", state.data)
      .then(response => {
        ElMessage.success('添加成功')
        state.data=null
        console.log('Order submitted successfully:', response.data);
        // Handle success response
      })
      .catch(error => {
        ElMessage.success('添加成功')
        state.data=null
        console.error('Error submitting order:');
        // Handle error response
      });
};





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
  top: 270px; /* Adjust the top position as needed */
  left: 36%; /* Position the button at the center horizontally */
  transform: translateX(-50%); /* Center the button horizontally */
}
</style>
