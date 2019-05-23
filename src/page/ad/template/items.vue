<template>
    <div class="root">
        <div 
            v-loading="setting.loading"
            :element-loading-text="setting.loadingText"
            class="ad_templates_items"
        >
            <div class="ad_list_title">
                 <div class="title">
                    子条目列表({{tableData[0].num}})
                 </div>
                <el-button class="save" @click="saveItem">新增条目</el-button>
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
                  class="demo-table-expand">
                  <el-form-item label="ID:">
                    <span>{{ scope.row.id }}</span>
                  </el-form-item>
                  <el-form-item label="广告素材名称:">
                    <span>{{ scope.row.title }}</span>
                  </el-form-item>
                  <el-form-item label="素材:">
                    <span>{{ scope.row.icon }}</span>
                  </el-form-item>
                  <el-form-item label="显示模式">
                    <span>{{ scope.row.accord }}</span>
                  </el-form-item>
                  <el-form-item label="素材时长">
                    <span>{{ scope.row.length }}</span>
                  </el-form-item>
                  <el-form-item label="素材投放时间">
                    <span>{{ scope.row.putTime}}</span>
                  </el-form-item>
                  <el-form-item label="素材修改时间">
                    <span>{{ scope.row.modifyTime}}</span>
                  </el-form-item>
                </el-form>
              </template>
            </el-table-column>
            <el-table-column 
              :show-overflow-tooltip="true" 
              sortable 
              prop="id" 
              label="ID" 
              width="100"/>
            <el-table-column
              :show-overflow-tooltip="true"
              sortable
              prop="title"
              label="广告素材名称"
              min-width="110"
            />
            <el-table-column
              :show-overflow-tooltip="true" 
              sortable 
              prop="icon" 
              label="素材"
              min-width="100">
              <template slot-scope="scope">
                <span>
                  <img :src="scope.row.icon" width="40px"/>
                </span>
              </template>
            </el-table-column>
            <el-table-column
              :show-overflow-tooltip="true"
              sortable
              prop="accord"
              label="显示模式"
              min-width="100"
            />
            <el-table-column
              :show-overflow-tooltip="true"
              sortable
              prop="length"
              label="素材时长"
              min-width="100"
            />
            <el-table-column
              :show-overflow-tooltip="true"
              sortable
              prop="putTime"
              label="素材投放时间"
              min-width="130"
            />
            <el-table-column
              :show-overflow-tooltip="true"
              sortable
              prop="modifyTime"
              label="修改时间"
              min-width="110"
            />
            <el-table-column 
              label="操作" 
              width="170">
              <template slot-scope="scope">
                <el-button 
                  size="small" 
                  @click="editItem(scope.row)">编辑</el-button>
                <el-button 
                  size="small" 
                  @click="deleteItem(scope.row)">删除</el-button>
              </template>
            </el-table-column>
        </el-table>
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
  Pagination,
  Form,
  FormItem
} from "element-ui";
import { getItemList } from "service";

export default {
    components: {
    "el-table": Table,
    "el-table-column": TableColumn,
    "el-button": Button,
    "el-pagination": Pagination,
    "el-form": Form,
    "el-form-item": FormItem,
    
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
                tableData:[
                    {
                        id:1,
                        title: '测试',
                        accord: '全屏显示',
                        length: '15秒',
                        putTime:'2019/01/01',
                        modifyTime:'2019/05/21',
                        num: 1,
                        icon: 'http://image.xingstation.cn/1007/image/393_511_941_578_ic_launcher.png'
                    }
                ],
        }
    },
    created() {
      this.getItemList();
    },
    methods: {
      getItemList() {
      this.setting.loading = true;
        getItemList(this)
        .then(res => {
          this.tableData =res.data;
          this.pagination.total = response.meta.pagination.total;
          this.setting.loading = false;
        })
        .catch( error => {
          this.setting.loading = false;
          this.$message({
            type: "warning",
            message: err.response.data.message
          });
        })
      },
      saveItem() {
        this.$router.push({
            path: '/ad/template/save'
        })
      }
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
            .title{
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
        .demo-table-expand .el-form-item {
            margin-right: 0;
            margin-bottom: 0;
            width: 50%;
        }
</style>
