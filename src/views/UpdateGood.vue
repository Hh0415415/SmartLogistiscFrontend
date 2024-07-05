<template>
  <el-card class="add-container">

    <div>
      <b>商品号 : </b>
      &nbsp;
      <el-input
          style="width: 600px; height:50px;margin-right: 20px"
          placeholder="请输入修改商品号"
          v-model="state.data.id"
          clearable
      />
    </div>

    <br>
    <br>
    <div>
      <b>商品类型: </b>
      <el-input
          style="width: 600px; height:50px;margin-right: 20px"
          placeholder="请输入商品类型"
          v-model="state.data.name"
          clearable
      /></div>

    <br><br>
    <div>
      <b>商品型号: </b>
      <el-input
          style="width: 600px; height:50px;margin-right: 20px"
          placeholder="请输入商品型号"
          v-model="state.data.mallName"
          clearable
      />
    </div>
    <br><br>
    <div>
      <b>商品价格: </b>
      <el-input
          style="width: 600px; height:50px;margin-right: 20px"
          placeholder="请输入商品价格"
          v-model="state.data.price"
          clearable
      />
    </div>
    <br><br>
    <!--    <el-button  type="primary" icon="el-icon-edit" @click="submitOrder">提交订单</el-button>-->
    <div class="button-container">
      <el-button type="primary" icon="el-icon-edit" @click="submitUpdate">提交修改</el-button>
    </div>
    <!--      </form>-->
  </el-card>
</template>
<script setup>
import { onMounted, reactive, getCurrentInstance } from 'vue'
import axios from '@/utils/axios'
import {ElMessage, ElMessageBox} from 'element-plus'
import {Plus, Delete, Bell} from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
const app = getCurrentInstance()
const { goTop } = app.appContext.config.globalProperties
const router = useRouter()
const state = reactive({
  loading: false,
  tableData: [], // 数据列表
  data:{
    id: null,
    name: '',
    mallName: '',
    price: null
  },
  total: 0, // 总条数
  key:null,
  currentPage: 1, // 当前页
  pageSize: 10 // 分页大小
})

const submitUpdate=()=> {
  axios.put("/product/update", state.data)
      .then(response => {
        console.log(state.data)
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
  top: 440px; /* Adjust the top position as needed */
  left: 36%; /* Position the button at the center horizontally */
  transform: translateX(-50%); /* Center the button horizontally */
}
</style>
