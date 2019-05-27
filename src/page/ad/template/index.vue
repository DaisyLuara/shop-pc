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
        <div class="title">广告模板列表({{pagination.count }})</div>
        <el-button
          class="save"
          @click="addPrizePolicy"
        >新增广告模板</el-button>
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
              class="demo-table-expand"
            >
              <el-form-item label="ID:">
                <span>{{ scope.row.atiid }}</span>
              </el-form-item>
              <el-form-item label="广告模板名称:">
                <span>{{ scope.row.name }}</span>
              </el-form-item>
              <el-form-item label="节目运行状态">
                <span>{{ scope.row.hardware ==1? '开启':'关闭'}}</span>
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
        />
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
import { getAdList, modifyMediaAdName, editmodifyMediaAdName } from 'service';
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
        currentPage: 1
      },
      atiid: null
    };
  },
  created() {
    this.getAdList();
  },
  methods: {
    getAdList() {
      this.setting.loading = true;
      let args = {
        page: this.pagination.currentPage,
        name: this.filters.name
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
      this.$prompt("模板名", "增加模板", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputPlaceholder: "请输入模板名",
        inputValue: item.title
      })
        .then((confirm) => {
          this.modifyAdName(confirm)
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消"
          });
        });
    },
    async modifyAdName(data) {
      let params = {
        name: data.value
      };
      try {
        await modifyMediaAdName(this, params);
        this.$message({
          type: 'success',
          message: "新增成功"
        });
        let mediaAdData = await getAdList(this);
        this.tableData = mediaAdData.data;
      } catch (e) {
        console.log(e);
      }
    },
    //修改模板
    editPrizePolicy(item) {
      this.atiid = item.atiid
      this.$prompt("模板名", "修改模板", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputPlaceholder: "请输入模板名",
        inputValue: item.title
      })
        .then((confirm) => {
          this.editmodifyAdName(confirm)
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消"
          });
        });
    },
    async editmodifyAdName(data) {
      let params = {
        name: data.value,
      };
      let atiid = this.atiid
      try {
        await editmodifyMediaAdName(this, atiid, params);
        this.$message({
          type: 'success',
          message: "修改成功"
        });
        let mediaAdData = await getAdList(this);
        this.tableData = mediaAdData.data;
      } catch (e) {
        console.log(e);
      }
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
    //子条目
    toItem(item) {
      this.$router.push({
        path: "/ad/template/items",
        query: {
          atiid: item.atiid
        }
      });
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
