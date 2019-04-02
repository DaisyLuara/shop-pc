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
          <el-form 
            ref="filters" 
            :model="filters" 
            :inline="true">
            <el-form-item 
              label 
              prop="nick_name">
              <el-input 
                v-model="filters.nick_name" 
                placeholder="请输入授权链接" 
                clearable>
                <i 
                  slot="prefix" 
                  class="el-input__icon el-icon-link el-icon-same"/>
              </el-input>
            </el-form-item>
            <el-form-item 
              label 
              prop="service_type">
              <el-select
                v-model="filters.service_type"
                icon="el-icon-search"
                placeholder="请选择授权类型"
                filterable
                clearable
              >
                <i 
                  slot="prefix" 
                  class="el-input__icon el-icon-type el-icon-same"/>
                <el-option
                  v-for="item in typeList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item label>
              <el-button 
                class="el-button-success" 
                @click="search('filters')">搜索</el-button>
              <el-button 
                class="el-button-cancel" 
                @click="resetSearch('filters')">重置</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="actions-wrap">
          <span class="label">授权列表（ {{ pagination.total }} ）</span>
          <el-button 
            type="primary" 
            icon="el-icon-circle-plus-outline" 
            @click="naviToAdd">新增授权</el-button>
        </div>
        <!-- 表格 -->
        <el-table
          ref="multipleTable"
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
                <el-form-item label="原始ID:">
                  <span>{{ scope.row.appid }}</span>
                </el-form-item>
                <el-form-item label="授权链接:">
                  <span>{{ scope.row.nick_name }}</span>
                </el-form-item>
                <el-form-item label="类型:">
                  <span>{{ scope.row.service_type.display_name }}</span>
                </el-form-item>
                <el-form-item label="状态:">
                  <span
                    :class="(scope.row.state !== 200) ? 'sold-out-expand' : 'operating-expand'"
                  >{{ scope.row.state !== 200 ? scope.row.state : '正常' }}</span>
                </el-form-item>
                <el-form-item label="时间:">
                  <span>{{ scope.row.updated_at }}</span>
                </el-form-item>
                <el-form-item label="开通权限:">
                  <span v-html="perShow(scope.row.per)"/>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column 
            sortable 
            prop="id" 
            label="ID" 
            min-width="80"/>
          <el-table-column
            :show-overflow-tooltip="true"
            sortable
            prop="appid"
            label="原始ID"
            min-width="80"
          />
          <el-table-column
            :show-overflow-tooltip="true"
            sortable
            prop="nick_name"
            label="授权链接"
            min-width="80"
          />
          <el-table-column
            :show-overflow-tooltip="true"
            sortable
            prop="type"
            label="类型"
            min-width="80"
          >
            <template slot-scope="scope">{{ scope.row.service_type.display_name }}</template>
          </el-table-column>
          <el-table-column
            :show-overflow-tooltip="true"
            sortable
            prop="state"
            label="状态"
            min-width="100"
          >
            <template slot-scope="scope">
              <span
                :class="(scope.row.state !== 200) ? 'sold-out' : 'operating'"
              >{{ scope.row.state !== 200 ? scope.row.state : '正常' }}</span>
            </template>
          </el-table-column>
          <el-table-column
            :show-overflow-tooltip="true"
            sortable
            prop="per"
            label="开通权限"
            min-width="100"
          >
            <template slot-scope="scope">
              <span v-html="perShow(scope.row.per)"/>
            </template>
          </el-table-column>
          <el-table-column
            :show-overflow-tooltip="true"
            sortable
            prop="updated_at"
            label="时间"
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
import { getAuthorizationList } from "service";

import {
  Button,
  Table,
  TableColumn,
  Pagination,
  Form,
  FormItem,
  MessageBox,
  Select,
  Option,
  Input
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
    "el-input": Input
  },
  data() {
    return {
      filters: {
        nick_name: "",
        service_type: ""
      },

      pickerOptions: {
        shortcuts: [
          {
            text: "昨天",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24);
              end.setTime(end.getTime() - 3600 * 1000 * 24);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date().getTime() - 3600 * 1000 * 24;
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date() - 3600 * 1000 * 24;
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date() - 3600 * 1000 * 24;
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      },
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
      authList: [],
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
    this.getAuthorizationList();
  },
  methods: {
    perShow(data) {
      if (data) {
        let length = data.length;
        let per = "";
        for (let i = 0; i < length; i++) {
          let name = data[i];
          per += "<div><span>" + name + "</span></div>";
        }
        return per;
      }
    },
    getAuthorizationList() {
      this.setting.loading = true;
      let args = {
        page: this.pagination.currentPage,
        nick_name: this.filters.nick_name,
        service_type: this.filters.service_type
      };
      if (this.filters.service_type === "") {
        delete args.service_type;
      }
      if (this.filters.nick_name === "") {
        delete args.nick_name;
      }
      getAuthorizationList(this, args)
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
      this.getAuthorizationList();
    },
    search(formName) {
      this.pagination.currentPage = 1;
      this.getAuthorizationList();
    },
    changePage(currentPage) {
      this.pagination.currentPage = currentPage;
      this.getAuthorizationList();
    },
    naviToAdd() {
      this.$router.push({
        path: "/auth/list/add"
      });
    }
  }
};
</script>

<style lang="less" scoped>
@imgurl: "https://cdn.xingstation.cn/ad_shop/img/";
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
