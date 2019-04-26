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
          width="55"
        >
        </el-table-column>
        <el-table-column
          label="配置信息"
          width="320"
        >
          <template slot-scope="scope">{{ scope.row.information }}</template>
        </el-table-column>
        <el-table-column
          prop="price"
          label="单价积分"
          width="220"
        >
        </el-table-column>
        <el-table-column
          prop="number"
          label="数量"
          width="220"
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
    <div class="biling-bar">
      <ul>
        <li>已选商品<span>{{totalNumber}}</span>件</li>
      </ul>
    </div>
  </div>
</template>

<script>
import {

} from "service";

import {
  Table,
  TableColumn,
  Button
} from "element-ui";

export default {
  components: {
    "el-table": Table,
    "el-table-column": TableColumn,
    "el-button": Button
  },
  data() {
    return {
      tableData: [{
        information: '节目名称',
        price: 20,
        number: 1
      }, {
        information: '节目名称',
        price: 20,
        number: 1
      }],
      multipleSelection: []
    };
  },
  computed: {
    totalNumber() {
      return this.multipleSelection.length
    }
  },
  created() {
  },
  methods: {
    handleSelectionChange(val) {
      this.multipleSelection = val;
      console.log(this.multipleSelection)
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
  margin-top: -40px;
  margin-left: -20px;
  background-color: #fff;
  padding: 40px;
  .title {
    font-size: 28px;
    font-weight: 600;
    color: #7e58cb;
  }
  .cart-list {
    margin-top: 40px;
  }
}
</style>
