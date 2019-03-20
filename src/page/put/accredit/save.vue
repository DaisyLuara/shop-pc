<template>
  <div class="item-wrap-template">
    <div v-loading="setting.loading" :element-loading-text="setting.loadingText" class="pane">
      <div class="pane-title">{{ AccreditID ? '编辑授权投放' : '新增授权投放' }}</div>
      <el-form ref="accreditForm" :model="accreditForm" label-width="150px">
        <div class="deploy-model">
          <h4 class="deploy-model-title">投放基础配置</h4>
          <el-form-item
            :rules="[{ required: true, message: '请选择点位', trigger: 'submit'}]"
            label="点位"
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
            label="节目"
            prop="piid"
          >
            <el-select
              v-model="accreditForm.piid"
              :loading="searchLoading"
              placeholder="请选择节目"
              filterable
              clearable
            >
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
            label="类型"
            prop="type"
          >
            <el-select
              v-model="accreditForm.type"
              :loading="searchLoading"
              placeholder="请选择类型"
              filterable
              clearable
            >
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
            label="授权链接"
            prop="wiid"
          >
            <el-select
              v-model="accreditForm.wiid"
              :loading="searchLoading"
              placeholder="请选择授权链接"
              filterable
              clearable
            >
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
            label="状态"
            prop="visiable"
          >
            <el-radio-group v-model="accreditForm.visiable">
              <el-radio :label="1">运营中</el-radio>
              <el-radio :label="0">下架</el-radio>
            </el-radio-group>
          </el-form-item>
        </div>
        <div class="deploy-model">
          <h4 class="deploy-model-title">脱机配置</h4>
          <!-- <el-form-item label="脱机支持" prop="off_support">
            <el-radio-group v-model="accreditForm.off_support">
              <el-radio :label="1">微信场景码</el-radio>
              <el-radio :label="0">指定链接</el-radio>
            </el-radio-group>
          </el-form-item>-->
          <el-form-item label="脱机链接" prop="reply_url">
            <el-input
              v-model="accreditForm.reply_url"
              :autosize="{ minRows: 2, maxRows: 10}"
              type="textarea"
              placeholder="请输入脱机链接"
              class="item-input"
            />
          </el-form-item>
        </div>
        <el-form-item>
          <el-button class="el-button-success" @click="submit('accreditForm')">保存</el-button>
          <el-button class="el-button-cancel" @click="back">返回</el-button>
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
  modifyLaunchWechat
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
    }
  },
  methods: {
    back() {
      historyBack();
    },
    modifyLaunchWechat() {
      modifyLaunchWechat(this, args)
        .then(res => {})
        .catch(err => {});
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
.item-wrap-template {
  .deploy-model {
    border-top: 1px solid #6b3dc4;
    .deploy-model-title {
      padding: 20px 0;
      font-size: 14px;
      font-weight: 600;
      text-indent: 20px;
    }
  }
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
