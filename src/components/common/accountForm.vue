<template>
  <div 
    class="account-form">
    <div 
      class="account-form__container">
      <div 
        class="account-form__header clearfix">
        <div 
          class="header-logo-wrap">
          <span 
            class="title-header">用户登录</span>
        </div>
      </div>
      <div 
        class="account-form__body">
        <el-form 
          ref="accountForm" 
          :model="accountForm" 
          :rules="rules" 
          label-position="top" 
          label-width="0px" 
          @submit.native.prevent >
          <el-form-item 
            :class="{'error': validateError.account,'active': itemFocus.account}" 
            prop="account" 
            class="account-form-item mobile" >
            <el-col 
              :xs="10" 
              :sm="8" 
              :md="8" 
              :lg="8">
              <div 
                class="account-form-item-label">
                <span 
                  class="lable-text">手机号码</span>
                <span 
                  class="lable-prefix">+86</span>
              </div>
            </el-col>
            <el-col 
              :xs="14" 
              :sm="16" 
              :md="16" 
              :lg="16">
              <el-col 
                :xs="16" 
                :sm="16" 
                :md="16" 
                :lg="16">
                <el-input 
                  v-model="accountForm.account"
                  :maxlength="11" 
                  type="text"  
                  auto-complete="off"
                  placeholder="请输入手机号"/>
              </el-col>
            </el-col>
            <div 
              v-show="validateError.account"
              class="error-tip" 
            >{{ validateErrorText.account }}</div>
          </el-form-item>
          <el-form-item 
            :class="{'error': validateError.imageCaptcha,'active': itemFocus.imageCaptcha}"
            prop="imageCaptcha.value" 
            class="account-form-item image-code" 
          >
            <el-col 
              :xs="4" 
              :sm="5" 
              :md="5" 
              :lg="5">
              <div 
                class="account-form-item-label">
                <span 
                  class="lable-text">验证码</span>
              </div>
            </el-col>
            <el-col 
              :xs="20" 
              :sm="19" 
              :md="19" 
              :lg="19">
              <el-col 
                :xs="12" 
                :sm="13" 
                :md="13" 
                :lg="13">
                <el-input 
                  v-model="accountForm.imageCaptcha.value" 
                  :maxlength="5" 
                  type="text" 
                  placeholder="请输入验证码"
                  auto-complete="off"
                  @focus="itemFocus.imageCaptcha=true;validateError.imageCaptcha=false" 
                  @blur="itemFocus.imageCaptcha=false"/>
              </el-col>
              <el-col 
                :xs="12" 
                :sm="11" 
                :md="11" 
                :lg="11">
                <div 
                  class="image-code-wrap">
                  <img 
                    :src="setting.imageCaptcha.image_url" 
                    class="image-code" 
                    alt="验证码图片"
                    @click="getImageCaptcha()" >
                </div>
              </el-col>
            </el-col>
            <div 
              v-show="validateError.imageCaptcha"
              class="error-tip">{{ validateErrorText.imageCaptcha }}</div>
          </el-form-item>
          <el-form-item  
            :class="{'error': validateError.password,'active': itemFocus.password}"
            prop="password" 
            class="account-form-item password">
            <el-col 
              :xs="6" 
              :sm="5"
              :md="5"
              :lg="5">
              <div 
                class="account-form-item-label password">
                <div 
                  class="lable-text">登录密码</div>
              </div>
            </el-col>
            <el-col 
              :xs="18" 
              :sm="19" 
              :md="19" 
              :lg="19">
              <el-col 
                :xs="20" 
                :sm="21" 
                :md="21" 
                :lg="21">
                <el-input 
                  v-model="accountForm.password"
                  :type="setting.showPassword ? 'text' : 'password'" 
                  :maxlength="20" 
                  auto-complete="off"
                  placeholder="请输入密码"
                  @keyup.enter.native="onSubmit(type)" 
                  @focus="itemFocus.password=true;validateError.password=false" 
                  @blur="itemFocus.password=false" />
              </el-col>
              <el-col 
                :xs="4" 
                :sm="3" 
                :md="3" 
                :lg="3">
                <div 
                  class="switch-show-off-password">
                  <img 
                    v-show="setting.showPassword"
                    src="../../assets/images/icon_show_pwd.png" 
                    @click="setting.showPassword = !setting.showPassword" >
                  <img 
                    v-show="!setting.showPassword"
                    src="../../assets/images/icon_hide_pwd.png"
                    @click="setting.showPassword = !setting.showPassword" >
                </div>
              </el-col>
            </el-col>
            <div 
              v-show="validateError.password"
              class="error-tip" >{{ validateErrorText.password }}</div>
          </el-form-item>
          <el-form-item 
            style="width:100%;" 
            class="account-form-submit">
            <el-button 
              :loading="setting.submiting"
              class="btn-login" 
              @click="onSubmit(type)" 
            >登录</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="icp">
      <a target="_blank" href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=31011502008032" style="display:inline-block;text-decoration:none;height:20px;line-height:20px;">
        <p style="height:20px;line-height:20px;margin: 0px 0px 0px 5px; color:#fff;">
          Copyright©2018 星视度 版权所有 <img :src="IMG_URL + 'ad_shop/img/reference.png'"/> 沪公网安备 31011502008032号
        </p>
      </a>
      <a target="_blank" href="http://www.miitbeian.gov.cn" class="m-contact-text" style="display:inline-block;text-decoration:none;height:20px;line-height:20px;">
        <p style="height:20px;line-height:20px;margin: 0px 0px 0px 5px; color:#fff;">
          沪ICP备 17045724号
        </p>
      </a>
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
        imageCaptcha: {
          key: '',
          value: ''
        }
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
        account: [{ validator: va, trigger: 'blur' }],
        password: [{ validator: vp, trigger: 'submit' }],
        'imageCaptcha.value': [{ validator: vic, trigger: 'blur' }]
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
    this.getImageCaptcha()
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
              captcha_key: this.accountForm.imageCaptcha.key,
              captcha_code: this.accountForm.imageCaptcha.value
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
@import '../../assets/css/accountForm.less';
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

