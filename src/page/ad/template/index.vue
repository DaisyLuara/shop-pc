<template>
  <div class="root">
    <div
      v-loading="setting.loading"
      :element-loading-text="setting.loadingText"
      class="ad_templates"
    >
      <div class="ad_search_warp">
        <el-form ref="filters" :model="filters" :inline="true">
          <el-form-item label prop="name">
            <el-select v-model="filters.name" placeholder="请输入广告名称" filterable>
              <el-option
                v-for="item in ad_data_name"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
              <i 
                slot="prefix" 
                class="el-input__icon el-icon-project el-icon-same"/>
            </el-select>
          </el-form-item>
          <el-form-item label>
            <el-button class="el-button-success" @click="search()">搜索</el-button>
            <el-button class="el-button-cancel" @click="resetSearch('filters')">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="ad_list_title">
        <div class="title">广告模板列表({{tableData[0].num}})</div>
        <el-button class="save" @click="addPrizePolicy">新增广告模板</el-button>
      </div>
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
                class="demo-table-expand">
                <el-form-item label="ID:">
                  <span>{{ scope.row.id }}</span>
                </el-form-item>
                <el-form-item label="广告模板名称:">
                  <span>{{ scope.row.title }}</span>
                </el-form-item>
                <el-form-item label="节目运行状态">
                  <span>{{ scope.row.state }}</span>
                </el-form-item>
                <el-form-item label="修改时间:">
                  <span>{{ scope.row.time }}</span>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column 
            :show-overflow-tooltip="true" 
            sortable 
            prop="id" 
            label="ID" 
            width="100"/>
          <el-table-column
            :show-overflow-tooltip="true"
            sortable
            prop="title"
            label="广告模板名称"
            min-width="100"
          />
          <el-table-column
            :show-overflow-tooltip="true"
            sortable
            prop="state"
            label="节目运行状态"
            min-width="100"
          />
          <el-table-column
            :show-overflow-tooltip="true"
            sortable
            prop="time"
            label="修改时间"
            min-width="100"
          />
          <el-table-column 
            label="操作" 
            width="200">
            <template slot-scope="scope">
              <el-button 
                size="small" 
                @click="addPrizePolicy(scope.row)">编辑</el-button>
              <el-button 
                size="small" 
                @click="toItem(scope.row)">子条目</el-button>
            </template>
          </el-table-column>
      </el-table>
      <div class="pagination-wrap">
        <el-pagination
          :total="pagination.total"
          :page-size="pagination.pageSize"
          :current-page="pagination.currentPage"
          layout="prev, pager, next, jumper, total"
          @current-change="changePage"
        />
      </div>
    </div>
  </div>
</template>
<script>
import { getAdList } from 'service';
import {
  Button,
  Select,
  Option,
  Pagination,
  MessageBox,
  Table,
  TableColumn,
  Form,
  FormItem
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
    "el-option": Option
  },
  data() {
    return {
      filters: {
        name: ""
      },
      headerStyle: { background: "#6b3ec2", color: "#fff" },
      setting: {
        loading: false,
        loadingText: "拼命加载中"
      },
      tableData: [
        {
          id: 1,
          title: "测试",
          state: 1,
          time: "2019/01/01",
          num:1
        }
      ],
      ad_data_name: [],
      value: "",
      pagination: {
        total: 0,
        pageSize: 10,
        currentPage: 1
      }
    };
  },
  created() {
    this.getAdList();
  },
  methods: {
    getAdList() {
      this.setting.loading = true;
      let args = {
        // include: "company,customer",
        page: this.pagination.currentPage,
        name: this.filters.name
      };
      if (this.filters.name === "") {
        delete args.name;
      }
      getAdList(this, args)
      .then(res =>{
        this.tableData = res.data;
        this.pagination.total = response.meta.pagination.total;
        this.setting.loading = false;
      })
      .catch(error => {
        this.setting.loading = false;
        this.$message({
          type: 'warning',
          message: err.response.data.message
        });
      });
    },
    //增加模板
    addPrizePolicy(item) {
      this.$prompt("模板名", "增加模板", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputPlaceholder: "请输入模板名",
        inputValue: item.title
      })
        .then(({ value }) => {
          this.$message({
            type: "success",
            message: "模板增加成功"
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消"
          });
        });
    },
    search() {
      this.pagination.currentPage = 1;
      this.getCouponRulesList();
    },
    resetSearch(formName) {
      this.$refs[formName].resetFields();
      this.pagination.currentPage = 1;
      this.getCouponRulesList();
    },
    editPrizePolicy(item) {
      this.title = "修改模板";
      let name = item.name;
      this.templateForm = {
        pid: item.id,
        name: name
      };
      this.templateVisible = true;
    },
    //子条目
    toItem(item) {
      this.$router.push({
        path: "/ad/template/items",
        query: {
          id: item.id
        }
      });
    },
    changePage(currentPage) {
      this.pagination.currentPage = currentPage;
      this.getPrizePolicyList();
    }
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
