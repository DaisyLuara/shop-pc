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
        <div class="account-content">
          <div v-show="!editName" class="account-item">
            <div class="account-item-title">公司名称</div>
            <div class="account-item-content">
              <label class="icon-v1">
                <img :src="IMG_URL+'ad_shop/img/account/v1.png'">
              </label>
              <div class="text">{{ name }}</div>
            </div>
          </div>
          <div v-show="editName" class="account-item">
            <div class="account-item-title">公司名称：</div>
            <el-input v-model="company_name" class="item-input"/>
            <el-button
              type="primary"
              size="mini"
              class="el-button-success"
              @click="saveCompanyName"
            >保存</el-button>
          </div>
          <!-- <div class="account-item">
            <div class="account-item-title">认证等级</div>
            <div class="account-item-content">
              <label class="icon-v1">
                <img :src="IMG_URL+'ad_shop/img/account/v3.png'">
              </label>
              <div class="text">LV.1</div>
            </div>
            <div class="block">
              <el-slider
                v-model="gradeValue"
                :max="gradeMax"
                :min="gradeMin"
                disabled
                class="line-grade"
              ></el-slider>
              <div class="grade-num">
                <span class="num-start">{{gradeMin}}</span>
                <span class="num-now">{{gradeValue}}</span>
                <span class="num-end">{{gradeMax}}</span>
              </div>
            </div>
          </div>-->
        </div>
      </div>
      <!-- 账号密码设置 -->
      <div class="account-password">
        <div class="account-title">
          <h4>账号设置</h4>
          <div class="grade-wrap">
            <svg class="svg-gradient">
              <defs>
                <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" style="stop-color:rgb(3,184,203);stop-opacity:1"></stop>
                  <stop offset="100%" style="stop-color:rgb(190,255,63);stop-opacity:1"></stop>
                </linearGradient>
              </defs>
            </svg>
            <el-progress
              :width="60"
              :percentage="78"
              :show-text="false"
              type="circle"
              color="url(#grad1)"
              class="grade-progress"
            />
            <span class="score">78</span>
            <div class="tips">
              账户存在安全风险
              <br>建议提升密码等级
            </div>
          </div>
        </div>
        <div class="account-internal">
          <div class="account-item-content">
            <label class="icon-v1">
              <img :src="IMG_URL+'ad_shop/img/account/v1.png'">
            </label>
            <div class="text">{{internal_name}}</div>
          </div>
        </div>
        <div v-show="!formShow" class="account-password-warp">
          <div class="account-item-content">
            <label class="icon-v1">
              <img :src="IMG_URL+'ad_shop/img/account/v4.png'">
            </label>
            <div class="text">
              修改密码
              <a class="icon-v2" @click="modifyPassword">
                <img :src="IMG_URL+'ad_shop/img/account/v2.png'">
              </a>
            </div>
          </div>
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
            <el-button
              type="primary"
              class="el-button-success"
              @click="submitForm('passwordForm')"
            >提交</el-button>
            <el-button class="el-button-cancel" @click="resetForm('passwordForm')">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
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
  TabPane,
  Slider
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
    "el-tab-pane": TabPane,
    "el-slider": Slider
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
      gradeValue: 267,
      gradeMin: 0,
      gradeMax: 300,
      payVisible: false,
      gradeVisible: false,
      setting: {
        loading: true,
        text: "拼命加载中"
      },
      formShow: false,
      passwordForm: {
        newPass: "",
        checkPass: ""
      },
      rules: {
        newPass: [{ validator: validatePass, trigger: "blur" }],
        checkPass: [{ validator: validatePass2, trigger: "blur" }]
      },
      IMG_URL: IMG_URL,
      company_name: "",
      name: "",
      internal_name: "",
      editName: false
    };
  },
  created() {
    this.setting.loading = false;
    this.name = this.$store.state.curUserInfo.company.name;
    this.internal_name = this.$store.state.curUserInfo.company.internal_name;
  },
  mounted() {
    // let now_num = document.querySelector(".num-now");
    // if ((this.gradeValue > 0) & (this.gradeValue < 300)) {
    //   now_num.style.left = (this.gradeValue / this.gradeMax) * 100 + "%";
    //   now_num.style.opacity = "1";
    // }
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
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$confirm("密码修改成功,将自动跳到登录页面, 是否继续?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          })
            .then(() => {
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
            })
            .catch(() => {
              this.$message({
                type: "info",
                message: "取消修改密码"
              });
            });
        }
      });
    },
    resetForm(formName) {
      this.formShow = false;
      this.$refs[formName].resetFields();
    }
  }
};
</script>
<style lang="less">
.line-grade {
  .disabled {
    height: 10px !important;
  }
  .el-slider__bar {
    height: 10px !important;
    background: -webkit-linear-gradient(
      left,
      #03b8cb,
      #beff3f
    ); /* Safari 5.1 - 6.0 */
    background: -o-linear-gradient(
      right,
      #03b8cb,
      #beff3f
    ); /* Opera 11.1 - 12.0 */
    background: -moz-linear-gradient(
      right,
      #03b8cb,
      #beff3f
    ); /* Firefox 3.6 - 15 */
    background: linear-gradient(
      to right,
      #03b8cb,
      #beff3f
    ); /* 标准的语法（必须放在最后） */
  }
  .el-slider__button {
    width: 20px;
    height: 20px;
    border: none !important;
    background: -webkit-linear-gradient(
      left,
      #beff3f,
      #03b8cb
    ); /* Safari 5.1 - 6.0 */
    background: -o-linear-gradient(
      right,
      #beff3f,
      #03b8cb
    ); /* Opera 11.1 - 12.0 */
    background: -moz-linear-gradient(
      right,
      #beff3f,
      #03b8cb
    ); /* Firefox 3.6 - 15 */
    background: linear-gradient(
      to right,
      #beff3f,
      #03b8cb
    ); /* 标准的语法（必须放在最后） */
  }
}
</style>
<style scoped lang="less">
.root {
  font-size: 14px;
  color: #7f58cd;
  .account-wrap {
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
          margin: 0px 15px 50px 15px;
          color: #444;
          font-size: 18px;
          .account-item-title {
            color: #7f58cd;
            font-size: 16px;
            font-weight: 600;
            margin-bottom: 10px;
          }
          .account-item-content {
            position: relative;
            font-size: 0;
            padding: 0;
            margin: 0;
            line-height: 40px;
            overflow-y: hidden;
            background-color: #fff;
          }
          .text {
            width: 300px;
            position: relative;
            display: inline-block;
            height: 40px;
            line-height: 40px;
            text-align: left;
            margin: 0;
            color: #444;
            font-size: 14px;
            float: left;
            padding-left: 15px;
          }
          .icon-v1 {
            display: inline-block;
            position: relative;
            background-color: #7f58cd;
            width: 30px;
            overflow: hidden;
            height: 40px;
            text-align: center;
            float: left;
            img {
              width: 45%;
              margin: 0 auto;
            }
          }
          .icon-v2 {
            position: relative;
            overflow: hidden;
            text-align: center;
            display: inline-block;
            width: 30px;
            height: 30px;
            background-color: #f2f2f2;
            border-radius: 50%;
            float: right;
            margin-top: 5px;
            margin-right: 2%;
            cursor: pointer;
            & > img {
              width: 50%;
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
            }
          }
          .block {
            .grade-num {
              width: 100%;
              height: 15px;
              position: relative;
              font-size: 10px;
              color: #05c89c;
              margin-top: -8px;
              .num-start {
                position: absolute;
                top: 0%;
                left: 0%;
                transform: translateX(-50%);
              }
              .num-now {
                position: absolute;
                top: 0%;
                opacity: 0;
                color: #03c89a;
                font-weight: 700;
                transform: translateX(-50%);
              }
              .num-end {
                position: absolute;
                top: 0%;
                right: 0%;
                transform: translateX(50%);
              }
            }
          }
        }
      }
    }
    .account-password {
      margin-top: -10px;
      .account-title {
        margin-left: 15px;
        margin-bottom: 15px;
        h4 {
          font-weight: 600;
          margin: 0;
          font-size: 16px;
        }
        .grade-wrap {
          display: inline-block;
          position: relative;
          margin-top: 10px;
          .svg-gradient {
            position: absolute;
            top: 0;
            left: 0;
            z-index: 0;
            opacity: 0;
          }
          .score {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 99;
            font-size: 28px;
            color: #05c99b;
          }
          .tips {
            width: 96px;
            line-break: normal;
            position: absolute;
            top: 50%;
            right: -175%;
            transform: translateY(-50%);
            font-size: 10px;
            line-height: 16px;
            color: #929395;
          }
        }
        .account-safety {
          color: #f56c6c;
          font-size: 13px;
          line-height: 1.08;
          margin-left: 15px;
        }
      }
      .account-internal {
        margin-bottom: 15px;
      }
      .account-password-warp,
      .account-internal {
        .account-item-content {
          display: inline-block;
          position: relative;
          line-height: 40px;
          overflow-y: hidden;
          background-color: #fff;
          margin-left: 15px;
        }
        .text {
          width: 300px;
          position: relative;
          display: inline-block;
          height: 40px;
          line-height: 40px;
          text-align: left;
          margin: 0;
          color: #444;
          font-size: 14px;
          float: left;
          padding-left: 15px;
        }
        .icon-v1 {
          display: inline-block;
          position: relative;
          background-color: #7f58cd;
          width: 30px;
          overflow: hidden;
          height: 40px;
          text-align: center;
          float: left;
          img {
            width: 45%;
            margin: 0 auto;
          }
        }
        .icon-v2 {
          position: relative;
          overflow: hidden;
          text-align: center;
          display: inline-block;
          width: 30px;
          height: 30px;
          background-color: #f2f2f2;
          border-radius: 50%;
          float: right;
          margin-top: 5px;
          margin-right: 2%;
          cursor: pointer;
          & > img {
            width: 50%;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
          }
        }
      }
    }
  }
}
</style>

