<template>
  <div class="root">
    <div class="account-wrap">
      <div class="item-info">
        <div class="prize-title">{{ policyId ? '子条目修改' : '子条目新增' }}</div>
        <el-form 
          ref="policyForm" 
          :model="policyForm" 
          label-width="180px">
          <el-form-item
            :rules="[{ required: true, message: '请选择公司名称', trigger: 'submit'}]"
            label="公司名称"
            prop="coupon_batch_id"
          >
            <el-select
              v-model="policyForm.company_id"
              :loading="searchLoading"
              placeholder="请选择公司名称"
              filterable
              clearable
              @change="companyHandle"
            >
              <el-option
                v-for="item in companyList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            :rules="[{ required: true, message: '请选择奖品名称', trigger: 'submit'}]"
            label="奖品名称"
            prop="coupon_batch_id"
          >
            <el-select
              v-model="policyForm.coupon_batch_id"
              :loading="searchLoading"
              placeholder="请选择奖品名称"
              filterable
              clearable
            >
              <el-option
                v-for="item in couponList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            :rules="[{ required: true, message: '请填写发放比例', trigger: 'submit'}]"
            label="发放比例"
            prop="rate"
          >
            <el-input 
              v-model="policyForm.rate" 
              placeholder="请填写发放比例" 
              clearable/>
          </el-form-item>
          <el-form-item>
            <el-button 
              type="primary" 
              @click="submit('policyForm')">保存</el-button>
            <el-button @click="back">返回</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
import {
  historyBack,
  getCouponBatches,
  savePrizePolicyEntry,
  modifyPrizePolicyEntry,
  prizePolicyEntryDetails,
  getCompanies
} from "service";
import {
  Form,
  Select,
  Option,
  FormItem,
  Button,
  Input,
  MessageBox
} from "element-ui";
import { truncate } from "fs";
export default {
  components: {
    ElForm: Form,
    ElSelect: Select,
    ElOption: Option,
    ElFormItem: FormItem,
    ElButton: Button,
    ElInput: Input
  },
  data() {
    return {
      setting: {
        loading: false,
        loadingText: "拼命加载中"
      },
      policyId: null,
      searchLoading: false,
      policyForm: {
        company_id: null,
        rate: 0,
        coupon_batch_id: null
      },
      pid: null,
      couponList: [],
      companyList: []
    };
  },
  created() {
    this.policyId = this.$route.params.uid;
    this.pid = this.$route.query.pid;
    this.name = this.$route.query.name;
    this.getCompanies();
    if (this.policyId) {
      this.prizePolicyEntryDetails();
    }
  },

  methods: {
    prizePolicyEntryDetails() {
      this.setting.loading = true;
      let args = {
        include: "company"
      };
      prizePolicyEntryDetails(this, this.pid, this.policyId, args)
        .then(res => {
          this.companyHandle(res.company.id);
          this.policyForm.company_id = res.company.id;
          this.policyForm.rate = res.pivot.rate;
          this.policyForm.coupon_batch_id = res.pivot.coupon_batch_id;
          this.setting.loading = false;
        })
        .catch(err => {
          this.setting.loading = false;
          this.$message({
            type: "warning",
            message: err.response.data.message
          });
        });
    },
    companyHandle(val) {
      this.getCouponBatches(val);
    },
    getCompanies() {
      this.searchLoading = true;
      let args = {
        include: "couponBatches"
      };
      getCompanies(this, args)
        .then(response => {
          this.companyList = response;
          this.searchLoading = false;
        })
        .catch(err => {
          this.$message({
            type: "warning",
            message: err.response.data.message
          });
          this.searchLoading = false;
        });
    },
    submit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let args = {
            rate: this.policyForm.rate,
            coupon_batch_id: this.policyForm.coupon_batch_id
          };
          if (this.policyId) {
            modifyPrizePolicyEntry(this, this.pid, this.policyId, args)
              .then(response => {
                this.$message({
                  message: "修改成功",
                  type: "success"
                });
                this.$router.push({
                  path: "/prize/template/policy",
                  query: {
                    pid: this.pid,
                    name: this.name
                  }
                });
                this.setting.loading = false;
              })
              .catch(err => {
                this.$message({
                  type: "warning",
                  message: err.response.data.message
                });
                this.setting.loading = false;
              });
          } else {
            savePrizePolicyEntry(this, this.pid, args)
              .then(response => {
                this.$message({
                  message: "添加成功",
                  type: "success"
                });
                this.$router.push({
                  path: "/prize/template/policy",
                  query: {
                    pid: this.pid,
                    name: this.name
                  }
                });
                this.setting.loading = false;
              })
              .catch(err => {
                this.$message({
                  type: "warning",
                  message: err.response.data.message
                });
                this.setting.loading = false;
              });
          }
        }
      });
    },
    getCouponBatches(val) {
      let args = {
        company_id: val
      };
      getCouponBatches(this, args)
        .then(result => {
          this.couponList = result;
        })
        .catch(err => {
          this.$message({
            type: "warning",
            message: err.response.data.message
          });
        });
    },
    back() {
      historyBack();
    }
  }
};
</script>
<style lang="less" scoped>
.root {
  background: #fff;
  padding: 20px;
  .prize-title {
    font-size: 18px;
    margin: 15px 0 15px 15px;
  }
  .el-select,
  .el-input {
    width: 300px;
  }
}
</style>

