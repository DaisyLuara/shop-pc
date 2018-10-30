<template>
  <div 
    class="root">
    <div  
      v-loading="setting.loading"
      :element-loading-text="setting.loadingText" 
      class="item-list-wrap">
      <div 
        class="item-content-wrap">
        <div 
          class="search-wrap">
          <el-form 
            ref="filters"
            :model="filters" 
            :inline="true">
            <el-form-item 
              label="" 
              prop="name">
              <el-input 
                v-model="filters.name" 
                placeholder="门店名称" 
                clearable />
            </el-form-item>
            <el-button
              type="primary" 
              @click="search('filters')">搜索</el-button>
          </el-form>
        </div>
        <div 
          class="actions-wrap">
          <span 
            class="label">
            账号总数: {{ pagination.total }} 
          </span>
          <el-button
            type="success"
            size="small"
            @click="addVerify" 
            >新增核销员</el-button>
        </div>
        <el-table 
          ref="multipleTable" 
          :data="tableData" 
          style="width: 100%">
          <el-table-column
            :show-overflow-tooltip="true"
            prop="point_id"
            label="门店ID"
            min-width="100">
          </el-table-column>
          <el-table-column
            :show-overflow-tooltip="true"
            prop="point_name"
            label="门店名称"
            min-width="100">
          </el-table-column>
          <el-table-column
            :show-overflow-tooltip="true"
            prop="verify_name"
            label="核销员"
            min-width="100">
          </el-table-column>
          <el-table-column
            :show-overflow-tooltip="true"
            prop="created_at"
            label="创建时间"
            min-width="80">
          </el-table-column>
          <el-table-column 
          label="操作" 
          width="180">
          <template 
            slot-scope="scope">
            <i 
              class="el-icon-edit-outline edit-icon">编辑</i>
            <i 
              class="el-icon-delete delete-icon"
              @click="deleteHandle">删除</i>
            <i 
              class="el-icon-remove remove-icon"
              @click="forbidHandle">禁止</i>
          </template>
        </el-table-column>
        </el-table>
        <div 
          class="pagination-wrap">
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
  Button,
  Input,
  Table,
  TableColumn,
  Pagination,
  Form,
  FormItem,
  MessageBox,
  Select,
  Option,
  DatePicker
} from 'element-ui'

export default {
  components: {
    'el-table': Table,
    'el-table-column': TableColumn,
    'el-button': Button,
    'el-input': Input,
    'el-pagination': Pagination,
    'el-form': Form,
    'el-form-item': FormItem,
    'el-select': Select,
    'el-option': Option,
    'el-date-picker': DatePicker
  },
  data() {
    return {
      filters: {
        name: ''
      },
      setting: {
        loading: false,
        loadingText: '拼命加载中'
      },
      pagination: {
        total: 2,
        pageSize: 10,
        currentPage: 1
      },
      tableData: [
        {
          point_id: 102567,
          point_name: '巴拉巴拉',
          verify_name: '陈大重',
          created_at: '2018-09-30'
        },
        {
          point_id: 102568,
          point_name: '棒约翰',
          verify_name: '陈二重',
          created_at: '2018-09-30 12:30'
        }
      ]
    }
  },
  created() {},
  methods: {
    search(formName) {
      this.pagination.currentPage = 1
    },
    forbidHandle() {
      this.$confirm('此操作将禁止操作核销, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$message({
            type: 'success',
            message: '禁止成功!'
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消禁止'
          })
        })
    },
    addVerify() {
      this.$router.push({
        path: '/verify/van/add'
      })
    },
    deleteHandle() {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    changePage(currentPage) {
      this.pagination.currentPage = currentPage
    }
  }
}
</script>

<style lang="less" scoped>
.root {
  font-size: 14px;
  color: #5e6d82;
  .item-list-wrap {
    background: #fff;
    padding: 30px;
    .item-content-wrap {
      .search-wrap {
        margin-top: 10px;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        font-size: 16px;
        align-items: center;
        margin-bottom: 10px;
        .item-input {
          width: 200px;
        }
        .el-form-item {
          margin-bottom: 0;
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
        margin-bottom: 10px;
        .label {
          font-size: 14px;
        }
      }
      .edit-icon {
        color: #3c9fff;
        font-weight: 700;
        cursor: pointer;
        padding-right: 5px;
      }
      .delete-icon {
        font-weight: 700;
        cursor: pointer;
        padding-right: 5px;
      }
      .remove-icon {
        color: #ff0000;
        font-weight: 700;
        cursor: pointer;
      }
      .pagination-wrap {
        margin: 10px auto;
        text-align: right;
      }
    }
  }
}
</style>
