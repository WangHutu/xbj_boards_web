<template>
  <div class="login_wrap">
    <div class="form_wrap">
      <p class="form_head">
        {{ tabState }}
      </p>
      <el-form
        v-if="tabState === 'Login'"
        ref="ruleFormLoginRef"
        :rules="rulesLogin"
        :model="ruleForm"
        status-icon
        label-width="70px"
        class="ruleForm loginForm"
      >
        <el-form-item label="User:" prop="user">
          <el-input v-model="ruleForm.user" autocomplete="off" />
        </el-form-item>
        <el-form-item label="Password:" prop="password">
          <el-input v-model="ruleForm.password" type="password" autocomplete="off" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm(ruleFormLoginRef)">{{ tabState }}</el-button>
        </el-form-item>
      </el-form>

      <el-form
        v-else
        ref="ruleFormRef"
        :model="ruleForm"
        status-icon
        :rules="rules"
        label-width="70px"
        class="ruleForm RegisterForm"
      >
        <el-form-item label="User: " prop="user">
          <el-input v-model="ruleForm.user" autocomplete="off" />
        </el-form-item>
        <el-form-item label="Password: " prop="password">
          <el-input v-model="ruleForm.password" type="password" autocomplete="off" />
        </el-form-item>
        <el-form-item label="Agin: " prop="passwordAgin">
          <el-input v-model="ruleForm.passwordAgin" type="password" autocomplete="off" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm(ruleFormRef)">{{ tabState }}</el-button>
        </el-form-item>
      </el-form>

      <div class="form_footer">
        <el-link type="primary" @click="changeTab('Login')" style="margin-right: 0px"
          >Login</el-link
        >
        <el-divider direction="vertical" />
        <el-link type="primary" @click="changeTab('Register')"> Register</el-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { UserService } from '@/api/api'
import { useRouter } from 'vue-router'
import { setLocal } from '@/common/utils'

const router = useRouter()

const ruleFormRef = ref()
const ruleFormLoginRef = ref()

const tabState = ref('Login')

const validatePass = (rule, value, callback) => {
  if (ruleForm.password === '') {
    callback(new Error('Please input the password'))
  } else {
    if (ruleForm.passwordAgin !== '') {
      if (!ruleFormRef.value) return
      ruleFormRef.value.validateField('passwordAgin', () => null)
    }
    callback()
  }
}
const validatePass2 = (rule, value, callback) => {
  if (ruleForm.passwordAgin === '') {
    callback(new Error('Please input the password again'))
  } else if (ruleForm.passwordAgin !== ruleForm.password) {
    callback(new Error(`Two inputs don't match!`))
  } else {
    callback()
  }
}

const ruleForm = reactive({
  user: '',
  password: '',
  passwordAgin: ''
})

const rulesLogin = reactive({
  user: [{ required: true, message: 'Please input Activity user', trigger: 'blur' }],
  password: [{ required: true, validator: validatePass, trigger: 'blur' }]
})

const rules = reactive({
  user: [{ required: true, message: 'Please input Activity user', trigger: 'blur' }],
  password: [{ required: true, validator: validatePass, trigger: 'blur' }],
  passwordAgin: [{ required: true, validator: validatePass2, trigger: 'blur' }]
})

// change tab
const changeTab = (state:any) => {
  tabState.value = state
  resetForm(ruleFormRef.value)
  resetForm(ruleFormLoginRef.value)
}

// submit
const submitForm = (formEl) => {
  if (!formEl) return
  formEl.validate((valid:any) => {
    if (valid) {
      console.log('submit!')
      if (tabState.value === 'Login') {
        console.log(ruleForm)
        UserService.userLoginApi(ruleForm).then((res:any) => {
          if (res.code == '200') {
            if (res.data.info) {
              setLocal('info', res.data.info)
              setLocal('Authorization', res.data.token)
            }
            router.push('/')
          }
        })
      } else {
        UserService.userRegisterApi(ruleForm).then((res:any) => {
          if (res.code == '200') {
            changeTab('Login')
          }
        })
      }
    } else {
      console.log('error submit!')
      return false
    }
  })
}

// clean form-data
const resetForm = (formEl) => {
  if (!formEl) return
  formEl.resetFields()
}
</script>

<style scoped>
.login_wrap {
  background: #f6f6f6;
  position: relative;
  width: 100vw;
  height: 100vh;
}

.form_wrap {
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5);
  border-radius: 7px;
  background: #fff;
  display: inline-block;
  width: 600px;
  position: absolute;
  left: 50%;
  top: 50%;
  padding-bottom: 10px;
  transform: translate(-50%, -80%);
}

.form_head {
  width: 100%;
  height: 55px;
  line-height: 55px;
  padding: 0 25px;
  margin-bottom: 20px;
  border-bottom: 1px solid #e5e5e5;
  font-size: 25px;
  font-weight: bold;
  color: #409eff;
}

.ruleForm {
  margin: 0 25px;
}

.form_footer {
  width: 100%;
  text-align: center;
}
</style>
