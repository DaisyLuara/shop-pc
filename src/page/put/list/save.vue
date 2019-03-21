<template>
  <div class="item-wrap-template">
    <div v-loading="setting.loading" :element-loading-text="setting.loadingText" class="pane">
      <div class="pane-title">新增节目投放</div>
      <el-form ref="projectLaunchForm" :model="projectLaunchForm">
        <el-form-item
          :rules="[{ required: true, message: '请输入节目名称', trigger: 'submit'}]"
          label=" "
          prop="project_id"
        >
          <el-select
            v-model="projectLaunchForm.project_id"
            :loading="searchLoading"
            filterable
            placeholder="请选择节目"
            clearable
          >
            <i slot="prefix" class="el-input__icon el-icon-project el-icon-same"></i>
            <el-option
              v-for="item in projectList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          :rules="[{ required: true, message: '请输入点位', trigger: 'submit'}]"
          label=" "
          prop="point_id"
        >
          <el-select
            v-model="projectLaunchForm.point_id"
            :loading="searchLoading"
            placeholder="请选择点位"
            filterable
            clearable
          >
            <i slot="prefix" class="el-input__icon el-icon-name el-icon-same"></i>
            <el-option
              v-for="item in pointList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label=" "
          prop="sdate"
          :rules="[{ required: true, message: '请选择开始时间', trigger: 'submit'}]"
        >
          <el-date-picker
            v-model="projectLaunchForm.sdate"
            :editable="false"
            type="date"
            placeholder="请选择开始时间"
          />
        </el-form-item>
        <el-form-item
          label=" "
          prop="edate"
          :rules="[{ required: true, message: '请选择结束时间', trigger: 'submit'}]"
        >
          <el-date-picker
            v-model="projectLaunchForm.edate"
            :editable="false"
            type="date"
            placeholder="请选择结束时间"
            value-format="yyyy-MM-dd"
          />
        </el-form-item>
        <el-form-item class="btn-wrap">
          <el-button class="el-button-success" @click="submit('projectLaunchForm')">完成</el-button>
          <el-button class="el-button-cancel" @click="back">返回</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { historyBack, saveLaunchProject, getProject, getPoint } from "service";
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
      setting: {
        isOpenSelectAll: true,
        loading: false,
        loadingText: "拼命加载中"
      },
      pointList: [],
      projectList: [],
      searchLoading: false,
      projectLaunchForm: {
        project_id: null,
        point_id: null,
        sdate: "",
        edate: ""
      }
    };
  },
  mounted() {},
  created() {
    this.getProject();
    this.getPoint();
  },
  methods: {
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
          let edate =
            (new Date(this.projectLaunchForm.edate).getTime() +
              ((23 * 60 + 59) * 60 + 59) * 1000) /
            1000;
          let args = {
            sdate: new Date(this.projectLaunchForm.sdate).getTime() / 1000,
            edate: edate,
            default_plid: this.projectLaunchForm.project_id,
            oid: this.projectLaunchForm.point_id
          };
          return saveLaunchProject(this, args)
            .then(response => {
              this.setting.loading = false;
              this.$message({
                message: "添加成功",
                type: "success"
              });
              this.$router.push({
                path: "/put/list"
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
