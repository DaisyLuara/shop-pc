<template>
  <div class="root">
    <div
      v-loading="setting.loading"
      :element-loading-text="setting.loadingText"
      class="ad_templates_items"
    >
      <div class="ad_list_title">
        <div class="title">
          子条目列表({{ pagination.count}})
        </div>
        <el-button
          class="save"
          @click="saveItem"
        >新增条目</el-button>
      </div>
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
                <span>{{ scope.row.id }}</span>
              </el-form-item>
              <el-form-item label="广告素材名称:">
                <span>{{ scope.row.media.name }}</span>
              </el-form-item>
              <el-form-item label="素材:">
                <span>{{ scope.row.media.link }}</span>
              </el-form-item>
              <el-form-item label="显示模式">
                <span>{{ scope.row.mode }}</span>
              </el-form-item>
              <el-form-item label="素材时长">
                <span>{{ scope.row.ktime }}</span>
              </el-form-item>
              <el-form-item label="素材投放时间">
                <span>{{ scope.row.shm }}</span>
              </el-form-item>
              <el-form-item label="素材修改时间">
                <span>{{ scope.row.ehm }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column
          :show-overflow-tooltip="true"
          sortable
          prop="id"
          label="ID"
          width="100"
        />
        <el-table-column
          :show-overflow-tooltip="true"
          sortable
          prop="media.name"
          label="广告素材名称"
          min-width="110"
        />
        <el-table-column
          :show-overflow-tooltip="true"
          sortable
          prop="media.link"
          label="素材"
          min-width="100"
        >
          <template slot-scope="scope">
            <span>
              <img
                :src="scope.row.media.link"
                width="40px"
              >
            </span>
          </template>
        </el-table-column>
        <el-table-column
          :show-overflow-tooltip="true"
          sortable
          prop="mode"
          label="显示模式"
          min-width="100"
        />
        <el-table-column
          :show-overflow-tooltip="true"
          sortable
          prop="ktime"
          label="素材时长"
          min-width="100"
        />
        <el-table-column
          :show-overflow-tooltip="true"
          sortable
          prop="shm"
          label="素材投放时间"
          min-width="130"
        />
        <el-table-column
          :show-overflow-tooltip="true"
          sortable
          prop="ehm"
          label="修改时间"
          min-width="110"
        />
        <el-table-column
          label="操作"
          width="170"
        >
          <template slot-scope="scope">
            <el-button
              size="small"
              @click="editItem(scope.row)"
            >编辑</el-button>
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
import Vue from 'vue'
import {
  Button,
  Select,
  Option,
  MessageBox,
  Table,
  TableColumn,
  Form,
  FormItem,
  Pagination,

} from "element-ui";
import { getItemList } from "service";

export default {
  components: {
    "el-table": Table,
    "el-table-column": TableColumn,
    "el-button": Button,
    "el-form": Form,
    "el-form-item": FormItem,
    "el-pagination": Pagination,
    "el-select": Select,
    "el-option": Option
  },
  data() {
    return {
      headerStyle: { background: "#6b3ec2", color: "#fff" },
      loading: true,
      setting: {
        loading: false,
        loadingText: "拼命加载中"
      },
      atiid: '',
      tableData: [],
      pagination: {
        total: 0,
        pageSize: 10,
        currentPage: 1
      }
    }
  },
  created() {
    this.getItemList();
    this.atiid = this.$route.query.atiid
  },
  methods: {
    getItemList() {
      let atiid = this.$route.query.atiid
      let args = {
        atiid: atiid,
        include: "media",
      }
      this.setting.loading = true;
      getItemList(this, args)
        .then(res => {
          this.tableData = res.data;
          this.pagination = res.meta.pagination;
          this.pagination.total = res.meta.pagination.total;
          this.setting.loading = false;
        })
        .catch(err => {
          this.setting.loading = false;
          this.$message({
            type: "warning",
            message: err.response.data.message
          });
        })
    },
    saveItem() {
      this.$router.push({
        path: '/ad/template/save',
        query: {
          atiid: this.atiid
        }

      })
    },
    editItem(data) {
      console.log(data)
      this.$router.push({
        path: '/ad/template/edit/' + data.id,
        query: {
          atiid: this.atiid,
          name: data.media.name
        }
      })
    },
    changePage(currentPage) {
      this.pagination.currentPage = currentPage;
      this.getAdList();
    },
  }
}
</script>
<style lang='less' scoped>
.ad_templates_items {
  background: #fff;
  padding: 30px;
  .ad_list_title {
    width: 100%;
    height: 3rem;
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
}
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.pagination-wrap {
  margin: 10px auto;
  text-align: right;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
</style>
