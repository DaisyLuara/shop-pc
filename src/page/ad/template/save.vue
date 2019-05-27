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
            filterable
            placeholder="请选择广告素材"
            clearable
          >
            <i
              slot="prefix"
              class="el-input__icon el-icon-project el-icon-same"
            />
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
          <el-select v-model="form.mode" />
        </el-form-item>
        <el-form-item
          :rules="[{ required: true, trigger: 'submit'}]"
          label=""
        >
          <div class="type">
            <div class="type-item">类型</div>
            <el-radio-group v-model="form.resource">
              <el-radio
                label="默认时长"
                @change="hidden()"
              />
              <el-radio
                label="自定义时长"
                @change="show()"
              />
            </el-radio-group>
          </div>
        </el-form-item>
        <el-form-item
          v-show="isShow"
          :rules="[{ required: true, trigger: 'submit'}]"
          label="素材播放时长"
        >
          <el-col :span="10">
            <el-input v-model="form.ktime" />
          </el-col>&nbsp;&nbsp;秒
        </el-form-item>
        <el-form-item
          :rules="[{ required: true, trigger: 'submit'}]"
          label="活动时间"
        >

          <div class="time">
            <el-time-picker
              v-model="form.shm"
              placeholder="任意时间点"
              @change="getTime1"
            />
            <div style="width:20px;text-align:center">-</div>
            <el-time-picker
              v-model="form.ehm"
              placeholder="任意时间点"
              @change="getTime2"
            />
          </div>

        </el-form-item>

        <el-form-item label-width="110px">
          <el-button
            type="primary"
            @click="onSubmit('form')"
          >保存</el-button>
          <el-button @click="back">取消</el-button>
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
  DatePicker,
  MessageBox,
  Upload,
  TimePicker,
  Col,
  Radio,
  RadioGroup,
  Progress
} from "element-ui";
import { historyBack, saveItemsProject, getMaterial } from "service";
import moment from "moment";
export default {
  components: {
    ElForm: Form,
    ElSelect: Select,
    ElOption: Option,
    ElFormItem: FormItem,
    ElButton: Button,
    ElDatePicker: DatePicker,
    ElUpload: Upload,
    ElTimePicker: TimePicker,
    ElCol: Col,
    ElRadio: Radio,
    ElRadioGroup: RadioGroup,
    ElInput: Input,
    ElProgress: Progress
  },
  data() {
    return {
      setting: {
        isOpenSelectAll: true,
        loading: false,
        loadingText: "拼命加载中"
      },
      mediaList: [],
      searchLoading: false,
      itemsID: null,
      form: {
        aid: "",
        mode: "fullscreen",
        resource: "",
        ktime: 15,
        shm: new Date("2108-09-01 00:00:00"),
        ehm: new Date("2108-09-01 23:59:59")
      },
      atiid: "",
      videoFlag: "",
      isShow: false
    };
  },
  created() {
    this.atiid = this.$route.query.atiid
    this.form.aid = this.$route.query.name
    this.form.time1 = new Date("2108-09-01 00:00:00");
    this.itemsID = this.$route.params.id;
    this.getMaterial();
  },
  methods: {
    getTime1(val) {
      let start_date = moment(val).format("HH:mm:ss");
    },
    getTime2(val) {
      let end_date = moment(val).format("HH:mm:ss");
    },
    //获取广告素材下拉列表
    getMaterial() {
      this.searchLoading = true;
      getMaterial(this)
        .then(res => {
          this.mediaList = res.data;
          console.log(this.mediaList)
          this.searchLoading = false;
        })
        .catch(err => {
          this.searchLoading = false;
          this.$message({
            message: err.response.data.message,
            type: "success"
          });
        });
    },
    hidden() {
      this.isShow = false;
    },
    show() {
      this.isShow = !this.isShow;
    },
    onSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.setting.loading = true;
          let args = this.form;
          args.atiid = this.atiid
          args.ktime *= 1
          args.shm = moment(args.shm).format("HH:mm");
          args.ehm = moment(args.ehm).format("HH:mm");
          console.log(args)
          return saveItemsProject(this, args)
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


