<template>
  <div class="login-body">
    <div class="login-container">
      <div class="head">
        <img class="logo" src="https://pic.imgdb.cn/item/667fb35cd9c307b7e92bb2c9.png" />
        <div class="name">
          <div class="title">寻星科技</div>
          <div class="tips">智慧物流系统</div>
        </div>
      </div>
      <el-form label-position="top" :rules="state.rules" :model="state.ruleForm" ref="loginForm" class="login-form">
        <el-form-item label="账号" prop="username">
          <el-input type="text" v-model.trim="state.ruleForm.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model.trim="state.ruleForm.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item>
          <div style="color: #333">登录表示您已同意<a>《服务条款》</a></div>
          <el-button style="width: 100%" type="primary" @click="submitForm">立即登录</el-button>
          <br><br>
          <el-button style="width: 100%" type="info" @click="Register">注册账号</el-button>
          <el-checkbox v-model="state.checked" @change="!state.checked">下次自动登录</el-checkbox>

        </el-form-item>
      </el-form>
      <RegisterDetail ref='addRegister'  :type="state.type" />
    </div>
  </div>
</template>

<script setup>
import axios from '@/utils/axios'
import router from '@/router'
import { reactive, ref } from 'vue'
import { localSet } from '@/utils'
import {ElMessage} from "element-plus";
import RegisterDetail from '@/components/RegisterDetail.vue'
const addRegister = ref(null)
const loginForm = ref(null)
const state = reactive({
  ruleForm: {
    username: '',
    password: ''
  },
  checked: true,
  type:'register',
  rules: {
    username: [
      { required: 'true', message: '账户不能为空', trigger: 'blur' }
    ],
    password: [
      { required: 'true', message: '密码不能为空', trigger: 'blur' }
    ]
  }
})
const submitForm = async () => {
  loginForm.value.validate((valid) => {
    if (valid) {
      var params = new URLSearchParams();
      params.append('username', state.ruleForm.username || '');
      params.append('password', state.ruleForm.password);
      axios.post('/login', params)
          .then(() => {
            ElMessage.success('登录成功');
            localSet('token', state.ruleForm.username + state.ruleForm.password);
            window.location.href = '/';
          })
          .catch((err) => {
            ElMessage.warning('登录失败');
            router.push({ path: '/login' });
          });
    } else {
      console.log('error submit!!')
      return false;
    }
  })
}
//注册账号
const Register = () => {
  state.type = 'register'
  addRegister.value.open()
}

const resetForm = () => {
  loginForm.value.resetFields();
}
</script>

<style scoped>
  .login-body {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    background-color: #fff;
  }
  .login-container {
    width: 420px;
    height: 500px;
    background-color: #fff;
    border-radius: 4px;
    box-shadow: 0px 21px 41px 0px rgba(0, 0, 0, 0.2);
  }
  .head {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 40px 0 20px 0;
  }
  .head img {
    width: 100px;
    height: 100px;
    margin-right: 20px;
  }
  .head .title {
    font-size: 28px;
    color: #1BAEAE;
    font-weight: bold;
  }
  .head .tips {
    font-size: 12px;
    color: #999;
  }
  .login-form {
    width: 70%;
    margin: 0 auto;
  }
  .login-form >>> .el-form--label-top .el-form-item__label {
    padding: 0;
  }
  .login-form >>> .el-form-item {
    margin-bottom: 0;
  }
</style>