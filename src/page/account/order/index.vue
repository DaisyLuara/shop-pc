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
              prop="no">
              <el-input 
                v-model="filters.no" 
                placeholder="填写订单编号" 
                clearable>
                <i 
                  slot="prefix" 
                  class="el-input__icon el-icon-name el-icon-same"/>
              </el-input>
            </el-form-item>
            <el-form-item 
              label 
              prop="created_at">
              <el-date-picker
                v-model="filters.created_at"
                :editable="false"
                type="date"
                placeholder="请选择购买时间"
              />
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
          <span class="label">我的订单 （ {{ pagination.total }} ）</span>
        </div>
        <!-- 表格 -->
        <el-table
          ref="multipleTable"
          :data="tableData"
          :row-style="{height:'70px'}"
          :header-cell-style="headerStyle"
          stripe
          style="width: 100%"
        >
          <el-table-column 
            :show-overflow-tooltip="true" 
            sortable 
            prop="no" 
            label="订单号" 
            min-width="90"/>
          <el-table-column
            :show-overflow-tooltip="true"
            sortable
            prop="created_at"
            label="购买时间"
            min-width="80"/>
          <el-table-column
            :show-overflow-tooltip="true"
            sortable
            prop="status_name"
            label="状态"
            min-width="100"
          >
            <template slot-scope="scope">
              <span v-html="scope.row.status_name"/>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            width="100"
          >
            <template slot-scope="scope">
              <el-button
                size="small"
                @click="linkToEdit(scope.row)"
              >详情</el-button>
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
import { getOrderList } from "service";
import moment from 'moment'
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
  Input,
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
    "el-input": Input,
    "el-date-picker": DatePicker
  },
  data() {
    return {
      filters: {
        no: null,
        created_at: null
      },
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
    this.getOrderList();
  },
  methods: {
    linkToEdit(data){
      this.$router.push({
        path:'/account/order/detail/'+data.id
      })
    },
    getOrderList() {
      this.setting.loading = true;
      let args = {
        page: this.pagination.currentPage,
        no: this.filters.no,
        created_at: moment(this.filters.created_at).format('YYYY-MM-DD')
      };
      if (!this.filters.no) {
        delete args.no;
      }

      if (!this.filters.created_at) {
        delete args.created_at;
      }
      getOrderList(this, args)
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
      this.getOrderList();
    },
    search(formName) {
      this.pagination.currentPage = 1;
      this.getOrderList();
    },
    changePage(currentPage) {
      this.pagination.currentPage = currentPage;
      this.getOrderList();
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
