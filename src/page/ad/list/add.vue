<template>
  <div 
    class="item-wrap-template">
    <div 
      class="topbar">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/ad/list' }">广告列表</el-breadcrumb-item>
        <el-breadcrumb-item>{{ adID ? '修改' : '添加' }}</el-breadcrumb-item>
      </el-breadcrumb>
      <headModule/>
    </div>
    <div  
      v-loading="setting.loading"
      :element-loading-text="setting.loadingText" 
      class="pane" >
      <div class="pane-title">
        {{ adID ? '修改广告' : '新建广告' }}
      </div>
      <el-form
        ref="adForm"
        :rules="rules"
        :model="adForm" 
        label-width="150px">
        <!-- 信息 -->
        <div 
          v-show="stepOne"
          class="step-one-wrap" >
          <el-form-item 
            label="广告名称" 
            prop="title">
            <el-input 
              v-model="adForm.title" 
              class="item-input" 
              clearable/>
          </el-form-item>
          <el-form-item 
            label="投放场所" 
            prop="marketid" >
            <el-select 
              v-model="adForm.marketid" 
              :loading="searchLoading"
              placeholder="请选择场所"
              clearable
              filterable>
              <el-option
                v-for="item in marketList"
                :key="item.marketid"
                :label="item.name"
                :value="item.marketid"/>
            </el-select>
          </el-form-item>
          <el-form-item 
            label="授权链接" 
            prop="wiid" >
            <el-select 
              v-model="adForm.wiid"
              :loading="searchLoading"
              placeholder="请搜索"
              clearable
              filterable>
              <el-option
                v-for="item in authList"
                :key="item.wiidd"
                :label="item.name"
                :value="item.wiid"/>
            </el-select>
          </el-form-item>
          <el-form-item 
            label="类型"
            prop="">
            <el-radio-group v-model="putType">
              <el-radio label="0">硬广</el-radio>
              <el-radio label="1">冠名</el-radio>
            </el-radio-group>
            <!-- <el-input 
              v-model="adForm.looknum" 
              class="item-input" 
              clearable/> -->
          </el-form-item>
          <el-form-item 
            label="次数"
            prop="count">
            <el-input 
              v-model="adForm.count" 
              class="item-input" 
              clearable/>
          </el-form-item>
          <el-form-item 
            label="投放开始时间"
            prop="sdate">
            <el-date-picker
              v-model="adForm.sdate"
              type="date"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="选择日期"/>
          </el-form-item>
          <el-form-item 
            label="投放结束时间"
            prop="edate">
            <el-date-picker
              v-model="adForm.edate"
              type="date"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="选择日期"/>
          </el-form-item>
          <el-form-item 
            label="限制投放">
            <el-radio-group v-model="adForm.share">
              <el-radio :label="0">关闭</el-radio>
              <el-radio :label="1">开启</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item>
            <el-button 
              type="primary"
              size="small"
              @click="next('one')">下一步</el-button>
          </el-form-item>
        </div>
        <!-- 视频 -->
        <div 
          v-show="stepTwo"
          class="step-two-wrap" >
          <el-form-item
            label="素材类型">
            <el-radio-group v-model="type" @change="resourceChange">
              <el-radio label="0">图片</el-radio>
              <el-radio label="1">视频</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item
            v-if="type === '0'"
            label="竖版素材">
            <div class="up-vertical">
              <img 
                v-if="adForm.purl" 
                :src="adForm.purl" 
                class="vertical">
              <i 
                v-else 
                class="el-icon-plus vertical-uploader-icon"
                @click="handleOpenPane('purl')"/>
              <i 
                v-if="adForm.purl" 
                class="el-icon-circle-close delete-icon-image" 
                @click="handleImageDelete('purl')"/>
            </div>
          </el-form-item>
          <el-form-item
            v-if="type === '1'"
            label="竖版素材视频" 
            prop="purl">
            <div class="up-vertical-video">
              <video 
                v-if="adForm.purl" 
                :src="adForm.purl" 
                controls="controls"
                class="vertical">
                您的浏览器不支持</video>
              <i 
                v-else 
                class="el-icon-plus vertical-uploader-video-icon"
                @click="handleOpenVideo('purl')"/>
              <i 
                v-if="adForm.purl" 
                class="el-icon-circle-close delete-icon-image" 
                @click="handleImageDelete('purl')"/>
            </div>
          </el-form-item>
          <el-form-item
            v-if="type === '0'"
            label="横版素材">
            <div class="up-horizontal">
              <img 
                v-if="adForm.lurl" 
                :src="adForm.lurl" 
                class="horizontal">
              <i 
                v-else 
                class="el-icon-plus horizontal-uploader-icon"
                @click="handleOpenPane('lurl')"/>
              <i 
                v-if="adForm.lurl" 
                class="el-icon-circle-close delete-icon-image" 
                @click="handleImageDelete('lurl')"/>
            </div>
          </el-form-item>
          <el-form-item
            v-if="type === '1'"
            label="横版素材视频" 
            prop="lurl">
            <div class="up-horizontal-video">
              <video 
                v-if="adForm.lurl" 
                :src="adForm.lurl" 
                controls="controls"
                class="horizontal">
                您的浏览器不支持</video>
              <i 
                v-else 
                class="el-icon-plus horizontal-uploader-video-icon"
                @click="handleOpenVideo('lurl')"/>
              <i 
                v-if="adForm.lurl" 
                class="el-icon-circle-close delete-icon-image" 
                @click="handleImageDelete('lurl')"/>
            </div>
          </el-form-item>
          <el-form-item
            label="竖版LOGO">
            <div class="up-vertical">
              <img 
                v-if="adForm.plogo" 
                :src="adForm.plogo" 
                class="vertical">
              <i 
                v-else 
                class="el-icon-plus vertical-uploader-icon"
                @click="handleOpenPane('plogo')"/>
              <i 
                v-if="adForm.plogo" 
                class="el-icon-circle-close delete-icon-image" 
                @click="handleImageDelete('plogo')"/>
            </div>
          </el-form-item>
          <el-form-item
            label="横版LOGO">
            <div class="up-horizontal">
              <img 
                v-if="adForm.llogo" 
                :src="adForm.llogo" 
                class="horizontal">
              <i 
                v-else 
                class="el-icon-plus horizontal-uploader-icon"
                @click="handleOpenPane('llogo')"/>
              <i 
                v-if="adForm.llogo" 
                class="el-icon-circle-close delete-icon-image" 
                @click="handleImageDelete('llogo')"/>
            </div>
          </el-form-item>
          <el-form-item
            label="竖版文案">
            <div class="up-text">
              <img 
                v-if="adForm.pinfo" 
                :src="adForm.pinfo" 
                class="text">
              <i 
                v-else 
                class="el-icon-plus text-uploader-icon"
                @click="handleOpenPane('pinfo')"/>
              <i 
                v-if="adForm.pinfo" 
                class="el-icon-circle-close delete-icon-image" 
                @click="handleImageDelete('pinfo')"/>
            </div>
          </el-form-item>
          <el-form-item
            label="横版文案">
            <div class="up-text">
              <img 
                v-if="adForm.linfo" 
                :src="adForm.linfo" 
                class="text">
              <i 
                v-else 
                class="el-icon-plus text-uploader-icon"
                @click="handleOpenPane('linfo')"/>
              <i 
                v-if="adForm.linfo" 
                class="el-icon-circle-close delete-icon-image" 
                @click="handleImageDelete('linfo')"/>
            </div>
          </el-form-item>
          <el-form-item>
            <el-button 
              type="success"
              size="small"
              @click="prev('two')">上一步</el-button>
            <el-button 
              type="primary"
              size="small"
              @click="submit">保存</el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <picture-panel 
      :panel-visible.sync="panelVisible"
      :single-flag="true"
      @close="handlePictureClose"/>
    <video-panel 
      :video-visible.sync="videoVisible" 
      :single-flag="true"
      @close="handleVideoClose"/>
  </div>
</template>

<script>
import { getMarket, getAuthList } from 'service'
import ad from 'service/ad'
import utils from 'service/utils'
import picturePanel from 'components/common/picturePanel'
import videoPanel from 'components/common/videoPanel'

import {
  Form,
  Select,
  Option,
  FormItem,
  Button,
  Input,
  Message,
  DatePicker,
  RadioGroup,
  Radio
} from 'element-ui'

export default {
  components: {
    ElForm: Form,
    ElSelect: Select,
    ElOption: Option,
    ElFormItem: FormItem,
    ElButton: Button,
    ElInput: Input,
    ElDatePicker: DatePicker,
    ElRadioGroup: RadioGroup,
    ElRadio: Radio,
    picturePanel,
    videoPanel
  },
  data() {
    let checkEndDate = (rule, value, callback) => {
      if (new Date(value).getTime() < new Date(this.adForm.sdate).getTime()) {
        callback(new Error('结束日期要大于开始日期'))
      } else {
        callback()
      }
    }
    let checkLookNum = (rule, value, callback) => {
      if (!value && value != 0) {
        return callback(new Error('不能为空'))
      }
      setTimeout(() => {
        if (value < 100) {
          callback(new Error('次数必须大于100'))
        } else {
          callback()
        }
      }, 1000)
    }
    return {
      putType: '0',
      adID: '',
      type: '0',
      stepOne: true,
      stepTwo: false,
      stepThree: false,
      panelVisible: false,
      videoVisible: false,
      setting: {
        loading: false,
        loadingText: '拼命加载中'
      },
      rules: {
        edate: [{ required: true, validator: checkEndDate, trigger: 'submit' }],
        title: [
          { required: true, message: '请输入广告名称', trigger: 'submit' }
        ],
        marketid: [
          { required: true, message: '请选择场所', trigger: 'submit' }
        ],
        wiid: [
          { required: true, message: '请选择授权链接', trigger: 'submit' }
        ],
        count: [
          {
            required: true,
            validator: checkLookNum,
            trigger: 'submit'
          }
        ],
        sdate: [
          { required: true, message: '请选择开始时间', trigger: 'submit' }
        ]
      },
      marketList: [],
      authList: [],
      searchLoading: false,
      materialType: null,
      adForm: {
        share: 1,
        count: null,
        edate: '',
        sdate: '',
        purl: '',
        lurl: '',
        wiid: '',
        title: '',
        marketid: null,
        lurl: '',
        plogo: '',
        pinfo: '',
        lurl: '',
        llogo: '',
        linfo: '',
        state: 0
      }
    }
  },
  created() {
    this.setting.loading = true
    this.getAuthList()
    this.getMarket()
    this.adID = this.$route.params.uid
    if (this.adID) {
      this.getAd()
    } else {
      this.setting.loading = false
    }
  },
  methods: {
    getAd() {
      ad.getAd(this, this.adID)
        .then(res => {
          this.adForm = res
          if (res.purl || res.lurl) {
            if (res.purl.indexOf('mp4') > -1 || res.lurl.indexOf('mp4') > -1) {
              this.type = '1'
            } else {
              this.type = '0'
            }
          }
          if (res.playnum >= 100) {
            this.putType = '1'
            this.adForm.count = res.playnum
          } else {
            this.putType = '0'
            this.adForm.count = res.looknum
          }
          this.setting.loading = false
        })
        .catch(err => {
          console.log(err)
          this.setting.loading = false
        })
    },
    next(step) {
      switch (step) {
        case 'one':
          this.$refs['adForm'].validate(valid => {
            if (valid) {
              this.stepOne = false
              this.stepTwo = true
            }
          })
          break
        default:
          break
      }
    },
    prev(step) {
      switch (step) {
        case 'two':
          this.stepOne = true
          this.stepTwo = false
          break
        default:
          break
      }
    },
    handlePictureClose(data) {
      if (data && data.length > 0 && data[0].url) {
        switch (this.materialType) {
          case 'purl':
            this.adForm.purl = data[0].url
            break
          case 'lurl':
            this.adForm.lurl = data[0].url
            break
          case 'plogo':
            this.adForm.plogo = data[0].url
            break
          case 'llogo':
            this.adForm.llogo = data[0].url
            break
          case 'pinfo':
            this.adForm.pinfo = data[0].url
            break
          case 'linfo':
            this.adForm.linfo = data[0].url
            break
          default:
            break
        }
      } else {
        this.materialType = null
      }
    },
    handleVideoClose(data) {
      if (data && data.length > 0 && data[0].url) {
        switch (this.materialType) {
          case 'purl':
            this.adForm.purl = data[0].url
            break
          case 'lurl':
            this.adForm.lurl = data[0].url
            break
          default:
            break
        }
      } else {
        this.materialType = null
      }
    },
    handleImageDelete(type) {
      switch (type) {
        case 'purl':
          this.adForm.purl = ''
          break
        case 'horizontal':
          this.adForm.lurl = ''
          break
        case 'plogo':
          this.adForm.plogo = ''
          break
        case 'llogo':
          this.adForm.llogo = ''
          break
        case 'pinfo':
          this.adForm.pinfo = ''
          break
        case 'linfo':
          this.adForm.linfo = ''
          break
        case 'purl':
          this.adForm.purl = ''
          break
        case 'lurl':
          this.adForm.lurl = ''
          break
        default:
          break
      }
    },
    handleOpenPane(type) {
      this.materialType = type
      this.panelVisible = true
    },
    handleOpenVideo(type) {
      this.materialType = type
      this.videoVisible = true
    },
    submit(formName) {
      if (this.adID) {
        this.modifyAd()
      } else {
        this.createAd()
      }
    },
    resourceChange() {
      if (!this.adID) {
        this.adForm.purl = ''
        this.adForm.lurl = ''
      }
    },
    getAuthList() {
      this.searchLoading = true
      let args = {
        include: 'ar_user,weixin_auth'
      }
      getAuthList(this, args)
        .then(res => {
          this.authList = res
          this.searchLoading = false
        })
        .catch(err => {
          this.searchLoading = false
          console.log(err)
        })
    },
    getMarket() {
      this.searchLoading = true
      getMarket(this)
        .then(res => {
          this.marketList = res
          this.searchLoading = false
        })
        .catch(err => {
          console.log(err)
          this.searchLoading = false
        })
    },
    createAd() {
      this.adForm.edate = utils.handleDateTransform(this.adForm.edate)
      let args = this.adForm
      if (this.putType === '0') {
        args.looknum = this.adForm.count
      } else {
        args.playnum = this.adForm.count
      }
      delete args.count
      ad.createAd(this, args)
        .then(res => {
          this.$message({
            message: '创建成功',
            type: 'success'
          })
          this.$router.push({
            path: '/ad/list'
          })
        })
        .catch(err => {
          console.log(err)
        })
    },
    modifyAd() {
      this.adForm.edate = utils.handleDateTransform(this.adForm.edate)
      let args = this.adForm
      let adId = this.adID
      if (this.putType === '0') {
        args.looknum = this.adForm.count
      } else {
        args.playnum = this.adForm.count
      }
      delete args.count
      ad.createAd(this, args, adId)
        .then(res => {
          this.$message({
            message: '修改成功',
            type: 'success'
          })
          this.$router.push({
            path: '/ad/list'
          })
        })
        .catch(err => {
          console.log(err)
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
