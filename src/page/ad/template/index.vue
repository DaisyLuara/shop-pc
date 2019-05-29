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
        <div class="title">广告模板列表({{ pagination.count }})</div>
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
        ></el-tab-pane>
        <el-tab-pane
          label=小屏广告
          name="second"
        ></el-tab-pane>
      </el-tabs>
      <!-- 列表 -->
      <el-table
        :data="tableData"
        :row-style="{height:'70px'}"
        :header-cell-style="headerStyle"
        style="width: 100%"
        type="expand"
      >
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-form
              label-position="left"
              inline
              class="demo-table-expand"
            >
              <el-form-item label="ID:">
                <span>{{ scope.row.atiid }}</span>
              </el-form-item>
              <el-form-item label="广告模板名称:">
                <span>{{ scope.row.name }}</span>
              </el-form-item>
              <el-form-item label="节目运行状态">
                <span>{{ scope.row.hardware === 1? '开启':'关闭' }}</span>
              </el-form-item>
              <el-form-item label="类型">
                <span>{{ scope.row.type === 'program'? '节目广告':'小屏广告' }}</span>
              </el-form-item>
              <el-form-item label="修改时间:">
                <span>{{ scope.row.updated_at }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column
          :show-overflow-tooltip="true"
          sortable
          prop="atiid"
          label="ID"
          width="100"
        />
        <el-table-column
          :show-overflow-tooltip="true"
          sortable
          prop="name"
          label="广告模板名称"
          min-width="100"
        />
        <el-table-column
          :show-overflow-tooltip="true"
          sortable
          prop="hardware"
          label="节目运行状态"
          min-width="100"
        >
          <template slot-scope="scope">{{ scope.row.hardware === 1? '开启':'关闭' }}</template>
        </el-table-column>
        <el-table-column
          :show-overflow-tooltip="true"
          sortable
          prop="type"
          label="类型"
          min-width="100"
        >
          <template slot-scope="scope">{{ scope.row.type === 'program'? '节目广告':'小屏广告' }}</template>
        </el-table-column>
        <el-table-column
          :show-overflow-tooltip="true"
          sortable
          prop="updated_at"
          label="修改时间"
          min-width="100"
        />
        <el-table-column
          label="操作"
          width="200"
        >
          <template slot-scope="scope">
            <el-button
              size="small"
              @click="editPrizePolicy(scope.row)"
            >编辑</el-button>
            <el-button
              size="small"
              @click="toItem(scope.row)"
            >子条目</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-wrap">
        <el-pagination
          :total="pagination.total"
          :current-page="pagination.current_page"
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
import {
  Button,
  Select,
  Option,
  Pagination,
  MessageBox,
  Table,
  TableColumn,
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
  components: {
    "el-table": Table,
    "el-table-column": TableColumn,
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
      headerStyle: { background: "#6b3ec2", color: "#fff" },
      setting: {
        loading: false,
        loadingText: "拼命加载中"
      },
      tableData: [],
      ad_data_name: [],
      value: "",
      pagination: {
        total: 0,
        pageSize: 10,
        current_page: 1
      },
      atiid: null,
      activeName: "first",
      type: "program"
    };
  },
  created() {
    this.getAdList();
  },
  methods: {
    cancel() {
      this.$refs["templateForm"].resetFields();
      this.dialogFormVisible = false;
    },
    tabClick(tab) {
      this.type = tab.label === "节目广告" ? "program" : "ads"
      this.getAdList(this.type);
    },
    getAdList(type) {
      this.setting.loading = true;
      let args = {
        page: this.pagination.current_page,
        name: this.filters.name,
        type: this.type
      };
      if (this.filters.name === "") {
        delete args.name;
      }
      getAdList(this, args)
        .then(res => {
          this.tableData = res.data;
          this.pagination = res.meta.pagination;
          this.pagination.total = response.meta.pagination.total;
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
    //修改模板
    editPrizePolicy(item) {
      this.atiid = item.atiid;
      this.title = '编辑模版'
      this.templateForm.name = item.name
      this.templateForm.type = item.type
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
                  message: "更改成功",
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
                  message: "更改成功",
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
      this.pagination.current_page = 1;
      this.getAdList();
    },
    resetSearch(formName) {
      this.$refs[formName].resetFields();
      this.pagination.current_page = 1;
      this.getAdList();
    },
    changePage(currentPage) {
      this.pagination.current_page = currentPage;
      this.getAdList();
    },
    //子条目
    toItem(item) {
      this.$router.push({
        path: "/ad/template/items",
        query: {
          atiid: item.atiid
        }
      });
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
