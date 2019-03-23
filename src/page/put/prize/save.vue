<template>
  <div class="item-wrap-template">
    <div v-loading="setting.loading" :element-loading-text="setting.loadingText" class="pane">
      <div class="pane-title">{{ pirzeLaunchId ? '修改奖品投放': '新增奖品投放' }}</div>
      <el-form ref="prizeLaunchForm" :model="prizeLaunchForm">
        <el-form-item
          :rules="[{ required: true, message: '请选择模版', trigger: 'submit'}]"
          label=" "
          prop="policy_id"
        >
          <el-select
            v-model="prizeLaunchForm.policy_id"
            :loading="searchLoading"
            placeholder="请选择模版"
            filterable
            clearable
          >
            <i slot="prefix" class="el-input__icon el-icon-name el-icon-same"/>
            <el-option
              v-for="item in policyList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          :rules="[{ required: true, message: '请选择点位', trigger: 'submit'}]"
          label=" "
          prop="oid"
        >
          <el-select
            v-model="prizeLaunchForm.oid"
            :loading="searchLoading"
            placeholder="请选择点位"
            filterable
            clearable
          >
            <i slot="prefix" class="el-input__icon el-icon-name el-icon-same"/>
            <el-option
              v-for="item in pointList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          :rules="[{ required: true, message: '请输入节目名称', trigger: 'submit'}]"
          label=" "
          prop="project_id"
        >
          <el-select
            v-model="prizeLaunchForm.project_id"
            :loading="searchLoading"
            filterable
            placeholder="请选择节目"
            clearable
          >
            <i slot="prefix" class="el-input__icon el-icon-project el-icon-same"/>
            <el-option
              v-for="item in projectList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item class="btn-wrap">
          <el-button class="el-button-success" @click="submit('prizeLaunchForm')">完成</el-button>
          <el-button class="el-button-cancel" @click="back">返回</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import {
  historyBack,
  saveLaunchPirze,
  getProject,
  getPoint,
  modifyLaunchPirze,
  getLaunchPirzeDetail,
  getPirzeTemplate
} from "service";
import {
  Form,
  Select,
  Option,
  FormItem,
  Button,
  Input,
  DatePicker,
  MessageBox
} from "element-ui";

export default {
  components: {
    ElForm: Form,
    ElSelect: Select,
    ElOption: Option,
    ElFormItem: FormItem,
    ElButton: Button,
    ElDatePicker: DatePicker
  },
  data() {
    return {
      pirzeLaunchId: null,
      setting: {
        isOpenSelectAll: true,
        loading: false,
        loadingText: "拼命加载中"
      },
      policyList: [],
      pointList: [],
      projectList: [],
      searchLoading: false,
      prizeLaunchForm: {
        project_id: null,
        oid: null,
        policy_id: null
      }
    };
  },
  mounted() {},
  created() {
    this.getProject();
    this.getPoint();
    this.getPirzeTemplate();
    this.pirzeLaunchId = this.$route.params.uid;
    if (this.pirzeLaunchId) {
      this.getLaunchPirzeDetail();
    }
  },
  methods: {
    getLaunchPirzeDetail() {
      this.setting.loading = true;
      let args = {
        include: "point.market,project,policy"
      };
      getLaunchPirzeDetail(this, this.pirzeLaunchId, args)
        .then(res => {
          this.prizeLaunchForm.project_id = res.project.id;
          this.prizeLaunchForm.oid = res.point.id;
          this.prizeLaunchForm.policy_id = res.policy.id;
          this.setting.loading = false;
        })
        .catch(err => {
          this.setting.loading = false;
          this.$message({
            message: err.response.data.message,
            type: "success"
          });
        });
    },
    getPirzeTemplate() {
      this.searchLoading = true;
      getPirzeTemplate(this)
        .then(res => {
          this.policyList = res;
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
        .then(res => {
          this.pointList = res;
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
        .then(res => {
          this.projectList = res;
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
    back() {
      historyBack();
    },
    submit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.setting.loading = true;
          let args = this.prizeLaunchForm;
          if (this.pirzeLaunchId) {
            modifyLaunchPirze(this, this.pirzeLaunchId, args)
              .then(response => {
                this.setting.loading = false;
                this.$message({
                  message: "修改成功",
                  type: "success"
                });
                this.$router.push({
                  path: "/put/prize"
                });
              })
              .catch(err => {
                this.setting.loading = false;
                this.$message({
                  message: err.response.data.message,
                  type: "success"
                });
              });
          } else {
            saveLaunchPirze(this, args)
              .then(response => {
                this.setting.loading = false;
                this.$message({
                  message: "添加成功",
                  type: "success"
                });
                this.$router.push({
                  path: "/put/prize"
                });
              })
              .catch(err => {
                this.setting.loading = false;
                this.$message({
                  message: err.response.data.message,
                  type: "success"
                });
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
  .pane {
    border-radius: 5px;
    padding: 20px 40px 80px;

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
    .pane-title {
      padding-left: 20px;
      color: #6b3dc4;
      padding-bottom: 20px;
      font-size: 16px;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
    }
  }
}
</style>
