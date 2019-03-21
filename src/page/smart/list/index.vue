<template>
  <div class="root">
    <div
      v-loading="setting.loading"
      :element-loading-text="setting.loadingText"
      class="item-list-wrap"
    >
      <div class="item-content-wrap">
        <!-- 搜索 -->
        <div class="search-wrap">
          <el-form ref="filters" :model="filters" :inline="true">
            <el-form-item label prop="name">
              <el-input v-model="filters.name" placeholder="请填写节目名称" clearable>
                <i slot="prefix" class="el-input__icon el-icon-name el-icon-same"></i>
              </el-input>
            </el-form-item>
            <el-form-item label>
              <el-button class="el-button-success" @click="search('filters')">搜索</el-button>
              <el-button class="el-button-cancel" @click="resetSearch('filters')">重置</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="actions-wrap">
          <span class="label">标准节目列表（ {{ pagination.total }} ）</span>
        </div>
        <!-- 表格 -->
        <el-table
          ref="multipleTable"
          :data="tableData"
          style="width: 100%"
          :row-style="{height:'70px'}"
          type="expand"
          :header-cell-style="headerStyle"
        >
          <el-table-column type="expand">
            <template slot-scope="scope">
              <el-form label-position="left" inline class="demo-table-expand">
                <el-form-item label="ID:">
                  <span>{{ scope.row.id }}</span>
                </el-form-item>
                <el-form-item label="节目名称:">
                  <span>{{ scope.row.name }}</span>
                </el-form-item>
                <el-form-item label="介绍视频:">
                  <a
                    :href="scope.row.vedio_desc_url"
                    target="_blank"
                    style="color:#6b3ec2;font-weight:600;"
                  >点击播放</a>
                </el-form-item>
                <el-form-item label="模版:">
                  <span>{{ scope.row.template.name }}</span>
                </el-form-item>
                <el-form-item label="版本号码:">
                  <span>{{ scope.row.version_code }}</span>
                </el-form-item>
                <el-form-item label="更新时间:">
                  <span>{{ scope.row.updated_at }}</span>
                </el-form-item>
                <el-form-item label="互动指数:">
                  <div>
                    <span>人气指数</span>
                    <span v-html="starShow(scope.row.top_num)"/>
                  </div>
                  <div>
                    <span>幸运指数</span>
                    <span v-html="starShow(scope.row.luck_num)"/>
                  </div>
                  <div>
                    <span>推荐指数</span>
                    <span v-html="starShow(scope.row.invite_num)"/>
                  </div>
                </el-form-item>
                <el-form-item label="节目封面:">
                  <img :src="scope.row.image" alt="image" style="width: 20%;">
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column sortable prop="id" label="ID" min-width="80"/>
          <el-table-column
            sortable
            :show-overflow-tooltip="true"
            prop="name"
            label="节目名称"
            min-width="80"
          />
          <el-table-column sortable prop="image" label="节目封面" width="100">
            <template slot-scope="scope">
              <img :src="scope.row.image" alt="image" style="width: 80%;">
            </template>
          </el-table-column>
          <el-table-column
            sortable
            :show-overflow-tooltip="true"
            prop="vedio_desc_url"
            label="介绍视频"
            min-width="80"
          >
            <template slot-scope="scope">
              <a
                :href="scope.row.vedio_desc_url"
                target="_blank"
                style="color:#6b3ec2;font-weight:600;"
              >点击播放</a>
            </template>
          </el-table-column>
          <el-table-column
            sortable
            :show-overflow-tooltip="true"
            prop="vedio_desc_url"
            label="互动指数"
            min-width="100"
          >
            <template slot-scope="scope">
              <div>
                <span>人气指数</span>
                <span v-html="starShow(scope.row.top_num)"/>
              </div>
              <div>
                <span>幸运指数</span>
                <span v-html="starShow(scope.row.luck_num)"/>
              </div>
              <div>
                <span>推荐指数</span>
                <span v-html="starShow(scope.row.invite_num)"/>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            sortable
            :show-overflow-tooltip="true"
            prop="updated_at"
            label="更新时间"
            min-width="80"
          />
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
  </div>
</template>

<script>
import { getSmartList, getTemplate, getProject } from "service";

import {
  Button,
  Table,
  TableColumn,
  Pagination,
  Form,
  FormItem,
  MessageBox,
  Input
} from "element-ui";
import { truncate } from "fs";

export default {
  components: {
    "el-table": Table,
    "el-table-column": TableColumn,
    "el-button": Button,
    "el-pagination": Pagination,
    "el-form": Form,
    "el-form-item": FormItem,
    "el-input": Input
  },
  data() {
    return {
      filters: {
        name: null
      },

      searchLoading: false,
      templateList: [],
      projectList: [],
      statusList: [],
      headerStyle: { background: "#6b3ec2", color: "#fff" },
      setting: {
        loading: false,
        loadingText: "拼命加载中"
      },
      pagination: {
        total: 0,
        pageSize: 10,
        currentPage: 1
      },
      tableData: []
    };
  },
  created() {
    this.getSmartList();
    this.getTemplate();
    this.getProject();
  },
  methods: {
    starShow(num) {
      let star = "";
      for (let i = 0; i < num; i++) {
        star += "<i class='el-icon-star-off' style='color:#6b3dc4;'></i>";
      }
      return star;
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
            type: "warning",
            message: err.response.data.message
          });
        });
    },
    getTemplate() {
      this.searchLoading = true;
      getTemplate(this)
        .then(res => {
          this.templateList = res;
          this.searchLoading = false;
        })
        .catch(err => {
          this.searchLoading = false;

          this.$message({
            type: "warning",
            message: err.response.data.message
          });
        });
    },
    getSmartList() {
      this.setting.loading = true;
      let args = {
        include: "template",
        page: this.pagination.currentPage,
        name: this.filters.name
      };
      if (!this.filters.name) {
        delete args.name;
      }
      getSmartList(this, args)
        .then(res => {
          this.tableData = res.data;
          this.pagination.total = res.meta.pagination.total;
          this.setting.loading = false;
        })
        .catch(err => {
          this.$message({
            type: "warning",
            message: err.response.data.message
          });
          this.setting.loading = false;
        });
    },
    resetSearch(formName) {
      this.$refs[formName].resetFields();
      this.pagination.currentPage = 1;
      this.getSmartList();
    },
    search(formName) {
      this.pagination.currentPage = 1;
      this.getSmartList();
    },
    changePage(currentPage) {
      this.pagination.currentPage = currentPage;
      this.getSmartList();
    }
  }
};
</script>

<style lang="less" scoped>
@imgurl: "https://cdn.exe666.com/ad_shop/img/";
.root {
  font-size: 14px;
  color: #5e6d82;

  .item-list-wrap {
    background: #fff;
    padding: 30px;

    .item-content-wrap {
      .icon-item {
        padding: 10px;
        width: 60%;
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
      .point-btn {
        background: #05c99a;
        color: #fff;
        border-color: #05c99a;
      }
      .sold-out {
        background: #ff7696;
        color: #fff;
        font-weight: 600;
        padding: 10px;
        border-radius: 10px;
      }
      .operating {
        background: #05c99a;
        color: #fff;
        font-weight: 600;
        padding: 10px;
        border-radius: 10px;
      }
      .sold-out-expand {
        background: #ff7696;
        color: #fff;
        font-weight: 600;
        padding: 3px 5px;
        border-radius: 5px;
      }
      .operating-expand {
        background: #05c99a;
        color: #fff;
        font-weight: 600;
        padding: 3px 5px;
        border-radius: 5px;
      }

      .search-wrap {
        margin-top: 5px;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        font-size: 16px;
        align-items: center;
        margin-bottom: 10px;
        .el-form-item {
          margin-bottom: 10px;
        }
        .el-select {
          width: 200px;
        }
        .warning {
          background: #ebf1fd;
          padding: 8px;
          margin-left: 10px;
          color: #444;
          font-size: 12px;
          i {
            color: #4a8cf3;
            margin-right: 5px;
          }
        }
      }
      .actions-wrap {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        font-size: 16px;
        align-items: center;
        margin: 20px 0;
        .label {
          color: #6b3dc4;
          font-size: 16px;
          font-weight: 600;
        }
      }
      .pagination-wrap {
        margin: 10px auto;
        text-align: right;
      }
    }
  }
}
</style>
