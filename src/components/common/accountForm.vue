<template>
  <div class="account-form">
    <img
      :src="IMG_URL + '/ad_shop/img/login/logo.png'"
      class="top-logo"
    >
    <img
      :src="IMG_URL + '/ad_shop/img/login/circle1.png'"
      class="circle1"
    >
    <img
      :src="IMG_URL + '/ad_shop/img/login/circle2.png'"
      class="circle2"
    >
    <div class="account-form__container">
      <el-col
        :xs="15"
        :sm="15"
        :md="15"
        :lg="15"
      >
        <div class="account-form_left">
          <img
            :src="IMG_URL + '/ad_shop/img/login/center.jpg'"
            class="center"
          >
          <div class="welcome">
            <span class="line1">Welcome</span>
            <span class="line2">欢迎来到召唤宝</span>
          </div>

        </div>
      </el-col>
      <el-col
        :xs="8"
        :sm="8"
        :md="8"
        :lg="8"
      >
        <div class="account-form_right">
          <el-form
            ref="accountForm"
            :model="accountForm"
            :rules="rules"
            label-position="top"
            label-width="0px"
            @submit.native.prevent
          >
            <el-form-item class="account-form-item icon">
              <div class="top-icon">
                <img :src="IMG_URL + '/ad_shop/img/login/top.png'">
              </div>
            </el-form-item>
            <el-form-item
              prop="account"
              class="account-form-item mobile"
            >
              <el-input
                v-model="accountForm.account"
                :maxlength="11"
                auto-complete="off"
                type="text"
                placeholder="请输入用户名"
              />
            </el-form-item>
            <el-form-item
              prop="password"
              class="account-form-item password"
            >
              <el-input
                v-model="accountForm.password"
                :type="setting.showPassword ? 'text' : 'password'"
                :maxlength="20"
                auto-complete="off"
                placeholder="请输入密码"
                @keyup.enter.native="onSubmit(type)"
                @focus="itemFocus.password=true;validateError.password=false"
                @blur="itemFocus.password=false"
              />
              <div class="switch-show-off-password">
                <img
                  v-show="setting.showPassword"
                  :src="IMG_URL+'/ad_shop/img/login/icon_show_pwd.png'"
                  @click="setting.showPassword = !setting.showPassword"
                >
                <img
                  v-show="!setting.showPassword"
                  :src="IMG_URL+'/ad_shop/img/login/icon_hide_pwd.png'"
                  @click="setting.showPassword = !setting.showPassword"
                >
              </div>
            </el-form-item>
            <el-form-item class="account-form-submit">
              <el-button
                :loading="setting.submiting"
                class="btn-login"
                @click="onSubmit(type)"
              >登入</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-col>
    </div>
  </div>
</template>
<script>
const IMG_URL = process.env.IMG_URL
import auth from 'service/auth'
import validate from '../../utils/validate.js'
import {
  Button,
  Input,
  Form,
  FormItem,
  Checkbox,
  CheckboxGroup,
  Col,
  Select,
  Option
} from 'element-ui'

export default {
  name: 'AccountForm',
  components: {
    'el-col': Col,
    'el-button': Button,
    'el-input': Input,
    'el-form': Form,
    'el-form-item': FormItem,
    'el-checkbox': Checkbox,
    'el-checkbox-group': CheckboxGroup,
    'el-select': Select,
    'el-option': Option
  },
  props: {
    type: {
      type: String,
      required: true
    }
  },
  data() {
    let va = (rule, value, callback) => {
      let validateResult = validate.account(value)
      if (!validateResult.validate) {
        this.validateError.account = true
        this.validateErrorText.account = validateResult.errorText
        return false
      }

      this.validateError.account = false
      callback()
    }
    let vp = (rule, value, callback) => {
      let validateResult = validate.password(value)
      if (!validateResult.validate) {
        this.validateError.password = true
        this.validateErrorText.password = validateResult.errorText
        return false
      }

      this.validateError.password = false
      callback()
    }
    let vic = (rule, value, callback) => {
      let validateResult = validate.imageCaptcha(value)
      if (!validateResult.validate) {
        this.validateError.imageCaptcha = true
        this.validateErrorText.imageCaptcha = validateResult.errorText
        return false
      }
      this.validateError.imageCaptcha = false
      callback()
    }
    return {
      IMG_URL: IMG_URL,
      accountForm: {
        account: '',
        password: '',
        // imageCaptcha: {
        //   key: '',
        //   value: ''
        // }
      },
      setting: {
        submiting: false,
        loginFailedTimes: 0, // 尝试登陆失败次数
        showPassword: false,
        imageCaptcha: {
          md5: '',
          image_url: ''
        },
        redirect_url: '/account/datum'
      },
      rules: {
        // account: [{ validator: va, trigger: 'blur' }],
        // password: [{ validator: vp, trigger: 'submit' }],
      },
      validateError: {
        account: false,
        password: false,
        imageCaptcha: false
      },
      validateErrorText: {
        account: '',
        password: '',
        imageCaptcha: ''
      },
      itemFocus: {
        password: false,
        account: false,
        imageCaptcha: false
      }
    }
  },
  created() {
    // 从localstorage中取 记住密码的配置
    // this.getImageCaptcha()
  },
  methods: {
    onSubmit(type) {
      this[type]()
    },
    login() {
      // todo 验证码一并发送给后台
      if (!this.setting.submiting) {
        this.$refs.accountForm.validate(valid => {
          if (valid) {
            // console.log(new MD5().update(this.accountForm.password).digest('hex'))
            let loginParams = {
              username: this.accountForm.account,
              password: this.accountForm.password,
              // captcha_key: this.accountForm.imageCaptcha.key,
              // captcha_code: this.accountForm.imageCaptcha.value
            }
            auth.login(this, loginParams, this.setting.redirect_url)
          } else {
            return false
          }
        })
      }
    },
    linkToLogin() {
      this.$router.push({
        path: '/login'
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    getImageCaptcha() {
      auth
        .getImageCaptcha(this)
        .then(result => {
          if (result) {
            let imageCaptchaObj = result
            this.accountForm.imageCaptcha.key = imageCaptchaObj.captcha_key
            this.setting.imageCaptcha.image_url =
              imageCaptchaObj.captcha_image_content
          }
        })
        .catch(error => {
          console.log(error)
        })
    }
  }
}
</script>
<style lang="less">
@import "../../assets/css/accountForm.less";
</style>
<style lang="less" scoped>
.account-form-wrap {
  .account-form-container {
    .account-form-header {
      .header-link {
        .register-label {
          color: #474747;
          font-size: 12px;
          .sub-label {
            color: #20a0ff;
            cursor: pointer;
          }
        }
      }
    }
    .account-form-body {
      .account-form-submit {
        margin-top: 32px;
      }
    }
  }
}
</style>

