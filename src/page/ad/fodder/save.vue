<template>
  <div class="item-wrap-template">
    <div
      v-loading="setting.loading"
      :element-loading-text="setting.loadingText"
      class="pane"
    >
      <el-form
        ref="fodderForm"
        :model="fodderForm"
        label-position="top"
      >
        <div class="prize">
          <h4 class="prize-title">{{ fodderID ? '编辑广告素材' : '新增广告素材' }}</h4>
          <el-form-item
            :rules="[{ required: true, message: '请填写广告素材名称', trigger: 'submit'}]"
            label="广告素材名称"
            prop="name"
          >
            <el-input
              v-model="fodderForm.name"
              placeholder="请填写广告素材名称"
              clearable
            >
              <i
                slot="prefix"
                class="el-input__icon el-icon-name el-icon-same"
              />
            </el-input>
          </el-form-item>
          <el-form-item
            label=" "
            prop="type"
          >
            <div class="type">
              <div class="type-item">类型</div>
              <el-radio-group
                v-model="fodderForm.type"
                @change="typeHandle"
              >
                <el-radio
                  v-for="type in typeList"
                  :label="type.id"
                  :key="type.id"
                >{{ type.name }}</el-radio>
              </el-radio-group>
            </div>
          </el-form-item>
          <el-form-item
            :rules="[{ required: true, message: '请上传附件', trigger: 'submit'}]"
            label="附件"
            prop="link"
          >
            <div
              v-if="fodderForm.type!=='video'"
              class="fodder-uploader"
              @click="panelVisible=true"
            >
              <img
                v-if="url"
                :src="fodderForm.link"
                class="fodder"
              >
              <i
                v-else
                class="el-icon-plus fodder-uploader-icon"
              />
            </div>

            <div
              v-if="fodderForm.type==='video'"
              class="fodder-uploader"
              @click="videoPanelVisible=true"
            >
              <video
                v-if="url"
                :src="fodderForm.link"
                controls="controls"
                class="fodder"
              >您的浏览器不支持</video>
              <i
                v-else
                class="el-icon-plus fodder-uploader-icon"
              />
            </div>
          </el-form-item>
          <el-form-item
            label=" "
            prop="isad"
          >
            <div class="type">
              <div class="type-item">广告标记
                <el-tooltip class="item" effect="dark" 
                  content="《互联网广告管理暂行办法》第七条　互联网广告应当具有可识别性，显著标明“广告”，使消费者能够辨明其为广告。" 
                  placement="right">
                  <i class="el-icon-info"/>
                </el-tooltip>
              </div>
              <el-radio-group v-model="fodderForm.isad">
                <el-radio :label="1">显示</el-radio>
                <el-radio :label="0">隐藏</el-radio>
              </el-radio-group>
            </div>
          </el-form-item>
        </div>
        <el-form-item class="btn-wrap">
          <el-button
            class="el-button-success"
            @click="submit('fodderForm')"
          >保存</el-button>
          <el-button
            class="el-button-cancel"
            @click="back"
          >返回</el-button>
        </el-form-item>
      </el-form>
    </div>
    <PicturePanel
      :panel-visible.sync="panelVisible"
      :single-flag="singleFlag"
      @close="handleClose"
    />
    <VideoPanel
      :video-panel-visible.sync="videoPanelVisible"
      :video-single-flag="videoSingleFlag"
      @close="handleClose"
    />
  </div>
</template>

<script>
import {
  historyBack,
  modifyAdMedia,
  getAdMediaDetail,
  saveAdMedia
} from "service";
import {
  Form,
  Select,
  Option,
  FormItem,
  Button,
  Input,
  DatePicker,
  MessageBox,
  RadioGroup,
  Radio,
  Tooltip
} from "element-ui";
import PicturePanel from "components/common/picturePanel";
import VideoPanel from "components/common/videoPanel";

export default {
  components: {
    ElForm: Form,
    ElSelect: Select,
    ElOption: Option,
    ElFormItem: FormItem,
    ElButton: Button,
    ElRadioGroup: RadioGroup,
    ElRadio: Radio,
    ElInput: Input,
    PicturePanel,
    VideoPanel,
    ElTooltip: Tooltip
  },
  data() {
    return {
      videoPanelVisible: false,
      panelVisible: false,
      singleFlag: true,
      videoSingleFlag: true,
      setting: {
        isOpenSelectAll: true,
        loading: false,
        loadingText: "拼命加载中"
      },
      typeList: [
        {
          id: "static",
          name: "静态图"
        },
        {
          id: "gif",
          name: "Gif"
        },
        {
          id: "video",
          name: "视频"
        }
        // {
        //   id: "fps",
        //   name: "帧序列"
        // }
      ],
      fodderID: null,
      searchLoading: false,
      fodderForm: {
        name: null,
        link: "",
        type: "static",
        isad: 1
      },
      url: ""
    };
  },
  mounted() { },
  created() {
    this.fodderID = this.$route.params.uid;
    if (this.fodderID) {
      this.getAdMediaDetail();
    }
  },
  methods: {
    typeHandle(val) {
      this.url = "";
      this.fodderForm.link = "";
    },
    handleClose(data) {
      if (data && data.length > 0) {
        let { link, url } = data[0];
        this.fodderForm.link = url;
        this.url = url;
      }
    },
    getAdMediaDetail() {
      this.setting.loading = true;
      getAdMediaDetail(this, this.fodderID)
        .then(res => {
          this.setting.loading = false;
          let { name, link, type, isad } = res;
          this.fodderForm.name = name;
          this.fodderForm.link = link;
          this.url = link;
          this.fodderForm.type = type;
          this.fodderForm.isad = isad;
        })
        .catch(err => {
          this.setting.loading = false;
          this.$message({
            message: err.response.data.message,
            type: "success"
          });
        });
    },
    back() {
      historyBack();
    },
    submit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.setting.loading = true;
          let args = this.fodderForm;
          if (this.fodderID) {
            modifyAdMedia(this, this.fodderID, args)
              .then(res => {
                this.setting.loading = false;
                this.$message({
                  message: "修改成功",
                  type: "success"
                });
                this.$router.push({
                  path: "/ad/fodder"
                });
              })
              .catch(err => {
                this.$message({
                  message: err.response.data.message,
                  type: "warning"
                });
                this.setting.loading = false;
              });
          } else {
            saveAdMedia(this, args)
              .then(res => {
                this.setting.loading = false;
                this.$message({
                  message: "新增成功",
                  type: "success"
                });
                this.$router.push({
                  path: "/ad/fodder"
                });
              })
              .catch(err => {
                this.$message({
                  message: err.response.data.message,
                  type: "warning"
                });
                this.setting.loading = false;
              });
          }
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
@imgurl: "https://cdn.xingstation.cn/ad_shop/img/";
.item-wrap-template {
  .prize {
    .prize-title {
      color: #6b3dc4;
      padding: 15px 20px 15px 0px;
      font-size: 16px;
    }
  }
  .fodder-uploader {
    width: 178px;
    min-height: 178px;
    line-height: 178px;
    border: 1px dashed #6b3dc4;
    border-radius: 6px;
  }
  .fodder-uploader .el-upload {
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .fodder-uploader .el-upload:hover {
    border-color: #409eff;
  }
  .fodder-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    min-height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .fodder {
    width: 178px;
    min-height: 178px;
    display: block;
  }
  .pane {
    border-radius: 5px;
    padding: 20px 40px 80px;
    .el-form-item {
      margin-bottom: 15px;
    }
    .el-select,
    .el-input,
    .item-input,
    .el-textarea .el-date-editor.el-input {
      width: 350px;
    }
    .btn-wrap {
      padding-left: 20px;
    }
    .item-list {
      .program-title {
        color: #555;
        font-size: 14px;
      }
    }
    .el-radio-group {
      padding-left: 15px;
    }

    .type {
      background: #fff;
      width: 350px;
      .type-item {
        padding-left: 15px;
        background: #6b3dc4;
        color: #fff;
      }
    }
    .pane-title {
      color: #6b3dc4;
      display: flex;
      font-size: 18px;
      flex-direction: row;
      justify-content: space-between;
      padding-bottom: 20px;
    }
  }
}
</style>
