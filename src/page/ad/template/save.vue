<template>
  <div>
    <div class="ad_templates_save">
      <span class="item_list">{{ itemsID ? '子条目修改':'子条目新增' }}</span>
      <el-form
        ref="form"
        :model="form"
        label-position="top"
      >
        <el-form-item
          :rules="[{ required: true, message: '请选择素材', trigger: 'submit'}]"
          label="广告素材名称"
          prop="aid"
        >
          <el-select
            v-model="form.aid"
            :loading="searchLoading"
            :remote-method="getMaterial"
            placeholder="请选择广告素材"
            filterable
            clearable
            remote
          >

            <el-option
              v-for="item in mediaList"
              :key="item.aid"
              :label="item.name"
              :value="item.aid"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          :rules="[{ required: true, trigger: 'submit'}]"
          label="显示模式"
        >
          <el-select
            v-model="form.mode"
            disabled
          >
            <el-option
              label="全屏显示"
              value="fullscreen"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          :rules="[{ required: true, trigger: 'submit'}]"
          label="素材播放时长"
        >
          <el-input
            v-model="form.ktime"
            placeholder="请输入素材播放时长"
            style="width:350px"
          >
            <template slot="append">秒</template>
          </el-input>
        </el-form-item>
        <el-form-item
          :rules="[{ required: true, trigger: 'submit'}]"
          label="活动时间"
        >
          <div class="time">
            <el-time-select
              v-model="form.shm"
              :picker-options="{
                start: '00:00',
                step: '00:01',
                end: '23:59'
              }"
              placeholder="选择时间"
            />
            <div style="width:20px;text-align:center">-</div>
            <el-time-select
              v-model="form.ehm"
              :picker-options="{
                start: '00:00',
                step: '00:01',
                end: '23:59'
              }"
              placeholder="选择时间"
            />
          </div>
        </el-form-item>

        <el-form-item label-width="110px">
          <el-button
            type="primary"
            @click="onSubmit('form')"
          >保存</el-button>
          <el-button @click="back">返回</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import {
  Form,
  Select,
  Option,
  FormItem,
  Button,
  Input,
  MessageBox,
  TimeSelect,
  Radio,
  RadioGroup
} from "element-ui";
import {
  getItemDetail,
  historyBack,
  saveItemsProject,
  getMaterial,
  editItemsProject
} from "service";
import moment from "moment";
export default {
  components: {
    ElForm: Form,
    ElSelect: Select,
    ElOption: Option,
    ElFormItem: FormItem,
    ElButton: Button,
    ElRadio: Radio,
    ElRadioGroup: RadioGroup,
    ElInput: Input,
    elTimeSelect: TimeSelect
  },
  data() {
    return {
      setting: {
        isOpenSelectAll: true,
        loading: false,
        loadingText: "拼命加载中"
      },
      mediaList: [
      ],
      searchLoading: false,
      itemsID: null,
      form: {
        aid: "",
        mode: "fullscreen",
        ktime: 0,
        shm: "10:00",
        ehm: "22:00"
      },
      atiid: "",
    };
  },
  created() {
    this.atiid = this.$route.query.atiid;
    this.itemsID = this.$route.params.id;
    if (this.itemsID) {
      this.getItemDetail();
    }
  },
  methods: {
    async getItemDetail() {
      try {
        let args = {
          include: 'media'
        }
        let res = await getItemDetail(this, this.itemsID, args);
        let { aid, ehm, mode, ktime, shm, media } = res;
        this.getMaterial(media.name)
        this.form.aid = aid;
        this.form.mode = mode;
        this.form.ktime = ktime;
        this.form.shm = shm;
        this.form.ehm = ehm;
      } catch (e) { }
    },
    //获取广告素材下拉列表
    getMaterial(query) {
      if (query !== '') {
        let args = {
          name: query
        }
        this.searchLoading = true
        getMaterial(this, args).then(res => {
          this.mediaList = res.data
          this.searchLoading = false
        }).catch(err => {
          this.searchLoading = false
        })
      } else {
        this.mediaList = [];
      }
    },
    onSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.setting.loading = true;
          let args = this.form;
          args.atiid = this.atiid
          args.aid = this.form.aid
          if (this.itemsID) {
            editItemsProject(this, this.itemsID, args)
              .then(response => {
                this.setting.loading = false;
                this.$message({
                  message: "修改成功",
                  type: "success"
                });
                this.$router.push({
                  path: "/ad/template/items",
                  query: {
                    atiid: this.atiid
                  }
                });
              })
              .catch(err => {
                this.setting.loading = false;
                this.$message({
                  message: err.response.data.message,
                  type: "success"
                });
              });
          } else {
            saveItemsProject(this, args)
              .then(response => {
                this.setting.loading = false;
                this.$message({
                  message: "添加成功",
                  type: "success"
                });
                this.$router.push({
                  path: "/ad/template/items",
                  query: {
                    atiid: this.atiid
                  }
                });
              })
              .catch(err => {
                this.setting.loading = false;
                this.$message({
                  message: err.response.data.message,
                  type: "success"
                });
              });
          }
        }
      });
    },
    back() {
      historyBack();
    }
  }
};
</script>
<style lang='less' scoped>
.ad_templates_save {
  .el-select {
    width: 350px;
  }
  .item_list {
    display: inline-block;
    margin-bottom: 30px;
  }
  .el-radio-group {
    padding-left: 15px;
  }
  padding: 30px;
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409eff;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .type {
    background: #fff;
    width: 350px;
    .type-item {
      padding-left: 15px;
      background: #6b3dc4;
      color: #fff;
    }
  }
  .time {
    display: flex;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
}
</style>


