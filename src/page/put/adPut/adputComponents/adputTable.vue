<template>
  <div>
    <!-- 广告投放列表 -->
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
          <el-form
            label-position="left"
            inline
            class="demo-table-expand"
          >
            <el-form-item label="广告模版:">
              <span>{{ scope.row.template.name }}</span>
            </el-form-item>
            <el-form-item label="类型">
              <span>{{ scope.row.template.type === 'program'? '节目广告':'小屏广告' }}</span>
            </el-form-item>
            <el-form-item label="点位名称:">
              <span>{{ scope.row.point.name }}</span>
            </el-form-item>
            <el-form-item label="节目名称:">
              <span>{{ scope.row.project.name }}</span>
            </el-form-item>
            <el-form-item label="模版投放时间:">
              <span>{{ scope.row.sdate }} - {{ scope.row.edate }}</span>
            </el-form-item>
            <el-form-item label="修改时间:">
              <span>{{ scope.row.updated_at }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column
        sortable
        prop="aoid"
        label="ID"
        width="80"
      />
      <el-table-column
        :show-overflow-tooltip="true"
        sortable
        prop="scope.row.template.name"
        label="广告模版"
        width="100"
      >
        <template slot-scope="scope">{{ scope.row.template.name }}</template>
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        sortable
        prop="type"
        label="类型"
        min-width="100"
      >
        <template slot-scope="scope">{{ scope.row.template.type === 'program'? '节目广告':'小屏广告' }}</template>
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        sortable
        prop="scope.row.point.name"
        label="点位名称"
        min-width="100"
      >
        <template slot-scope="scope">{{ scope.row.point.name }}</template>
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        sortable
        prop="scope.row.project.name"
        label="节目名称"
        min-width="100"
      >
        <template slot-scope="scope">{{ scope.row.project.name }}</template>
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="scope.row.end_date"
        label="修改时间"
        min-width="100"
      >
        <template slot-scope="scope">{{ scope.row.updated_at }}</template>
      </el-table-column>
      <el-table-column
        label="操作"
        width="250"
      >
        <template slot-scope="scope">
          <el-button
            size="small"
            msg-father="scope.row"
            @click="editAdmeterial(scope.row)"
          >编辑</el-button>
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
export default {
  props: {
    tableData: {
      type: Array,
      default: [],
      required: true,
    }
  },
  name: "AdputTable",
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
    }
  },
  methods: {

  }
}
</script>
<style>
</style>
