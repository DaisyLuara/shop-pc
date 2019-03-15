<template>
  <div
    v-loading="setting.loading"
    :element-loading-text="setting.text"
    element-loading-spinner="el-icon-loading"
    class="root"
  >
    <div class="account-wrap">
      <!-- 商户信息 -->
      <div class="account-details">
        <!-- <div 
          class="account-avatar">
          <img 
            :src="avatar" 
            class="avatar">
        </div>-->
        <div class="account-content">
          <div v-show="!editName" class="account-item">
            <div class="account-item-title">
              公司名称：
              <i
                class="el-icon-edit-outline icon-edit"
                @click="editName = true, company_name = name"
              />
            </div>
            <div class="account-item-content">{{ name }}</div>
          </div>
          <div v-show="editName" class="account-item">
            <div class="account-item-title">公司名称：</div>
            <el-input v-model="company_name" class="item-input"/>
            <el-button type="primary" size="mini" @click="saveCompanyName">保存</el-button>
          </div>
          <div class="account-item">
            <div class="account-item-title">认证等级:</div>
          </div>
          <div class="account-item grade">
            <span>
              <img :src="IMG_URL+'ad_shop/img/account_2.png?v=1'" class="grade_1">
            </span>
            <span class="grade_name">LV.1</span>
            <div class="grade-line">
              <div class="grade-line-done"/>
            </div>
          </div>
        </div>
      </div>
      <!-- 账号密码设置 -->
      <div class="account-password">
        <div class="account-title">
          <h4>账号设置</h4>
          <div class="grade-wrap">
            <span class="grade-column"/>
            <span class="grade-column"/>
            <span class="grade-column"/>
            <span class="grade-column one"/>
            <span class="grade-column two"/>
            <span class="grade-column three"/>
          </div>
          <div class="account-safety">安全评分80分,账户存在安全风险,可进一步提升</div>
        </div>
        <div v-show="!formShow" class="account-password-warp">
          <span>
            <img :src="IMG_URL+'ad_shop/img/lock.png?v=2'" class="lock">
          </span>
          <div class="password-grade-wrap">
            <div class="grade-title">密码强度（高）</div>
            <div class="grade-info">目前您的密码强度高</div>
          </div>
          <el-button @click="modifyPassword">修改密码</el-button>
        </div>
        <!-- 修改密码 -->
        <el-form
          v-show="formShow"
          ref="passwordForm"
          :rules="rules"
          :model="passwordForm"
          status-icon
          label-position="right"
          label-width="80px"
        >
          <el-form-item label="新密码" prop="newPass">
            <el-input
              v-model="passwordForm.newPass"
              type="password"
              auto-complete="off"
              class="item-input"
            />
          </el-form-item>
          <el-form-item label="确认密码" prop="checkPass">
            <el-input
              v-model="passwordForm.checkPass"
              type="password"
              auto-complete="off"
              class="item-input"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('passwordForm')">提交</el-button>
            <el-button @click="resetForm('passwordForm')">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <!-- 等级弹出框 -->
    <el-dialog :visible.sync="gradeVisible" :fullscreen="true" title="等级特权信息">
      <el-table :data="gridData">
        <el-table-column prop="grade" label="认证等级"/>
        <el-table-column prop="place" label="授权场地数"/>
        <el-table-column prop="singleNum" label="每个场地授权押金"/>
        <el-table-column prop="sum" label="押金总金额"/>
        <el-table-column prop="hiNum" label="每月获赠嗨豆"/>
        <el-table-column prop="ad" label="线下同事投放广告数"/>
      </el-table>
    </el-dialog>
    <!-- 充值弹出框 -->
    <el-dialog :visible.sync="payVisible" :fullscreen="true" title="万达公司 (余额：1,000通用快乐币)">
      <div class="pay-content">
        <div class="pay-title">充值项目</div>
        <div class="general-pay">
          <div class="pay-item">
            <div class="hi_num">10 嗨币</div>
            <div class="money_num">¥ 10.00</div>
          </div>
          <div class="pay-item">
            <div class="hi_num">100 嗨币</div>
            <div class="money_num">¥ 100.00</div>
            <div class="pay-hot">HOT</div>
          </div>
          <div class="pay-item">
            <div class="hi_num">500 嗨币</div>
            <div class="money_num">¥ 500.00</div>
            <div class="pay-hot">HOT</div>
          </div>
          <div class="pay-item">
            <div class="hi_num">1000 嗨币</div>
            <div class="money_num">¥ 1000.00</div>
          </div>
        </div>
        <div class="pay-title">其他充值</div>
        <el-input v-model="payValue" class="item-input"/>
      </div>
      <div class="pay-method-wrap">
        <div class="pay-title">支付方式</div>
        <div class="pay-content">
          <el-tabs tab-position="left" class="tab-wrap">
            <el-tab-pane>
              <span slot="label">
                支付宝
                <img :src="IMG_URL+'ad_shop/img/alipay.png'" style="width: 20%;">
              </span>
              <div class="qr-code">
                <img :src="IMG_URL+'ad_shop/img/test.png'">
              </div>
            </el-tab-pane>
            <el-tab-pane>
              <span slot="label">
                微信
                <img :src="IMG_URL+'ad_shop/img/wechat.png'" style="width: 20%;">
              </span>
              <div class="qr-code">
                <img :src="IMG_URL+'ad_shop/img/test1.png'">
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
const IMG_URL = process.env.IMG_URL;
import customer from "service/customer";
import router from "router";
import {
  Progress,
  Button,
  Input,
  Form,
  FormItem,
  Dialog,
  Table,
  TableColumn,
  Tabs,
  TabPane
} from "element-ui";

export default {
  name: "Account",
  components: {
    "el-progress": Progress,
    "el-button": Button,
    "el-table": Table,
    "el-table-column": TableColumn,
    "el-input": Input,
    "el-form": Form,
    "el-dialog": Dialog,
    "el-form-item": FormItem,
    "el-tabs": Tabs,
    "el-tab-pane": TabPane
  },
  data() {
    let validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.passwordForm.checkPass !== "") {
          this.$refs.passwordForm.validateField("checkPass");
        }
        callback();
      }
    };
    let validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.passwordForm.newPass) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      payValue: "",
      gridData: [
        {
          grade: "1级认证",
          place: "1",
          singleNum: "2,000/蚂蚁信用",
          sum: "2,000/免费",
          hiNum: "一次性100个定向，每个场地每月10个定向",
          ad: "1"
        },
        {
          grade: "2级认证",
          place: "2-5",
          singleNum: "2,000",
          sum: "4,000-10,000",
          hiNum: "一次性200个定向，每个场地每月20个定向",
          ad: "2"
        },
        {
          grade: "3级认证",
          place: "6-10",
          singleNum: "2,000",
          sum: "12,000-20,000",
          hiNum: "一次性500个定向，每个场地每月50个定向",
          ad: "5"
        },
        {
          grade: "4级认证",
          place: "11-20",
          singleNum: "2,000",
          sum: "22,000-40,000",
          hiNum: "一次性500个定向，每个场地每月100个定向",
          ad: "10"
        },
        {
          grade: "5级认证",
          place: "20以上",
          singleNum: "2,000",
          sum: "42,000-",
          hiNum: "一次性1000个定向，每个场地每月150个定向",
          ad: "15"
        }
      ],
      payVisible: false,
      gradeVisible: false,
      setting: {
        loading: true,
        text: "拼命加载中"
      },
      formShow: false,
      passwordForm: {
        // oldPass: '',
        newPass: "",
        checkPass: ""
      },
      rules: {
        newPass: [{ validator: validatePass, trigger: "blur" }],
        checkPass: [{ validator: validatePass2, trigger: "blur" }]
        // oldPass: [{ validator: checkOldPass, trigger: 'blur' }]
      },
      IMG_URL: IMG_URL,
      company_name: "",
      name: "",
      editName: false,
      avatar: "http://image.exe666.com/1007/image/1529384439.png"
    };
  },
  created() {
    this.name = this.$store.state.curUserInfo.company.name;
    this.setting.loading = false;
  },
  methods: {
    saveCompanyName() {
      this.modifyCustomer();
    },
    modifyPassword() {
      this.formShow = true;
    },
    modifyCustomer() {
      let args = {
        name: this.company_name
      };
      customer
        .modifyCustomer(this, args)
        .then(res => {
          this.name = res.name;
          let customer = {};
          customer.name = res.name;
          localStorage.setItem("customer_info", JSON.stringify(customer));
          this.$store.commit("setCurUserInfo", customer);
          this.editName = false;
          this.$message({
            message: "修改成功",
            type: "success"
          });
        })
        .catch(err => {
          this.editName = false;
          console.log(err);
        });
    },
    submitForm(formName) {
      this.$confirm("密码修改成功,将自动跳到登录页面, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$refs[formName].validate(valid => {
            if (valid) {
              this.formShow = false;
              let args = {
                new_password: this.passwordForm.newPass,
                confirm_password: this.passwordForm.checkPass
              };
              customer
                .modifyPassword(this, args)
                .then(res => {
                  this.message({
                    message: "密码修改成功",
                    type: "success"
                  });
                })
                .catch(err => {
                  this.message({
                    message: "密码修改失败",
                    type: "error"
                  });
                  console.log(err);
                });
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消修改密码"
          });
        });
    },
    resetForm(formName) {
      this.formShow = false;
      this.$refs[formName].resetFields();
    }
  }
};
</script>
<style scoped lang="less">
.root {
  // padding: 10px;
  font-size: 14px;
  color: #5e6d82;
  .account-wrap {
    background: #fff;
    padding: 30px;
    .item-input {
      width: 250px;
    }
    .account-details {
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      .account-avatar {
        width: 200px;
        .avatar {
          width: 100%;
        }
      }
      .account-content {
        margin: 15px 0;
        .account-item {
          margin: 15px;
          color: #444;
          font-size: 18px;
          .account-item-title {
            color: #9c9fa2;
            font-size: 14px;
            margin-bottom: 10px;
          }
          .account-item-content {
            color: #444;
            font-size: 16px;
          }
          .icon-edit {
            color: #20a0ff;
            cursor: pointer;
            font-size: 16px;
            font-weight: 600;
          }
        }
        .grade {
          .grade_1 {
            width: 6%;
          }
          .grade_name {
            color: #20a0ff;
          }
          .grade-line {
            width: 250px;
            height: 4px;
            display: inline-block;
            background: #ededed;
            position: relative;
            .grade-line-done {
              position: absolute;
              width: 80%;
              height: 4px;
              display: inline-block;
              background: #20a0ff;
            }
          }
          .grade_text {
            color: #1988cb;
            font-size: 13px;
            cursor: pointer;
            margin-left: 10px;
          }
        }
        .money {
          .grade_3 {
            width: 6%;
          }
          .money-text {
            // margin-left: 15px;
            margin-right: 15px;
          }
          .money-number {
            margin-left: 10px;
            margin-right: 15px;
            color: #f56c6c;
          }
          .hi_icon {
            width: 6%;
          }
        }
      }
    }
    .account-password {
      margin-top: 20px;
      .account-title {
        display: flex;
        flex-direction: row;
        margin-left: 15px;
        align-items: center;
        margin-bottom: 30px;
        h4 {
          font-weight: 600;
          margin: 0;
          font-size: 16px;
        }
        .grade-wrap {
          margin-left: 10px;
          margin-top: 6px;
          position: relative;
          .grade-column {
            height: 14px;
            width: 7px;
            background: #ccc;
            display: inline-block;
            border-radius: 20px;
          }
          .one {
            position: absolute;
            height: 14px;
            width: 7px;
            background: #e6a23c;
            display: inline-block;
            left: 0;
            top: 0;
            border-radius: 20px;
          }
          .two {
            position: absolute;
            height: 14px;
            width: 7px;
            background: #e6a23c;
            display: inline-block;
            left: 11px;
            top: 0;
            border-radius: 20px;
          }
          .three {
            position: absolute;
            height: 14px;
            width: 7px;
            background: #e6a23c;
            display: inline-block;
            right: 0;
            top: 0;
            border-radius: 20px;
          }
        }
        .account-safety {
          color: #f56c6c;
          font-size: 13px;
          line-height: 1.08;
          margin-left: 15px;
        }
      }
      .account-password-warp {
        display: flex;
        flex-direction: row;
        margin-left: 15px;
        align-items: center;
        margin-bottom: 15px;
        .lock {
          width: 61%;
        }
        .password-grade-wrap {
          margin-right: 226px;
          .grade-title {
            font-weight: 600;
            font-size: 16px;
            color: #222;
            margin-bottom: 10px;
          }
          .grade-info {
            font-size: 14px;
            color: #95a7b7;
          }
        }
      }
    }
  }
  .pay-content {
    .item-input {
      width: 250px;
    }
    .pay-title {
      font-size: 16px;
      color: #444;
      font-weight: 600;
      margin-bottom: 20px;
    }
    .general-pay {
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      margin-bottom: 15px;
      .pay-item {
        border: 1px solid #c0ccda;
        border-radius: 4px;
        background: #fff;
        padding: 10px 30px;
        text-align: center;
        cursor: pointer;
        margin-right: 20px;
        position: relative;
        .pay-hot {
          width: 29px;
          height: 14px;
          background-color: #ff7a7a;
          color: #fff;
          font-size: 10px;
          line-height: 14px;
          text-align: center;
          position: absolute;
          right: -1px;
          top: -1px;
          border-top-right-radius: 5px;
        }
        .hi_num {
          font-size: 18px;
          color: #f56c6c;
          margin-bottom: 5px;
        }
        .money_num {
          color: #c0ccda;
          font-size: 14px;
        }
      }
    }
  }
  .pay-method-wrap {
    margin-top: 15px;
    .pay-title {
      font-size: 16px;
      color: #444;
      font-weight: 600;
      margin-bottom: 20px;
    }
    .pay-content {
      height: 245px;
      border: 1px solid #c0ccda;
      border-radius: 4px;
      padding: 10px;
      .tab-wrap {
        height: 100%;
        .qr-code {
          text-align: center;
          img {
            width: 22%;
          }
        }
      }
    }
  }
}
</style>

