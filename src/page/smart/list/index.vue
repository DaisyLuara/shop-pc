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
            <el-form-item label prop="project_id">
              <el-select
                icon="el-icon-search"
                v-model="filters.project_id"
                placeholder="请选择名称"
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
            <el-form-item label prop="template_id">
              <el-select
                icon="el-icon-search"
                v-model="filters.template_id"
                placeholder="请选择模版"
                filterable
                clearable
              >
                <el-option
                  v-for="item in templateList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item label prop="status">
              <el-select
                icon="el-icon-search"
                v-model="filters.status"
                placeholder="请选择状态"
                filterable
                clearable
              >
                <el-option
                  v-for="item in statusList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item label prop="dateTime">
              <el-date-picker
                v-model="filters.dateTime"
                :clearable="false"
                :picker-options="pickerOptions"
                type="daterange"
                align="right"
                unlink-panels
                start-placeholder="开始时间"
                end-placeholder="结束时间"
              />
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
import { getPointList } from "service";

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
  DatePicker
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
    "el-date-picker": DatePicker
  },
  data() {
    return {
      filters: {
        project_id: null,
        template_id: null,
        status: "",
        dateTime: []
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
      tableData: [
        {
          id: 1,
          name: "爱的表白	",
          image: "http://image.exe666.com/1007/image/479_1550230064.png",
          vedio_desc_url: "http://cdn.exe666.com/1007/video/8671552445178.mp4",
          template: { name: "镜视界通用场景" },
          version_code: "2019031810LZPDSpring",
          updated_at: "2019-01-16 19:01:01",
          top_num: 3,
          luck_num: 3,
          invite_num: 5
        },
        {
          id: 2,
          name: "爱的表白	",
          image: "http://image.exe666.com/1007/image/1547123390.jpg",
          vedio_desc_url: "http://cdn.exe666.com/1007/video/8671552445178.mp4",
          template: { name: "镜视界通用场景" },
          version_code: "2019031810LZPDSpring",
          updated_at: "2019-01-16 19:01:01",
          top_num: 1,
          luck_num: 2,
          invite_num: 4
        }
      ]
    };
  },
  created() {
    // this.getPointList();
  },
  methods: {
    starShow(num) {
      let star = "";
      for (let i = 0; i < num; i++) {
        star += "<i class='el-icon-star-off' style='color:#6b3dc4;'></i>";
      }
      console.log(star);
      return star;
    },
    getPointList() {
      this.setting.loading = true;
      let args = {
        include: "device,market,area",
        page: this.pagination.currentPage,
        point_name: this.filters.name,
        screen_status: this.filters.status
      };
      if (this.filters.name === "" || this.filters.name === null) {
        delete args.point_name;
      }
      if (this.filters.status === "") {
        delete args.screen_status;
      }
      getPointList(this, args)
        .then(res => {
          this.tableData = res.data;
          this.pagination.total = res.meta.pagination.total;
          this.setting.loading = false;
        })
        .catch(err => {
          console.log(err);
          this.setting.loading = false;
        });
    },
    resetSearch(formName) {
      this.$refs[formName].resetFields();
      this.pagination.currentPage = 1;
      this.getPointList();
    },
    search(formName) {
      this.pagination.currentPage = 1;
      this.getPointList();
    },
    changePage(currentPage) {
      this.pagination.currentPage = currentPage;
      this.getPointList();
    }
  }
};
</script>

<style lang="less" scoped>
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
