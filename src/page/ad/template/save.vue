<template>
    <div>
        <div class="ad_templates_save">
            <span class="item_list">子条目新增/修改</span>
            <el-form ref="form" :model="form" label-width="110px" >
                <el-form-item
                    :rules="[{ required: true, message: '请选择素材', trigger: 'submit'}]"
                    label="广告素材名称"
                    prop="id"
                    >
                    <el-select
                        v-model="form.id"
                        :loading="searchLoading"
                        filterable
                        placeholder="请选择广告素材"
                        clearable
                    >
                        <i 
                        slot="prefix" 
                        class="el-input__icon el-icon-project el-icon-same"/>
                        <el-option
                        v-for="item in projectList"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                        />
                    </el-select>
                    </el-form-item>
                <el-form-item 
                :rules="[{ required: true, trigger: 'submit'}]"
                label="显示模式" label-width="110px">
                    <el-select v-model="form.state" >
                    </el-select>
                </el-form-item>
                <el-form-item 
                label="素材播放" 
                :rules="[{ required: true, trigger: 'submit'}]"
                label-width="110px">
                    <el-radio-group v-model="form.resource">
                    <el-radio label="默认时长"  @change="hidden()"></el-radio>
                    <el-radio label="自定义时长" @change="show()"></el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item 
                :rules="[{ required: true, trigger: 'submit'}]"
                label="素材播放时长" 
                v-show="this.isShow" 
                label-width="110px">
                    <el-col :span="6">
                        <el-input v-model="form.playLength" ></el-input>
                    </el-col>&nbsp;&nbsp;秒
                </el-form-item>
                <el-form-item 
                :rules="[{ required: true, trigger: 'submit'}]"
                label="活动时间" 
                prop="time1"
                label-width="110px">
                    <el-col :span="6">
                        <el-time-picker
                            v-model="form.time1"
                            placeholder="任意时间点">
                        </el-time-picker>
                    </el-col>
                    <el-col class="line" :span="1" align='center'>-</el-col>
                    <el-col :span="6">
                        <el-time-picker
                            v-model="form.time2"
                            placeholder="任意时间点">
                        </el-time-picker>
                    </el-col>
                </el-form-item>
                
                <el-form-item label-width="110px" >
                    <el-button type="primary" @click="onSubmit('form')">保存</el-button>
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
import { historyBack, saveItemsProject, getMaterial} from "service";
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
            projectList: [],
            searchLoading: false,     
            form: {
                id: '',
                state:'全屏显示',
                resource: '',
                playLength:'',
                time1:"",
                time2:""
            },
            videoFlag: '',
            isShow: false,
        }
    },
    created() {
        this.getMaterial();
    },
    methods: {  
        
        getMaterial() {
            this.searchLoading = true;
            getMaterial(this)
                .then(res => {
                this.projectList = res;
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
                let args = {
                    state: this.form.state,
                    id: this.form.id,
                    resource: this.resource,
                    playLength:this.playLength,
                    date1:this.date1,
                    date2:this.date2
                };
                return saveItemsProject(this, args)
                    .then(response => {
                    this.setting.loading = false;
                    this.$message({
                        message: "添加成功",
                        type: "success"
                    });
                    this.$router.push({
                        path: "/ad/template/items"
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
        },
    }
}
</script>
<style lang='less' scoped>
.ad_templates_save{
    .item_list{
        display: inline-block;
        margin-bottom: 60px;
    }
    background: #fff;
    padding: 30px;
    .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }
    .avatar-uploader .el-upload:hover {
        border-color: #409EFF;
    }
    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 178px;
        height: 178px;
        line-height: 178px;
        text-align: center;
    }
    .avatar {
        width: 178px;
        height: 178px;
        display: block;
    }
}
</style>


