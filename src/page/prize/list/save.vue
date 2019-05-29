<template>
  <div class="item-wrap-template">
    <div 
      v-loading="setting.loading" 
      :element-loading-text="setting.loadingText" 
      class="pane">
      <el-form 
        ref="prizeForm" 
        :model="prizeForm" 
        label-position="top">
        <div class="prize">
          <h4 class="prize-title">{{ prizeID ? '编辑奖品': '新增奖品' }}</h4>
          <el-tabs 
            v-model="activeName" 
            type="card" 
            class="prize-tabs" 
            @tab-click="handleClick">
            <el-tab-pane 
              label="奖品设置" 
              name="first">
              <el-form-item
                :rules="[{ required: true, message: '请填写奖品名称', trigger: 'submit'}]"
                label="奖品名称"
                prop="name"
              >
                <el-input 
                  v-model="prizeForm.name" 
                  placeholder="请填写奖品名称" 
                  clearable>
                  <i 
                    slot="prefix" 
                    class="el-input__icon el-icon-name el-icon-same"/>
                </el-input>
              </el-form-item>
              <el-form-item 
                label="使用说明" 
                prop="description">
                <el-input
                  v-model="prizeForm.description"
                  :autosize="{ minRows: 2, maxRows: 10}"
                  type="textarea"
                  placeholder="请输入使用说明"
                  class="item-input"
                />
              </el-form-item>
              <el-form-item 
                label="图片" 
                prop="image_url">
                <div 
                  class="pirze-uploader" 
                  @click="panelVisible=true">
                  <img 
                    v-if="url" 
                    :src="prizeForm.image_url" 
                    class="pirze">
                  <i 
                    v-else 
                    class="el-icon-plus pirze-uploader-icon"/>
                </div>
              </el-form-item>
              <el-form-item 
                label="跳转链接" 
                prop="redirect_url">
                <el-input
                  v-model="prizeForm.redirect_url"
                  placeholder="请输入跳转链接"
                  class="item-input"
                />
              </el-form-item>
              <el-form-item 
                label=" " 
                prop="is_active">
                <div class="status">
                  <div class="status-item">状态</div>
                  <el-radio-group v-model="prizeForm.is_active">
                    <el-radio :label="1">启用</el-radio>
                    <el-radio :label="0">停用</el-radio>
                  </el-radio-group>
                </div>
              </el-form-item>
            </el-tab-pane>
            <el-tab-pane 
              label="使用设置" 
              name="second">
              <el-form-item
                :rules="[{ required: true, message: '请填写剩余库存', trigger: 'submit'}]"
                label="剩余库存"
                prop="stock"
              >
                <el-input 
                  v-model="prizeForm.stock" 
                  placeholder="请填写剩余库存" 
                  clearable>
                  <i 
                    slot="prefix" 
                    class="el-input__icon el-icon-type el-icon-same"/>
                </el-input>
              </el-form-item>
              <el-form-item
                :rules="[{ required: true, message: '请填写每人每天最大获取数', trigger: 'submit'}]"
                label="每人每天最大获取数"
                prop="people_max_get"
              >
                <el-input
                  v-model="prizeForm.people_max_get"
                  placeholder="请输入每人每天最大获取数"
                  class="item-input"
                />
              </el-form-item>
              <el-form-item
                :rules="[{ required: true, message: '请填写每天最大获取数', trigger: 'submit'}]"
                label="每天最大获取数"
                prop="day_max_get"
              >
                <el-input
                  v-model="prizeForm.day_max_get"
                  placeholder="请输入每天最大获取数"
                  class="item-input"
                />
              </el-form-item>
              <el-form-item
                :rules="[{ required: true, message: '请选择开始时间', trigger: 'submit'}]"
                label="开始时间"
                prop="start_date"
              >
                <el-date-picker
                  v-model="prizeForm.start_date"
                  :editable="false"
                  type="datetime"
                  placeholder="请选择开始时间"
                />
              </el-form-item>
              <el-form-item
                :rules="[{ required: true, message: '请选择结束时间', trigger: 'submit'}]"
                label="结束时间"
                prop="end_date"
              >
                <el-date-picker
                  v-model="prizeForm.end_date"
                  :editable="false"
                  type="datetime"
                  placeholder="请选择结束时间"
                />
              </el-form-item>
            </el-tab-pane>
          </el-tabs>
        </div>
        <el-form-item class="btn-wrap">
          <el-button 
            class="el-button-success" 
            @click="submit('prizeForm')">保存</el-button>
          <el-button 
            class="el-button-cancel" 
            @click="back">返回</el-button>
        </el-form-item>
      </el-form>
    </div>
    <PicturePanel
      :panel-visible.sync="panelVisible"
      :single-flag="singleFlag"
      @close="handleClose"
    />
  </div>
</template>

<script>
import {
  historyBack,
  modifyPrize,
  prizeDetails,
  handleDateTypeTransform,
  savePrize
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
  Tabs,
  TabPane
} from "element-ui";
import moment from "moment";
import "./listPirze.less";
import PicturePanel from "components/common/picturePanel";

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
    ElInput: Input,
    ElTabs: Tabs,
    ElTabPane: TabPane,
    PicturePanel
  },
  data() {
    return {
      singleFlag: true,
      panelVisible: false,
      activeName: "first",
      setting: {
        isOpenSelectAll: true,
        loading: false,
        loadingText: "拼命加载中"
      },
      prizeID: null,
      searchLoading: false,
      prizeForm: {
        name: null,
        stock: null,
        is_active: 1,
        description: "",
        start_date: null,
        end_date: null,
        image_url: "",
        redirect_url: "",
        people_max_get: "",
        day_max_get: ""
      },
      url: ""
    };
  },
  mounted() {},
  created() {
    this.prizeID = this.$route.params.uid;
    if (this.prizeID) {
      this.prizeDetails();
    }
  },
  methods: {
    handleClose(data) {
      if (data && data.length > 0) {
        let { url } = data[0];
        this.prizeForm.image_url = url;
        this.url = url;
      }
    },
    handleClick() {},
    prizeDetails() {
      this.setting.loading = true;
      let args = {
        include: "company,market,point,writeOffMarket,writeOffStore"
      };
      prizeDetails(this, this.prizeID, args)
        .then(res => {
          this.setting.loading = false;
          let {
            name,
            stock,
            description,
            start_date,
            end_date,
            is_active,
            image_url,
            redirect_url,
            people_max_get,
            day_max_get
          } = res;
          this.url = image_url
          this.prizeForm.day_max_get = day_max_get;
          this.prizeForm.people_max_get = people_max_get;
          this.prizeForm.redirect_url = redirect_url;
          this.prizeForm.image_url = image_url;
          this.prizeForm.name = name;
          this.prizeForm.stock = stock;
          this.prizeForm.description = description;
          this.prizeForm.start_date = start_date;
          this.prizeForm.end_date = end_date;
          this.prizeForm.is_active = is_active;
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
          let args = this.prizeForm;
          let start_date = args.start_date;
          let end_date = args.end_date;
          args.start_date = moment(start_date).format("YYYY-MM-DD HH:mm:ss");
          args.end_date = moment(end_date).format("YYYY-MM-DD HH:mm:ss");
          if (args.image_url === "") {
            delete args.image_url;
          }
          if (args.redirect_url === "") {
            delete args.redirect_url;
          }
          if (args.description === "") {
            delete args.description;
          }
          if (this.prizeID) {
            modifyPrize(this, this.prizeID, args)
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
          } else {
            savePrize(this, args)
              .then(res => {
                this.setting.loading = false;
                this.$message({
                  message: "新增成功",
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
  .pirze-uploader {
    width: 178px;
    min-height: 178px;
    line-height: 178px;
    border: 1px dashed #6b3dc4;
    border-radius: 6px;
  }
  .pirze-uploader .el-upload {
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .pirze-uploader .el-upload:hover {
    border-color: #409eff;
  }
  .pirze-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    min-height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .pirze {
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
      width: 300px;
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
    .el-radio:last-child {
      margin-left: 60px;
    }
    .el-radio-group {
      padding-left: 15px;
    }

    .status {
      background: #fff;
      width: 300px;
      .status-item {
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
