<template>
  <div class="ad-table">
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
              <span>{{ scope.row.hardware === 1? '开启':'关闭' }}</span>
            </el-form-item>
            <el-form-item label="类型">
              <span>{{ scope.row.type === 'program'? '节目广告':'小屏广告' }}</span>
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
      >
        <template slot-scope="scope">{{ scope.row.hardware === 1? '开启':'关闭' }}</template>
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        sortable
        prop="type"
        label="类型"
        min-width="100"
      >
        <template slot-scope="scope">{{ scope.row.type === 'program'? '节目广告':'小屏广告' }}</template>
      </el-table-column>
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
  </div>
</template>
<script>
import {
  Table,
  TableColumn,
  Button,
  Form,
  FormItem,
} from 'element-ui'
import { getAdList } from "service";
export default {
  props: {
    tableData: {
      type: Array,
      default: [],
      required: true,
    }
  },
  name: "AdTable",
  components: {
    "el-form": Form,
    'el-form-item': FormItem,
    "el-table": Table,
    "el-table-column": TableColumn,
    "el-button": Button,
  },
  data() {
    return {
      headerStyle: { background: "#6b3ec2", color: "#fff" },
      templateForm: {
        name: "",
        type: "program"
      },
    }
  },
  methods: {
    // 修改模板
    editPrizePolicy(item) {
      this.atiid = item.atiid;
      this.title = '编辑模版'
      this.templateForm.name = item.name
      this.templateForm.type = item.type
      this.dialogFormVisible = true;
      this.$emit("toIndex", item
      )
    },
    //子条目
    toItem(item) {
      this.$router.push({
        path: "/ad/template/items",
        query: {
          atiid: item.atiid
        }
      });
    },
  }
}
</script>

<style lang="less" scoped>
</style>
