<template>
  <div class="item-wrap-template">
    <div v-loading="setting.loading" :element-loading-text="setting.loadingText" class="pane">
      <div class="pane-title">{{ AccreditID ? '编辑授权投放' : '新增授权投放' }}</div>
      <el-form ref="accreditForm" :model="accreditForm" label-width="150px">
        <div class="deploy-model">
          <h4 class="deploy-model-title">投放基础配置</h4>
          <el-form-item label="点位" prop="point_id">
            <el-select
              v-model="accreditForm.point_id"
              :loading="searchLoading"
              placeholder="请选择场地"
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
            prop="project_id"
          >
            <el-select
              v-model="accreditForm.project_id"
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
            prop="link_id"
          >
            <el-select
              v-model="accreditForm.link_id"
              :loading="searchLoading"
              placeholder="请选择授权链接"
              filterable
              clearable
            >
              <el-option
                v-for="item in linkList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            :rules="[{ required: true, message: '请选择状态', trigger: 'submit'}]"
            label="状态"
            prop="status"
          >
            <el-radio-group v-model="accreditForm.status">
              <el-radio :label="1">运营中</el-radio>
              <el-radio :label="0">下架</el-radio>
            </el-radio-group>
          </el-form-item>
        </div>
        <div class="deploy-model">
          <h4 class="deploy-model-title">脱机配置</h4>
          <el-form-item label="脱机支持" prop="off_support">
            <el-radio-group v-model="accreditForm.off_support">
              <el-radio :label="1">微信场景码</el-radio>
              <el-radio :label="0">指定链接</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="脱机链接" prop="off_link">
            <el-input
              v-model="accreditForm.off_link"
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
import { historyBack } from "service";
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
      typeList: [],
      projectList: [],
      linkList: [],
      searchLoading: false,
      accreditForm: {
        project_id: null,
        type: "",
        link_id: null,
        status: 1,
        point_id: [],
        off_support: 0,
        off_link: ""
      }
    };
  },
  mounted() {},
  created() {},
  methods: {
    back() {
      historyBack();
    },
    getProject(query) {
      if (query !== "") {
        this.searchLoading = true;
        let args = {
          name: query
        };
        return getSearchProjectList(this, args)
          .then(response => {
            this.areaList = response.data;
            if (this.areaList.length == 0) {
              this.accreditForm.project = [];
              this.areaList = [];
            }
            this.searchLoading = false;
          })
          .catch(err => {
            console.log(err);
            this.searchLoading = false;
          });
      } else {
        this.areaList = [];
      }
    },
    getPoint() {
      let args = {
        include: "market",
        market_id: this.accreditForm.market
      };
      this.searchLoading = true;
      return getSearchPointList(this, args)
        .then(response => {
          this.siteList = response.data;
          this.searchLoading = false;
        })
        .catch(err => {
          this.searchLoading = false;
          console.log(err);
        });
    },

    submit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.setting.loading = true;
          let edate =
            (new Date(this.accreditForm.edate).getTime() +
              ((23 * 60 + 59) * 60 + 59) * 1000) /
            1000;
          let args = {
            sdate: new Date(this.accreditForm.sdate).getTime() / 1000,
            edate: edate,
            default_plid: this.accreditForm.project[0],
            oids: this.accreditForm.point
          };
          return savePorjectLaunch(this, args)
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
              console.log(err);
            });
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
