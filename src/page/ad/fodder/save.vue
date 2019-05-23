<template>
  <div class="item-wrap-template">
    <div v-loading="setting.loading" :element-loading-text="setting.loadingText" class="pane">
      <el-form ref="fodderForm" :model="fodderForm" label-position="top">
        <div class="prize">
          <h4 class="prize-title">{{ fodderID ? '编辑广告素材' : '新增广告素材'}}</h4>
          <el-form-item
            :rules="[{ required: true, message: '请填写广告素材名称', trigger: 'submit'}]"
            label="广告素材名称"
            prop="name"
          >
            <el-input v-model="fodderForm.name" placeholder="请填写广告素材名称" clearable>
              <i slot="prefix" class="el-input__icon el-icon-name el-icon-same"/>
            </el-input>
          </el-form-item>
          <el-form-item label=" " prop="type">
            <div class="type">
              <div class="type-item">类型</div>
              <el-radio-group v-model="fodderForm.type">
                <el-radio :label="0">静态图</el-radio>
                <el-radio :label="1">GIF</el-radio>
                <el-radio :label="2">帧序列</el-radio>
                <el-radio :label="3">视频</el-radio>
              </el-radio-group>
            </div>
          </el-form-item>
          <!-- <el-form-item
            :rules="[{ required: true, message: '请填写附件', trigger: 'submit'}]"
            label="附件"
            prop="stock"
          >
            <el-input v-model="fodderForm.stock" placeholder="请填写剩余库存" clearable>
              <i slot="prefix" class="el-input__icon el-icon-type el-icon-same"/>
            </el-input>
          </el-form-item>-->
          <el-form-item
            :rules="[{ required: true, message: '请上传附件', trigger: 'submit'}]"
            label="附件"
            prop="media_id"
          >
            <div class="fodder-uploader" @click="panelVisible=true">
              <img v-if="fodderForm.url" :src="fodderForm.url" class="fodder">
              <i v-else class="el-icon-plus fodder-uploader-icon"/>
            </div>
          </el-form-item>

          <el-form-item label=" " prop="remark">
            <div class="type">
              <div class="type-item">广告标记</div>
              <el-radio-group v-model="fodderForm.remark">
                <el-radio :label="0">显示</el-radio>
                <el-radio :label="1">隐藏</el-radio>
              </el-radio-group>
            </div>
          </el-form-item>
        </div>
        <el-form-item class="btn-wrap">
          <el-button class="el-button-success" @click="submit('fodderForm')">保存</el-button>
          <el-button class="el-button-cancel" @click="back">返回</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import {
  historyBack,
  modifyPrize,
  prizeDetails,
  handleDateTypeTransform
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
  Radio
} from "element-ui";
import moment from "moment";

export default {
  components: {
    ElForm: Form,
    ElSelect: Select,
    ElOption: Option,
    ElFormItem: FormItem,
    ElButton: Button,
    ElDatePicker: DatePicker,
    ElRadioGroup: RadioGroup,
    ElRadio: Radio,
    ElInput: Input
  },
  data() {
    return {
      setting: {
        isOpenSelectAll: true,
        loading: false,
        loadingText: "拼命加载中"
      },
      fodderID: null,
      searchLoading: false,
      fodderForm: {
        name: null,
        url: "",
        type: 1,
        remark: 0
      }
    };
  },
  mounted() {},
  created() {
    this.fodderID = this.$route.params.uid;
    // this.prizeDetails();
  },
  methods: {
    prizeDetails() {
      this.setting.loading = true;
      let args = {
        include: "company,market,point,writeOffMarket,writeOffStore"
      };
      prizeDetails(this, this.fodderID, args)
        .then(res => {
          this.setting.loading = false;
          let { name, stock, description, start_date, end_date, type } = res;
          this.fodderForm.name = name;
          this.fodderForm.stock = stock;
          this.fodderForm.description = description;
          this.fodderForm.start_date = start_date;
          this.fodderForm.end_date = end_date;
          this.fodderForm.type = type;
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
          let start_date = args.start_date;
          let end_date = args.end_date;
          args.start_date = moment(start_date).format("YYYY-MM-DD HH:mm:ss");
          args.end_date = moment(end_date).format("YYYY-MM-DD HH:mm:ss");
          modifyPrize(this, this.fodderID, args)
            .then(res => {
              this.setting.loading = false;
              this.$message({
                message: "修改成功",
                type: "success"
              });
              this.$router.push({
                path: "/prize/list"
              });
            })
            .catch(err => {
              this.$message({
                message: err.response.data.message,
                type: "success"
              });
              this.setting.loading = false;
            });
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
    height: 178px;
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
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .fodder {
    width: 178px;
    height: 178px;
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
