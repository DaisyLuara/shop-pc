<template>
  <div class="item-wrap-template">
    <div 
      v-loading="setting.loading" 
      :element-loading-text="setting.loadingText" 
      class="pane">
      <!-- <div class="pane-title">{{ AccreditID ? '编辑授权投放' : '新增授权投放' }}</div> -->
      <el-form 
        ref="accreditForm" 
        :model="accreditForm">
        <div class="deploy-model">
          <h4 class="deploy-model-title">投放基础配置</h4>
          <el-form-item
            :rules="[{ required: true, message: '请选择点位', trigger: 'submit'}]"
            label=" "
            prop="oid"
          >
            <el-select
              v-model="accreditForm.oid"
              :loading="searchLoading"
              :disabled="AccreditID ? true : false"
              placeholder="请选择点位"
              filterable
              clearable
            >
              <i 
                slot="prefix" 
                class="el-input__icon el-icon-name el-icon-same"/>
              <el-option
                v-for="item in pointList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            :rules="[{ required: true, message: '请选择节目', trigger: 'submit'}]"
            label=" "
            prop="piid"
          >
            <el-select
              v-model="accreditForm.piid"
              :loading="searchLoading"
              placeholder="请选择节目"
              filterable
              clearable
            >
              <i 
                slot="prefix" 
                class="el-input__icon el-icon-project el-icon-same"/>

              <el-option
                v-for="item in projectList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            :rules="[{ required: true, message: '请选择类型', trigger: 'submit'}]"
            label=" "
            prop="type"
          >
            <el-select
              v-model="accreditForm.type"
              :loading="searchLoading"
              placeholder="请选择类型"
              filterable
              clearable
            >
              <i 
                slot="prefix" 
                class="el-input__icon el-icon-auth-type el-icon-same"/>

              <el-option
                v-for="item in typeList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            :rules="[{ required: true, message: '请选择授权链接', trigger: 'submit'}]"
            label=" "
            prop="wiid"
          >
            <el-select
              v-model="accreditForm.wiid"
              :loading="searchLoading"
              placeholder="请选择授权链接"
              filterable
              clearable
            >
              <i 
                slot="prefix" 
                class="el-input__icon el-icon-link el-icon-same"/>
              <el-option
                v-for="item in linkList"
                :key="item.id"
                :label="item.nick_name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            :rules="[{ required: true, message: '请选择状态', trigger: 'submit'}]"
            label=" "
            prop="visiable"
            style="padding-left:20px;"
          >
            <div class="status-device">
              <div class="status-devic-item">状态</div>
              <el-radio-group v-model="accreditForm.visiable">
                <el-radio :label="1">运营中</el-radio>
                <el-radio :label="0">下架</el-radio>
              </el-radio-group>
            </div>
          </el-form-item>
        </div>
        <div 
          class="deploy-model" 
          style="padding-left:20px">
          <h4 
            class="deploy-model-title" 
            style="padding-left:0">脱机配置</h4>
          <!-- <el-form-item label="脱机支持" prop="off_support">
            <el-radio-group v-model="accreditForm.off_support">
              <el-radio :label="1">微信场景码</el-radio>
              <el-radio :label="0">指定链接</el-radio>
            </el-radio-group>
          </el-form-item>-->
          <el-form-item 
            label=" " 
            prop="reply_url">
            <el-input
              v-model="accreditForm.reply_url"
              :autosize="{ minRows: 2, maxRows: 10}"
              type="textarea"
              placeholder="请输入脱机链接"
              class="item-input"
            />
          </el-form-item>
        </div>
        <el-form-item class="btn-wrap">
          <el-button 
            class="el-button-success" 
            @click="submit('accreditForm')">保存</el-button>
          <el-button 
            class="el-button-cancel" 
            @click="back">返回</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import {
  historyBack,
  saveLaunchWechat,
  getPoint,
  getProject,
  getAuthorizer,
  modifyLaunchWechat,
  getLaunchWechatDetail
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
import { truncate } from "fs";

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
      AccreditID: null,
      pointList: [],
      typeList: [
        {
          id: 0,
          name: "小程序"
        },
        {
          id: 1,
          name: "订阅号"
        },
        {
          id: 2,
          name: "服务号"
        },
        {
          id: 100,
          name: "手机号"
        },
        {
          id: 101,
          name: "普通"
        },
        {
          id: 102,
          name: "本地"
        },
        {
          id: 200,
          name: "天猫"
        }
      ],
      projectList: [],
      linkList: [],
      searchLoading: false,
      accreditForm: {
        piid: null,
        type: "",
        wiid: null,
        visiable: 1,
        oid: null,
        reply_url: ""
      }
    };
  },
  mounted() {},
  created() {
    this.getProject();
    this.getPoint();
    this.getAuthorizer();
    this.AccreditID = this.$route.params.uid;
    if (this.AccreditID) {
      this.getLaunchWechatDetail();
    }
  },
  methods: {
    getLaunchWechatDetail() {
      this.setting.loading = true;
      let args = {
        include: "point.market.area,project,wechat"
      };
      getLaunchWechatDetail(this, this.AccreditID, args)
        .then(res => {
          this.setting.loading = false;
          this.accreditForm.oid = res.point.id;
          this.accreditForm.piid = res.project.id;
          this.accreditForm.type = res.type.id;
          this.accreditForm.wiid = res.wiid;
          this.accreditForm.reply_url = res.reply_url;
          this.accreditForm.visiable = res.visiable;
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
    getAuthorizer() {
      this.searchLoading = true;
      getAuthorizer(this)
        .then(response => {
          this.linkList = response;
          this.searchLoading = false;
        })
        .catch(err => {
          this.searchLoading = false;
          this.$message({
            message: err.response.data.message,
            type: "success"
          });
        });
    },
    getProject() {
      this.searchLoading = true;
      getProject(this)
        .then(response => {
          this.projectList = response;
          this.searchLoading = false;
        })
        .catch(err => {
          this.searchLoading = false;
          this.$message({
            message: err.response.data.message,
            type: "success"
          });
        });
    },
    getPoint() {
      this.searchLoading = true;
      getPoint(this)
        .then(response => {
          this.pointList = response;
          this.searchLoading = false;
        })
        .catch(err => {
          this.searchLoading = false;
          this.$message({
            message: err.response.data.message,
            type: "success"
          });
        });
    },
    submit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.setting.loading = true;
          let args = this.accreditForm;
          if (this.AccreditID) {
            modifyLaunchWechat(this, this.AccreditID, args)
              .then(res => {
                this.setting.loading = false;
                this.$message({
                  message: "修改成功",
                  type: "success"
                });
                this.$router.push({
                  path: "/put/accredit"
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
            saveLaunchWechat(this, args)
              .then(response => {
                this.setting.loading = false;
                this.$message({
                  message: "添加成功",
                  type: "success"
                });
                this.$router.push({
                  path: "/put/accredit"
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
  .deploy-model {
    .deploy-model-title {
      color: #6b3dc4;
      padding: 15px 20px 15px 15px;
      font-size: 16px;
    }
  }
  .pane {
    border-radius: 5px;
    padding: 20px 40px 80px;
    .el-form-item {
      margin-bottom: 20px;
    }
    .el-select,
    .item-input,
    .el-date-editor.el-input {
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

    .status-device {
      background: #fff;
      width: 300px;
      .status-devic-item {
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
