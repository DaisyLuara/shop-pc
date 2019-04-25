<template>
  <div class="root">
    <h3 class="title">我的购物车</h3>
    <div class="cart-list">
      <el-table
        ref="multipleTable"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          type="selection"
          label="全选"
          width="55"
        >
        全选
        </el-table-column>
        <el-table-column
          label="配置信息"
          width="120"
        >
          <template slot-scope="scope">{{ scope.row.information }}</template>
        </el-table-column>
        <el-table-column
          prop="price"
          label="单价积分"
          width="120"
        >
        </el-table-column>
        <el-table-column
          prop="price"
          label="单价积分"
          width="120"
        >
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import {

} from "service";

import {
  Table,
  // Row,
  // Col,
  TableColumn,
  Button
} from "element-ui";

export default {
  components: {
    // "el-row": Row,
    // "el-col": Col,
    "el-table": Table,
    "el-table-column": TableColumn,
    "el-button": Button
  },
  data() {
    return {
      tableData: [{
        information: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        information: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        information: '2016-05-04',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        information: '2016-05-01',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        information: '2016-05-08',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        information: '2016-05-06',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        information: '2016-05-07',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }],
      multipleSelection: []
    };
  },
  created() {
  },
  methods: {
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleEdit(index, row) {
      console.log(index, row);
    },
    handleDelete(index, row) {
      console.log(index, row);
    }

  }
};
</script>

<style lang="less" scoped>
.root {
  .title {
    font-size: 30px;
    font-weight: 600;
    margin: 40px 0px;
    color: #7e58cb;
  }
}
</style>
