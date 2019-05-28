<template>
  <div class="item-wrap-template">
    <div
      v-loading="setting.loading"
      :element-loading-text="setting.loadingText"
      class="pane"
    >
      <div class="pane-title">{{ putLaunchId ? '修改广告投放': '新增广告投放' }}</div>
      <el-form
        ref="prizeLaunchForm"
        :model="prizeLaunchForm"
        label-position="top"
      >
        <el-form-item
          :rules="[{ required: true, message: '广告模版', trigger: 'submit'}]"
          label="广告模版 "
          prop="atiid"
        >
          <el-select
            v-model="prizeLaunchForm.atiid"
            :loading="searchLoading"
            placeholder="请选择模版"
            filterable
            clearable
          >
            <i
              slot="prefix"
              class="el-input__icon el-icon-name el-icon-same"
            />
            <el-option
              v-for="item in tempList"
              :key="item.atiid"
              :label="item.name"
              :value="item.atiid"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          :rules="[{ required: true, message: '点位名称', trigger: 'submit'}]"
          label="点位名称 "
          prop="oid"
        >
          <el-select
            v-model="prizeLaunchForm.oid"
            :loading="searchLoading"
            placeholder="请选择点位名称"
            filterable
            clearable
            :disabled="disabled"
          >
            <i
              slot="prefix"
              class="el-input__icon el-icon-name el-icon-same"
            />
            <el-option
              v-for="item in pointList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          :rules="[{ required: true, message: '节目名称', trigger: 'submit'}]"
          label="节目名称 "
          prop="piid"
        >
          <el-select
            v-model="prizeLaunchForm.piid"
            :loading="searchLoading"
            filterable
            placeholder="请选择节目名称"
            clearable
            :disabled="disabled"
          >
            <i
              slot="prefix"
              class="el-input__icon el-icon-project el-icon-same"
            />
            <el-option
              v-for="item in projectList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          :rules="[{ required: true, trigger: 'submit'}]"
          label="模板投放时间"
        >

          <div class="time">
            <el-date-picker
              v-model="prizeLaunchForm.sdate"
              placeholder="任意时间点"
              type="datetime"
            />
            <div style="width:20px;text-align:center">-</div>
            <el-date-picker
              v-model="prizeLaunchForm.edate"
              placeholder="任意时间点"
              type="datetime"
            />
          </div>
        </el-form-item>
        <el-form-item class="btn-wrap">
          <el-button
            class="el-button-success"
            @click="submit('prizeLaunchForm')"
          >完成</el-button>
          <el-button
            class="el-button-cancel"
            @click="back"
          >返回</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import {
  historyBack,
  getProject,
  getPoint,
  modifyLaunchPut,
  getAdList,
  saveLaunchPut,
  getLaunchPutDetail
} from "service";
import moment from "moment";

import {
  Form,
  Select,
  Option,
  FormItem,
  Button,
  Input,
  DatePicker,
  MessageBox,
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
      putLaunchId: null,
      setting: {
        isOpenSelectAll: true,
        loading: false,
        loadingText: "拼命加载中"
      },
      tempList: [],
      pointList: [],
      projectList: [],
      searchLoading: false,
      disabled: false,
      prizeLaunchForm: {
        atiid: null,
        oid: null,
        piid: null,
        sdate: null,
        edate: null,
        data: null
      }

    };
  },
  mounted() {
  },
  created() {
    this.getProject();
    this.getPoint();
    this.getAdList();
    this.putLaunchId = this.$route.params.uid;
    if (this.putLaunchId) {
      this.getLaunchPutDetail();
      this.disabled = true
    }
  },
  methods: {
    getLaunchPutDetail() {
      this.setting.loading = true;
      let args = {
        include: "template,point,project"
      };
      getLaunchPutDetail(this, this.putLaunchId, args)
        .then(res => {
          this.prizeLaunchForm.piid = res.project.id
          this.prizeLaunchForm.oid = res.point.id;
          this.prizeLaunchForm.atiid = res.template.atiid;
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
    getAdList() {
      this.searchLoading = true;
      getAdList(this)
        .then(res => {
          this.tempList = res.data;
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
          let args = {
            piid: this.prizeLaunchForm.piid,
            oid: this.prizeLaunchForm.oid,
            atiid: this.prizeLaunchForm.atiid,
            sdate: moment(this.prizeLaunchForm.sdate).format("YYYY-MM-DD HH:mm:ss"),
            edate: moment(this.prizeLaunchForm.edate).format("YYYY-MM-DD HH:mm:ss"),
          };
          console.log(args)
          if (this.putLaunchId) {
            modifyLaunchPut(this, this.putLaunchId, args)
              .then(response => {
                this.setting.loading = false;
                this.$message({
                  message: "修改成功",
                  type: "success"
                });
                this.$router.push({
                  path: "/put/adPut",
                  query: {
                    atiid: this.prizeLaunchForm.atiid
                  }
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
            saveLaunchPut(this, args)
              .then(response => {
                this.setting.loading = false;
                this.$message({
                  message: "添加成功",
                  type: "success"
                });
                this.$router.push({
                  path: "/put/adPut"
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
