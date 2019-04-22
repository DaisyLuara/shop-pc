<template>
  <div class="sample-login">
    <div class="sample-header">
      <img
        :src="IMG_URL + 'ad_guide/sambg.jpg'"
        class="bg"
      >
      <div class="tit-text">
        <p class="big-tit">请完善一下信息，体验召唤宝非凡智能</p>
        <p class="small-tit">全国超百家一线商业体的共同选择</p>
      </div>
    </div>
    <div class="main-login">
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item
          label="手机号码"
          prop="mobile"
        >
          <el-input
            v-model="ruleForm.mobile"
            maxlength="11"
            auto-complete="off"
            @change="checkPhone"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="验证码"
          prop="vertify"
        >
          <el-input
            v-model="ruleForm.vertify"
            maxlength="4"
            auto-complete="off"
            class="input-vertify"
            @change="consoleLog"
          ></el-input>
          <el-button
            :disabled="nosend"
            class="vertify-btn"
            @click="getVertifyBtn"
          >获取验证码</el-button>
        </el-form-item>
        <el-form-item
          label="密码"
          prop="pwd"
        >
          <el-input
            v-model="ruleForm.pwd"
            auto-complete="off"
            type="password"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="确认密码"
          prop="pwd_confirm"
        >
          <el-input
            v-model="ruleForm.pwd_confirm"
            auto-complete="off"
            type="password"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="邮箱"
          prop="email"
          :rules="[
              { required: true, message: '请输入邮箱地址', trigger: 'blur' },
              { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
            ]"
        >
          <el-input
            v-model="ruleForm.email"
            auto-complete="off"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="姓名"
          prop="name"
        >
          <el-input
            v-model="ruleForm.name"
            auto-complete="off"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="公司"
          prop="company"
        >
          <el-input
            v-model="ruleForm.company"
            auto-complete="off"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="职位"
          prop="job"
        >
          <el-input
            v-model="ruleForm.job"
            auto-complete="off"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            class="submit"
            @click="sampleLogin"
          >立即体验</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
const IMG_URL = process.env.IMG_URL;
import {
  Form,
  FormItem,
  Input,
  Button,
  Message
} from "element-ui";
import validate from '@/utils/validate.js'
import guide from 'service/guide'
export default {
  name: "Home",
  components: {
    "el-form": Form,
    "el-form-item": FormItem,
    "el-button": Button,
    "el-input": Input
  },
  data() {
    return {
      IMG_URL: IMG_URL,
      ruleForm: {
        mobile: null,
        vertify: null,
        pwd: null,
        pwd_confirm: null,
        email: null,
        name: null,
        company: null,
        job: null,
      },
      vertify_key: null,
      nosend: false,
      rules: {
        mobile: [
          { required: true, message: '请输入手机号码', trigger: 'blur' }
        ],
        vertify: [
          { required: true, message: '请输入验证码', trigger: 'blur' }
        ],
        pwd: [
          { required: true, message: '请输入密码', trigger: 'blur' },
        ],
        pwd_confirm: [
          { required: true, message: '请确认密码', trigger: 'blur' },
        ],
        name: [
          { required: true, message: '请输入姓名', trigger: 'blur' },
        ],
        company: [
          { required: true, message: '请输入公司', trigger: 'blur' },
        ]
      }
    };
  },
  created() {
    window.scroll(0, 0)
  },
  mounted() {
    if (this.$route.query.mobile) {
      this.ruleForm.mobile = this.$route.query.mobile
    }
  },
  methods: {
    consoleLog() {
      console.log(this.ruleForm.vertify)
    },
    checkPhone() {
      let res = validate.account(this.ruleForm.mobile)
      if (res.validate) {
        this.nosend = false
      } else {
        this.$message.error(res.errorText)
        this.nosend = true
      }
    },
    getVertifyBtn() {
      let args = {}
      args.phone = this.ruleForm.mobile
      guide.getVertify(this, args).then(res => {
        this.nosend = true
        this.vertify_key = res.key
        let timer = setTimeout(() => {
          this.nosend = false
          clearTimeout(timer)
        }, 60000)
      }).catch(err => {
        this.$message.error(err.response.data.message)
      })
    },
    sampleLogin() {
      let args = {}
      if ((!this.vertify_key) || (!this.ruleForm.vertify)) {
        this.$message.error('请获取验证码')
        return
      }

      if (!this.ruleForm.pwd) {
        this.$message.error('请输入密码')
        return
      }
      if (!this.ruleForm.pwd_confirm) {
        this.$message.error('请确认密码')
        return
      }
      if (this.ruleForm.pwd !== this.ruleForm.pwd_confirm) {
        this.$message.error('密码不一致')
        return
      }
      if (!this.ruleForm.email) {
        this.$message.error('请输入邮箱')
        return
      }
      if (!this.ruleForm.name) {
        this.$message.error('请输入姓名')
        return
      }
      if (!this.ruleForm.company) {
        this.$message.error('请输入公司')
        return
      }
      args = {
        "sms_captcha_key": this.vertify_key,
        "sms_captcha_code": this.ruleForm.vertify,
        "phone": this.ruleForm.mobile,
        "name": this.ruleForm.name,
        "company_name": this.ruleForm.company,
        "position": this.ruleForm.jpb,
        "password": this.ruleForm.pwd,
        "password_confirmation": this.ruleForm.pwd_confirm
      }
      guide.getSampleLogin(this, args).then(res => {
        this.$router.push({
          path: '/login'
        })
      }).catch(err => {
        if (err.response)
          this.$message.error(err.response.data.message)
      })
    }
  }

};
</script>
<style lang="less">
@img: "http://cdn.xingstation.cn/ad_guide/";
a {
  cursor: pointer;
}
button {
  cursor: pointer;
}
.bg {
  width: 100%;
  position: relative;
  z-index: 0;
}
.sample-login {
  width: 100%;
  position: relative;
  z-index: 0;
  padding-bottom: 100px;
  .sample-header {
    width: 100%;
    position: relative;
    .tit-text {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: 5;
      .big-tit {
        color: #fff;
        font-size: 28px;
        margin: 5px auto;
        font-weight: 900;
        text-align: center;
      }
      .small-tit {
        color: #fff;
        font-size: 16px;
        text-align: center;
      }
    }
  }
  .main-login {
    width: 400px;
    position: relative;
    margin: 0 auto;
    padding-top: 50px;
    color: #4d4d4d;
    font-size: 12px;
    .el-form-item {
      margin-bottom: 15px;
    }
    .el-form-item__error {
      padding-top: 2px;
    }
    .el-input {
      input {
        background: transparent;
        border: none;
        background-image: url("@{img}input.png");
        background-repeat: no-repeat;
        background-position: left center;
        background-size: auto 78%;
        padding-left: 10px;
        text-align: left;
      }
    }
    .input-vertify {
      width: 50%;
      margin-right: 10px;
      input {
        background-image: url("@{img}inputbg.png");
      }
    }
    .vertify-btn {
      width: 45%;
      background: transparent;
      background-image: url("@{img}btnbg.png");
      background-repeat: no-repeat;
      background-position: center center;
      background-size: 100% 85%;
      border: none;
      color: #fff;
      font-size: 12px;
    }
    .submit {
      width: 100%;
      background-color: #e5e5e5;
      border: none;
      color: #333;
      font-size: 12px;
      border-radius: 20px;
    }
  }
}
</style>


