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
            <el-form-item label prop="piid">
              <el-select
                v-model="filters.piid"
                :oading="searchLoading"
                placeholder="请选择节目"
                filterable
                clearable
              >
                <i slot="prefix" class="el-input__icon el-icon-name"></i>
                <el-option
                  v-for="item in projectList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item label prop="wiid">
              <el-select
                v-model="filters.wiid"
                :loading="searchLoading"
                placeholder="请选择授权链接"
                filterable
                clearable
              >
                <i slot="prefix" class="el-input__icon el-icon-link"></i>
                <el-option
                  v-for="item in linkList"
                  :key="item.id"
                  :label="item.nick_name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item label prop="visiable">
              <el-select v-model="filters.visiable" placeholder="请选择状态" filterable clearable>
                <i slot="prefix" class="el-input__icon el-icon-status"></i>
                <el-option
                  v-for="item in statusList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item label>
              <el-button class="el-button-success" @click="search('filters')">搜索</el-button>
              <el-button class="el-button-cancel" @click="resetSearch('filters')">重置</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="actions-wrap">
          <span class="label">授权投放列表（ {{ pagination.total }} ）</span>
          <el-button type="primary" icon="el-icon-circle-plus-outline" @click="addAccredit">新增投放</el-button>
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
                <el-form-item label="区域:">
                  <span>{{ scope.row.point.market.area.name }}</span>
                </el-form-item>
                <el-form-item label="场地:">
                  <span>{{ scope.row.point.market.name }}</span>
                </el-form-item>
                <el-form-item label="点位:">
                  <span>{{ scope.row.point.name }}</span>
                </el-form-item>
                <el-form-item label="节目:">
                  <span>{{ scope.row.name }}</span>
                </el-form-item>
                <el-form-item label="授权链接:">
                  <span>{{ scope.row.wechat.nick_name }}</span>
                </el-form-item>
                <el-form-item label="类型:">
                  <span>{{ typeTransform(scope.row) }}</span>
                </el-form-item>
                <el-form-item label="状态:">
                  <span
                    :class="(scope.row.visible === 0) ? 'sold-out-expand' : 'operating-expand'"
                  >{{ scope.row.visible ===0 ? '下架': '运营中' }}</span>
                </el-form-item>
                <el-form-item label="时间:">
                  <span>{{ scope.row.updated_at }}</span>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column sortable :show-overflow-tooltip="true" prop="id" label="ID" width="70"/>
          <el-table-column
            sortable
            :show-overflow-tooltip="true"
            prop="area"
            label="区域"
            min-width="80"
          >
            <template slot-scope="scope">{{ scope.row.point.market.area.name }}</template>
          </el-table-column>
          <el-table-column
            sortable
            :show-overflow-tooltip="true"
            prop="site_name"
            label="场地"
            min-width="80"
          >
            <template slot-scope="scope">{{ scope.row.point.market.name }}</template>
          </el-table-column>
          <el-table-column
            sortable
            :show-overflow-tooltip="true"
            prop="point"
            label="点位"
            min-width="80"
          >
            <template slot-scope="scope">{{ scope.row.point.name }}</template>
          </el-table-column>
          <el-table-column
            sortable
            :show-overflow-tooltip="true"
            prop="name"
            label="节目"
            min-width="80"
          />
          <el-table-column
            sortable
            :show-overflow-tooltip="true"
            prop="link"
            label="授权链接"
            min-width="90"
          >
            <template slot-scope="scope">{{ scope.row.wechat.nick_name }}</template>
          </el-table-column>
          <el-table-column
            sortable
            :show-overflow-tooltip="true"
            prop="status"
            label="状态"
            min-width="100"
          >
            <template slot-scope="scope">
              <span
                :class="(scope.row.visible === 0) ? 'sold-out' : 'operating'"
              >{{ scope.row.visible===0 ? '下架': '运营中' }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150">
            <template slot-scope="scope">
              <el-button size="small" @click="editAccredit(scope.row)">编辑</el-button>
              <el-button
                v-if="scope.row.visible !== 0"
                size="small"
                @click="modifyLaunchWechat(scope.row)"
              >下架</el-button>
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
  </div>
</template>

<script>
import {
  getProject,
  getAuthorizer,
  getLaunchWechatList,
  modifyLaunchWechat
} from "service";

import {
  Button,
  Table,
  TableColumn,
  Pagination,
  Form,
  FormItem,
  MessageBox,
  Select,
  Option
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
    "el-select": Select,
    "el-option": Option
  },
  data() {
    return {
      filters: {
        visiable: "",
        piid: null,
        wiid: null
      },
      projectList: [],
      linkList: [],
      statusList: [
        {
          id: 0,
          name: "下架"
        },
        {
          id: 1,
          name: "运营中"
        }
      ],
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
      tableData: [],
      searchLoading: false
    };
  },
  created() {
    this.getLaunchWechatList();
    this.getProject();
    this.getAuthorizer();
  },
  methods: {
    typeTransform(data) {
      let type = data.type;
      switch (type) {
        case "normal":
          return "普通";
          break;
        case "mobile":
          return "手机号";
          break;
        case "publick":
          return "公众号";
          break;
        case "subk":
          return "订阅号";
          break;
        case "apps":
          return "小程序";
          break;
        case "tmall":
          return "天猫";
          break;
      }
    },
    modifyLaunchWechat(data) {
      let id = data.id;
      let args = {
        visiable: 0
      };
      this.$confirm("此操作将下架, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          modifyLaunchWechat(this, id, args)
            .then(res => {
              this.setting.loading = false;
              this.$message({
                message: "下架成功",
                type: "success"
              });
              this.getLaunchWechatList();
            })
            .catch(err => {
              this.$message({
                message: err.response.data.message,
                type: "success"
              });
              this.setting.loading = false;
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消下架"
          });
        });
    },
    getProject() {
      this.searchLoading = true;
      getProject(this)
        .then(res => {
          this.searchLoading = false;
          this.projectList = res;
        })
        .catch(err => {
          this.searchLoading = false;
          this.$message({
            type: "warning",
            message: err.response.data.message
          });
        });
    },
    getAuthorizer() {
      this.searchLoading = true;
      getAuthorizer(this)
        .then(res => {
          this.searchLoading = false;
          this.linkList = res;
        })
        .catch(err => {
          this.searchLoading = false;
          this.$message({
            type: "warning",
            message: err.response.data.message
          });
        });
    },
    addAccredit() {
      this.$router.push({
        path: "/put/accredit/save"
      });
    },
    editAccredit(data) {
      this.$router.push({
        path: "/put/accredit/edit/" + data.id
      });
    },
    getLaunchWechatList() {
      this.setting.loading = true;
      let args = {
        include: "point.market.area,project,wechat",
        page: this.pagination.currentPage,
        piid: this.filters.piid,
        wiid: this.filters.wiid,
        visiable: this.filters.visiable
      };
      if (!this.filters.piid) {
        delete args.piid;
      }
      if (!this.filters.wiid) {
        delete args.wiid;
      }
      if (this.filters.visiable === "") {
        delete args.visiable;
      }
      getLaunchWechatList(this, args)
        .then(res => {
          this.tableData = res.data;
          this.pagination.total = res.meta.pagination.total;
          this.setting.loading = false;
        })
        .catch(err => {
          this.setting.loading = false;
        });
    },
    resetSearch(formName) {
      this.$refs[formName].resetFields();
      this.pagination.currentPage = 1;
      this.getLaunchWechatList();
    },
    search(formName) {
      this.pagination.currentPage = 1;
      this.getLaunchWechatList();
    },
    changePage(currentPage) {
      this.pagination.currentPage = currentPage;
      this.getLaunchWechatList();
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
        .el-icon-name {
          &:before {
            content: " ";
            display: inline-block;
            background: url("@{imgurl}name_icon.png") center center/100% auto
              no-repeat;
            width: 15px;
            height: 15px;
            position: absolute;
            top: 50%;
            left: 3%;
            transform: translateY(-50%);
          }
        }
        .el-icon-link {
          &:before {
            content: " ";
            display: inline-block;
            background: url("@{imgurl}link_icon.png") center center/100% auto
              no-repeat;
            width: 15px;
            height: 15px;
            position: absolute;
            top: 50%;
            left: 3%;
            transform: translateY(-50%);
          }
        }
        .el-icon-status {
          &:before {
            content: " ";
            display: inline-block;
            background: url("@{imgurl}status_icon.png") center center/100% auto
              no-repeat;
            width: 15px;
            height: 15px;
            position: absolute;
            top: 50%;
            left: 3%;
            transform: translateY(-50%);
          }
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
