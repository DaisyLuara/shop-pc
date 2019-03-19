<template>
  <div class="item-wrap-template">
    <div
      v-loading="setting.loading"
      :element-loading-text="setting.loadingText"
      class="pane"
    >
      <div class="pane-title">
        新增节目投放
      </div>
      <el-form
        ref="projectForm"
        :model="projectForm"
        label-width="150px"
      >
        <el-form-item
          :rules="[{ required: true, message: '请输入节目名称', trigger: 'submit'}]"
          label="节目名称"
          prop="project"
        >
          <el-select
            v-model="projectForm.project"
            :loading="searchLoading"
            filterable
            placeholder="请搜索"
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
        <el-form-item
          :rules="[{ required: true, message: '请输入点位', trigger: 'submit',type: 'array'}]"
          label="点位"
          prop="point"
          multiple
          :limit="5"
        >
          <el-select
            v-model="projectForm.point"
            :loading="searchLoading"
            placeholder="请选择"
            filterable
            clearable
          >
            <el-option
              v-for="item in pointList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="开始时间"
          prop="sdate"
        >
          <el-date-picker
            v-model="projectForm.sdate"
            :editable="false"
            type="date"
            placeholder="请选择开始时间"
          />
        </el-form-item>
        <el-form-item
          label="结束时间"
          prop="edate"
        >
          <el-date-picker
            v-model="projectForm.edate"
            :editable="false"
            type="date"
            placeholder="请选择结束时间"
            value-format="yyyy-MM-dd"
          />
        </el-form-item>
        <el-form-item>
          <el-button
            class="el-button-success"
            @click="submit('projectForm')"
          >完成</el-button>
          <el-button
            class="el-button-cancel"
            @click="back"
          >返回</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import {
  historyBack,
  // savePorjectLaunch,
  // getSearchModuleList,
  // getSearchProjectList,
  // getSearchAeraList,
  // getSearchMarketList,
  // getSearchPointList
} from 'service'
import {
  Form,
  Select,
  Option,
  FormItem,
  Button,
  Input,
  DatePicker,
  MessageBox
} from 'element-ui'

export default {
  components: {
    ElForm: Form,
    ElSelect: Select,
    ElOption: Option,
    ElFormItem: FormItem,
    ElButton: Button,
    ElDatePicker: DatePicker
  },
  data() {
    return {
      setting: {
        isOpenSelectAll: true,
        loading: false,
        loadingText: '拼命加载中'
      },
      pointList: [],
      projectList: [],
      searchLoading: false,
      projectForm: {
        project: [],
        point: [],
        sdate: '',
        edate: ''
      },
    }
  },
  mounted() { },
  created() {
  },
  methods: {
    back() {
      historyBack()
    },
    getProject(query) {
      if (query !== '') {
        this.searchLoading = true
        let args = {
          name: query
        }
        return getSearchProjectList(this, args)
          .then(response => {
            this.projectList = response.data
            if (this.projectList.length == 0) {
              this.projectForm.project = []
              this.projectList = []
            }
            this.searchLoading = false
          })
          .catch(err => {
            console.log(err)
            this.searchLoading = false
          })
      } else {
        this.projectList = []
      }
    },
    getPoint() {
      let args = {
        include: 'market',
        market_id: this.projectForm.market
      }
      this.searchLoading = true
      return getSearchPointList(this, args)
        .then(response => {
          this.pointList = response.data
          this.searchLoading = false
        })
        .catch(err => {
          this.searchLoading = false
          console.log(err)
        })
    },

    submit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.setting.loading = true
          let edate =
            (new Date(this.projectForm.edate).getTime() +
              ((23 * 60 + 59) * 60 + 59) * 1000) /
            1000
          let args = {
            sdate: new Date(this.projectForm.sdate).getTime() / 1000,
            edate: edate,
            default_plid: this.projectForm.project[0],
            oids: this.projectForm.point,
          }
          return savePorjectLaunch(this, args)
            .then(response => {
              this.setting.loading = false
              this.$message({
                message: '添加成功',
                type: 'success'
              })
              this.$router.push({
                path: '/put/list'
              })
            })
            .catch(err => {
              this.setting.loading = false
              console.log(err)
            })
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.item-wrap-template {
  .pane {
    border-radius: 5px;
    background-color: white;
    padding: 20px 40px 80px;

    .el-select,
    .item-input,
    .el-date-editor.el-input {
      width: 380px;
    }
    .item-list {
      .program-title {
        color: #555;
        font-size: 14px;
      }
    }
    .pane-title {
      padding-bottom: 20px;
      font-size: 18px;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
    }
  }
}
</style>
