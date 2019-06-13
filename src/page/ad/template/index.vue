<template>
  <div class="root">
    <div
      v-loading="setting.loading"
      :element-loading-text="setting.loadingText"
      class="ad_templates"
    >
      <div class="ad_search_warp">
        <el-form
          ref="filters"
          :model="filters"
          :inline="true"
        >
          <el-form-item
            label
            prop="name"
          >
            <el-input
              v-model="filters.name"
              placeholder="请填写广告模板名称"
              clearable
            >
              <i
                slot="prefix"
                class="el-input__icon el-icon-name el-icon-same"
              />
            </el-input>
          </el-form-item>
          <el-form-item label>
            <el-button
              class="el-button-success"
              @click="search('filters')"
            >搜索</el-button>
            <el-button
              class="el-button-cancel"
              @click="resetSearch('filters')"
            >重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="ad_list_title">
        <div class="title">广告模板列表({{ pagination.total }})</div>
        <el-button
          class="save"
          @click="addPrizePolicy"
        >新增广告模板</el-button>
      </div>
      <el-tabs
        v-model="activeName"
        @tab-click="tabClick"
      >
        <el-tab-pane
          label=节目广告
          name="first"
        >
          <!-- 列表 -->
          <AdTable
            :tableData="tableData"
            v-on:toIndex="getAdTable"
          />
        </el-tab-pane>
        <el-tab-pane
          label=小屏广告
          name="second"
        >
          <!-- 列表 -->
          <AdTable
            :tableData="tableData"
            v-on:toIndex="getAdTable"
          />
        </el-tab-pane>
      </el-tabs>

      <div class="pagination-wrap">
        <el-pagination
          :total="pagination.total"
          :current-page="pagination.currentPage"
          layout="prev, pager, next, jumper, total"
          @current-change="changePage"
        />
      </div>
    </div>
    <el-dialog
      :visible.sync="dialogFormVisible"
      :show-close="false"
      :title="title"
    >
      <el-form
        ref="templateForm"
        :model="templateForm"
        label-position="top"
      >
        <el-form-item
          :rules="[{ required: true, message: '请填写模版名称', trigger: 'submit'}]"
          label="模版名称"
          prop="name"
        >
          <el-input
            v-model="templateForm.name"
            placeholder="请填写模版名称"
            clearable
            style="width:210px"
          />
        </el-form-item>
        <el-form-item
          :rules="[{ required: true, message: '请选择类型', trigger: 'submit'}]"
          label="类型"
          prop="type"
        >
          <el-radio-group v-model="templateForm.type">
            <el-radio label="ads">小屏广告</el-radio>
            <el-radio label="program">节目广告</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <el-button
            class="el-button-success"
            @click="submit('templateForm')"
          >完成</el-button>
          <el-button
            class="el-button-cancel"
            @click="cancel"
          >取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import { getAdList, saveAdTemplate, modifyAdTemplate } from "service";
import AdTable from "./TableComponents/AdTable";
import {
  Button,
  Select,
  Option,
  Pagination,
  MessageBox,
  Form,
  FormItem,
  Input,
  Dialog,
  RadioGroup,
  Radio,
  TabPane,
  Tabs,
} from "element-ui";

export default {
  name: "AdList",

  components: {
    "el-button": Button,
    "el-pagination": Pagination,
    "el-form": Form,
    "el-form-item": FormItem,
    "el-select": Select,
    "el-option": Option,
    "el-input": Input,
    "el-dialog": Dialog,
    "el-radio-group": RadioGroup,
    "el-radio": Radio,
    "el-tab-pane": TabPane,
    "el-tabs": Tabs,
    AdTable
  },
  data() {
    return {
      templateForm: {
        name: "",
        type: "program"
      },
      title: "新增模版",
      dialogFormVisible: false,
      filters: {
        name: ""
      },
      setting: {
        loading: false,
        loadingText: "拼命加载中"
      },
      tableData: [],
      pagination: {
        total: 0,
        pageSize: 10,
        currentPage: 1
      },
      atiid: null,
      activeName: "first",
      type: "program"
    };
  },
  created() {
    this.getAdList()
  },
  methods: {
    cancel() {
      this.$refs["templateForm"].resetFields();
      this.dialogFormVisible = false;
    },
    tabClick(tab) {
      this.type = tab.name === "first" ? "program" : "ads"
      this.pagination.currentPage = 1;
      this.getAdList();
    },
    //修改模板
    editPrizePolicy(item) {
      this.atiid = item.atiid;
      this.title = '编辑模版'
      this.templateForm.name = item.name
      this.templateForm.type = item.type
      this.dialogFormVisible = true;
    },
    //获取adtable值
    getAdTable(item) {
      this.atiid = item.atiid;
      this.title = '编辑模版'
      this.templateForm.name = item.name
      this.templateForm.type = item.type
      this.dialogFormVisible = true;
    },
    getAdList() {
      this.setting.loading = true;
      let args = {
        page: this.pagination.currentPage,
        name: this.filters.name,
        type: this.type
      };
      if (this.filters.name === "") {
        delete args.name;
      }
      getAdList(this, args)
        .then(res => {
          this.tableData = res.data;
          this.pagination.total = res.meta.pagination.total;
          this.setting.loading = false;
        })
        .catch(error => {
          this.setting.loading = false;
        });
    },
    //增加模板
    addPrizePolicy(item) {
      this.dialogFormVisible = true;
    },
    submit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.setting.loading = true;
          let args = this.templateForm;
          if (this.atiid) {
            modifyAdTemplate(this, this.atiid, args)
              .then(response => {
                this.setting.loading = false;
                this.$message({
                  message: "修改成功",
                  type: "success"
                });
                this.cancel();
                this.getAdList();
              })
              .catch(err => {
                this.setting.loading = false;
                this.cancel();
                this.$message({
                  message: err.response.data.message,
                  type: "success"
                });
              });
          } else {
            saveAdTemplate(this, args)
              .then(response => {
                this.setting.loading = false;
                this.$message({
                  message: "新增成功",
                  type: "success"
                });
                this.cancel();
                this.getAdList();
              })
              .catch(err => {
                this.setting.loading = false;
                this.cancel();
                this.$message({
                  message: err.response.data.message,
                  type: "success"
                });
              });
          }
        }
      });
    },
    search(formName) {
      this.pagination.currentPage = 1;
      this.getAdList();
    },
    resetSearch(formName) {
      this.$refs[formName].resetFields();
      this.pagination.currentPage = 1;
      this.getAdList();
    },
    changePage(currentPage) {
      this.pagination.currentPage = currentPage;
      this.getAdList();
    },
  }
};
</script>
<style lang='less' scoped>
.ad_templates {
  background: #fff;
  padding: 30px;
  .ad_search_warp {
    width: 100%;
    height: 3rem;
  }
  .submit {
    margin-left: 2rem;
  }
  .ad_list_title {
    width: 100%;
    height: 3rem;
    margin: 20px 0;
    .title {
      color: #7e58cc;
      font: 700 16px/32px "";
      float: left;
    }
    .save {
      color: #ffffff;
      background: #7e58cc;
      float: right;
    }
  }
  .pagination-wrap {
    margin: 10px auto;
    text-align: right;
  }
}
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
</style>
