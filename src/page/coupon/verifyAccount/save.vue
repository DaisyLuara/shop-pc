<template>
  <div 
    class="item-wrap-template">
    <div 
      class="topbar">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/verify/van' }">核销账号列表</el-breadcrumb-item>
        <el-breadcrumb-item>{{ pointId ? '修改' : '添加' }}</el-breadcrumb-item>
      </el-breadcrumb>
      <headModule/>
    </div>
    <div  
      v-loading="setting.loading"
      :element-loading-text="setting.loadingText" 
      class="pane" >
      <div class="pane-title">
        {{ pointId ? '修改核销账号' : '新建核销账号' }}
      </div>
      <el-form
        ref="verifyAccountForm"
        :rules="rules"
        :model="verifyAccountForm" 
        label-width="150px">
        <el-form-item 
          label="用户名" 
          prop="title">
          <label>ID222</label>
        </el-form-item>
        <el-form-item 
          label="密码" 
          prop="password">
          <el-input 
            v-model="verifyAccountForm.password"
            :maxlength="6" 
            class="item-input" 
            clearable/>
        </el-form-item>
        <el-form-item 
          label="门店名称"
          prop="point_name">
          <el-input 
            v-model="verifyAccountForm.point_name" 
            class="item-input" 
            clearable/>
        </el-form-item>
        <el-form-item 
          label="门店地址"
          prop="address">
          <el-input 
            v-model="verifyAccountForm.address" 
            class="item-input" 
            clearable/>
        </el-form-item>
        <el-form-item 
          label="核销员"
          prop="verify_name">
          <el-input 
            v-model="verifyAccountForm.verify_name" 
            class="item-input" 
            clearable/>
        </el-form-item>
        <el-form-item 
          label="核销员手机"
          prop="verify_phone">
          <el-input 
            v-model="verifyAccountForm.verify_phone" 
            :maxlength="11" 
            class="item-input"
            clearable/>
        </el-form-item>
        <el-form-item>
          <el-button 
            type="primary"
            size="small"
            @click="submit('verifyAccountForm')">确认</el-button>
          <el-button 
            type="success"
            size="small">确认并发送至核销员手机</el-button>
          <el-button 
            size="small">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { Form, FormItem, Button, Input, Message } from 'element-ui'
import validate from '../../../utils/validate.js'

export default {
  components: {
    ElForm: Form,
    ElFormItem: FormItem,
    ElButton: Button,
    ElInput: Input
  },
  data() {
    let checkPassword = (rule, value, callback) => {
      if (value.length !== 6) {
        callback(new Error('请输入6位'))
      } else {
        callback()
      }
    }
    let checkPhone = (rule, value, callback) => {
      let validateResult = validate.account(value)
      if (!validateResult.validate) {
        callback(new Error('手机号格式不正确'))
      } else if (!value) {
        callback(new Error('手机号不能为空'))
      } else {
        callback()
      }
    }

    return {
      pointId: '',
      setting: {
        loading: false,
        loadingText: '拼命加载中'
      },
      rules: {
        password: [
          { required: true, validator: checkPassword, trigger: 'submit' }
        ],
        point_name: [
          { required: true, message: '请输入门店名称', trigger: 'submit' }
        ],
        address: [
          { required: true, message: '请输入门店地址', trigger: 'submit' }
        ],
        verify_name: [
          { required: true, message: '请输入核销员', trigger: 'submit' }
        ],
        verify_phone: [
          { required: true, validator: checkPhone, trigger: 'submit' }
        ]
      },
      verifyAccountForm: {
        password: '',
        point_name: '',
        address: '',
        verify_name: '',
        verify_phone: ''
      }
    }
  },
  created() {
    this.setting.loading = true
    this.pointId = this.$route.params.uid
    if (this.pointId) {
    } else {
      this.setting.loading = false
    }
  },
  methods: {
    submit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.pointId) {
            console.log('success')
          } else {
            console.log('success')
          }
        } else {
          console.log('error')
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.item-wrap-template {
  .pane {
    border-radius: 5px;
    background-color: white;
    padding: 20px 40px 80px;
    .el-select,
    .item-input,
    .el-date-editor.el-input {
      width: 380px;
    }
    .item-list {
      .program-title {
        color: #555;
        font-size: 14px;
      }
    }
    .up-vertical {
      // border: 1px dashed #d9d9d9;
      width: 150px;
      min-height: 20px;
      cursor: pointer;
      position: relative;
    }
    .up-vertical-video {
      // border: 1px dashed #d9d9d9;
      width: 150px;
      min-height: 20px;
      cursor: pointer;
      position: relative;
    }
    .up-horizontal-video {
      // border: 1px dashed #d9d9d9;
      width: 275px;
      min-height: 20px;
      cursor: pointer;
      position: relative;
    }
    .up-horizontal {
      // border: 1px dashed #d9d9d9;
      width: 150px;
      min-height: 20px;
      cursor: pointer;
      position: relative;
    }
    .up-text {
      // border: 1px dashed #d9d9d9;
      width: 150px;
      min-height: 20px;
      cursor: pointer;
      position: relative;
    }
    .text {
      width: 150px;
      min-height: 20px;
      display: block;
    }
    .text-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 150px;
      min-height: 50px;
      line-height: 50px;
      text-align: center;
    }
    .horizontal {
      width: 150px;
      min-height: 150px;
      display: block;
    }
    .vertical {
      width: 100%;
      min-height: 100%;
      display: block;
    }
    .horizontal {
      width: 100%;
      height: 100%;
      display: block;
    }
    .avatar-uploader .el-upload:hover {
      border-color: #409eff;
    }
    .horizontal-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 150px;
      // min-height: 150px;
      // line-height: 150px;
      text-align: center;
    }
    .vertical-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 150px;
      // min-height: 200px;
      // line-height: 200px;
      text-align: center;
    }
    .vertical-uploader-video-icon {
      font-size: 28px;
      color: #8c939d;
      width: 150px;
      // height: 170px;
      // line-height: 170px;
      text-align: center;
    }
    .horizontal-uploader-video-icon {
      font-size: 28px;
      color: #8c939d;
      width: 150px;
      // height: 150px;
      // line-height: 150px;
      text-align: center;
    }
    .delete-icon-image {
      position: absolute;
      top: 5px;
      right: 0;
      font-size: 20px;
      color: #83909a;
      cursor: pointer;
    }
    .pane-title {
      padding-bottom: 20px;
      font-size: 18px;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
    }
  }
}
</style>
