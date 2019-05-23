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
            <el-form-item label prop="point_name">
              <el-input v-model="filters.point_name" placeholder="请填写广告素材名称" clearable>
                <i slot="prefix" class="el-input__icon el-icon-name el-icon-same"/>
              </el-input>
            </el-form-item>
            <el-form-item label prop="screen_status">
              <el-select v-model="filters.screen_status" placeholder="请选择类型" filterable clearable>
                <i slot="prefix" class="el-input__icon el-icon-status el-icon-same"/>
                <el-option
                  v-for="item in typeList"
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
          <span class="label">素材列表（ {{ pagination.total }} ）</span>
          <el-button type="primary" icon="el-icon-circle-plus-outline" @click="addFodder">新增广告素材</el-button>
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
              <el-form label-position="left" inline class="demo-table-expand">
                <el-form-item label="ID:">
                  <span>{{ scope.row.id }}</span>
                </el-form-item>
                <el-form-item label="广告素材名称:">
                  <span>{{ scope.row.project.name }}</span>
                </el-form-item>
                <el-form-item label="类型:">
                  <span>{{ scope.row.type === 'static' ? '通用': scope.row.type === 'gif' ? 'Gif' : scope.row.type === 'video' ? '视频' : '帧序列' }}</span>
                </el-form-item>
                <el-form-item label="附件:">
                  <span>
                    <a
                      :href="scope.row.link"
                      target="_blank"
                      style="color:#6b3ec2;font-weight:600;"
                    >点击查看</a>
                  </span>
                </el-form-item>
                <el-form-item label="广告标记:">
                  <span>{{ scope.row.isad }}</span>
                </el-form-item>
                <el-form-item label="修改时间:">
                  <span>{{ scope.row.updated_at }}</span>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column :show-overflow-tooltip="true" sortable prop="id" label="ID" width="90"/>
          <el-table-column
            :show-overflow-tooltip="true"
            sortable
            prop="name"
            label="广告素材名称"
            min-width="80"
          >
            <template slot-scope="scope">{{ scope.row.project.name }}</template>
          </el-table-column>
          <el-table-column
            :show-overflow-tooltip="true"
            sortable
            prop="type"
            label="类型"
            min-width="100"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.type === 'static' ? '通用': scope.row.type === 'gif' ? 'Gif' : scope.row.type === 'video' ? '视频' : '帧序列' }}</span>
            </template>
          </el-table-column>
          <el-table-column
            :show-overflow-tooltip="true"
            sortable
            prop="link"
            label="附件"
            min-width="80"
          >
            <template slot-scope="scope">
              <a
                :href="scope.row.video_desc_url"
                target="_blank"
                style="color:#6b3ec2;font-weight:600;"
              >点击查看</a>
            </template>
          </el-table-column>
          <el-table-column
            :show-overflow-tooltip="true"
            sortable
            prop="isad"
            label="广告标记"
            min-width="90"
          />
          <el-table-column
            :show-overflow-tooltip="true"
            sortable
            prop="updated_at"
            label="修改时间"
            min-width="90"
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
import { getDeviceList } from "service";

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
        screen_status: null,
        point_name: null
      },
      typeList: [
        {
          id: "static",
          name: "静态图"
        },
        {
          id: "git",
          name: "Gif"
        },
        {
          id: "video",
          name: "视频"
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
      tableData: []
    };
  },
  created() {
    // this.getDeviceList();
  },
  methods: {
    addFodder(data) {
      this.$router.push({
        path: "/ad/fodder/add"
      });
    },
    getDeviceList() {
      this.setting.loading = true;
      let { point_name, screen_status } = this.filters;
      let args = {
        include: "point,project",
        page: this.pagination.currentPage,
        point_name: point_name,
        screen_status: screen_status
      };
      if (point_name === "") {
        delete args.point_name;
      }

      if (screen_status === "") {
        delete args.screen_status;
      }
      getDeviceList(this, args)
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
      this.getDeviceList();
    },
    search(formName) {
      this.pagination.currentPage = 1;
      this.getDeviceList();
    },
    changePage(currentPage) {
      this.pagination.currentPage = currentPage;
      this.getDeviceList();
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
