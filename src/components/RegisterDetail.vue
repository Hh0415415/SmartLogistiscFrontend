<template>
  <el-dialog
      title="注册账户"
      v-model="state.visible"
      width="400px"
  >
    <el-form :model="state.ruleForm" :rules="state.rules" ref="formRef" label-width="100px" class="good-form">
      <el-form-item label="账号" prop="username">
        <el-input type="text" v-model="state.ruleForm.username"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input type="text" v-model="state.ruleForm.password"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="state.visible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRoute } from 'vue-router'
import axios from '@/utils/axios'
import { ElMessage } from 'element-plus'

const props = defineProps({
  type: String, // 用于判断是添加还是编辑
  reload: Function // 添加或修改完后，刷新列表页
})

const formRef = ref(null)
const route = useRoute()
const state = reactive({
  visible: false,
  categoryLevel: 1,
  parentId: 0,
  ruleForm: {
    username: '',
    password: ''
  },
  rules: {
    username: [
      { required: 'true', message: '账号不能为空', trigger: ['change'] }
    ],
    password: [
      { required: 'true', message: '密码不能为空', trigger: ['change'] }
    ]
  },
  id: ''
})

// 开启弹窗
const open = (id) => {
  state.visible = true
  if (id) {
    state.id = id
    // 如果是有 id 传入，证明是修改模式
    getDetail(id)
  } else {
    // 否则为新增模式
    // 新增类目，从路由获取分类 level 级别和父分类 id
    const { level = 1, parent_id = 0 } = route.query
    state.ruleForm = {
      username: '',
      password: ''
    }
    state.parentId = parent_id
    state.categoryLevel = level
  }
}
// 关闭弹窗
const close = () => {
  state.visible = false
}
const submitForm = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      axios.post('/register', { username: state.ruleForm.username, password: state.ruleForm.password })
          .then(response => {
            ElMessage.success('注册成功');
            state.visible = false
            // Redirect to login page
          })
          .catch(error => {
            ElMessage.error('注册失败');
            state.visible = false
          });
    }
  })
}
defineExpose({ open, close })
</script>