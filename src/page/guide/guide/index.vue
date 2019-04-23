<template>
  <div class="guide-index">
    <div class="head">
      <img
        :src="IMG_URL + 'ad_guide/index_back.jpg?000'"
        class="bg"
      >
      <div class="main-head">
        <p class="text1">让营销变得有效</p>
        <p class="text1">让盈效持久长效</p>
        <p class="text2">一站式召唤屏数字化服务集成平台</p>
        <div class="input-mobile">
          <input
            type="text"
            v-model="mobile"
            maxlength="11"
            placeholder="输入手机号码"
            @change="checkPhone"
            class="mobile"
          >
          <button
            class="sample"
            @click="submit"
          >免费体验</button>
        </div>
      </div>

    </div>
    <div class="advantages">
      <h2>为你加持智能商业时代的所有技能</h2>
      <h4>营销运营从未如此轻松有效</h4>
      <el-row :gutter="20">
        <el-col
          :span="6"
          v-for="item in iconList"
          :key="item.id"
        >
          <div class="advantage">
            <img
              :src="item.src"
              class="ad-icon"
            >
            <p class="p1">{{item.text1}}</p>
            <p class="p2">{{item.text2}}</p>
          </div>
        </el-col>
      </el-row>
    </div>
    <!-- swiper -->
    <div class="partners">
      <div class="group1">
        <h2>值得信赖的智能商业合作伙伴</h2>
        <h4>营收效果从未如此持久长效</h4>
        <swiper
          ref="mySwiper1"
          :options="swiperOption1"
          class="swiper1"
        >
          <swiper-slide
            v-for="item in partnerList.detail"
            :key="item.id"
            class="slide-item"
          >
            <img :src="item">
          </swiper-slide>
          <div
            class="swiper-button-next"
            slot="button-next"
          ></div>
          <div
            class="swiper-button-prev"
            slot="button-prev"
          ></div>
        </swiper>
      </div>
      <swiper
        ref="mySwiper2"
        :options="swiperOption2"
        class="swiper2"
      >
        <swiper-slide
          v-for="item in partnerList.logo"
          :key="item.id"
          class="slide-item"
        >
          <img :src="item">
        </swiper-slide>
      </swiper>
    </div>
    <div class="head">
      <img
        :src="IMG_URL + 'ad_guide/indextit.jpg'"
        class="bg"
      >
      <div class="text-head">
        立刻开始探索智能商业时代模式
      </div>
    </div>
    <div class="show-login">
      <div class="com">
        <div class="tips">
          就在加入<br>
          即可免费获得<br>
          实况全功能体验
        </div>
        <div class="login-form">
          <input
            type="text"
            v-model="mobile"
            maxlength="11"
            placeholder="输入手机号码"
            @change="checkPhone"
            class="mobile"
          >
          <button
            class="submit"
            @click="submit"
          >免费开始体验</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
const IMG_URL = process.env.IMG_URL;
import validate from '@/utils/validate.js'
import guide from 'service/guide'
import { swiper, swiperSlide } from "vue-awesome-swiper";
import "swiper/dist/css/swiper.css";
import { Row, Col, Message } from "element-ui";
export default {
  components: {
    swiper,
    swiperSlide,
    "el-row": Row,
    "el-col": Col
  },
  data() {
    return {
      IMG_URL: IMG_URL,
      mobile: null,
      iconList: [
        {
          text1: '随时随地用',
          text2: '全平台无缝运营',
          src: IMG_URL + 'ad_guide/icon_V1_27.png'
        },
        {
          text1: '全民通行证',
          text2: '全方位账号打通',
          src: IMG_URL + 'ad_guide/icon_V1_30.png'
        },
        {
          text1: '自己当导演',
          text2: '便捷的节目定制',
          src: IMG_URL + 'ad_guide/icon_V1_24.png'
        },
        {
          text1: '自己管发行',
          text2: '一站式线下投放',
          src: IMG_URL + 'ad_guide/icon_V1_22.png'
        },
        {
          text1: '自己送福利',
          text2: '奖品券随心运营',
          src: IMG_URL + 'ad_guide/icon_V1_41.png'
        },
        {
          text1: '自己聚人气',
          text2: 'SaaS全会员服务',
          src: IMG_URL + 'ad_guide/icon_V1_43.png'
        },
        {
          text1: '自己开天眼',
          text2: '多维可视化数据',
          src: IMG_URL + 'ad_guide/icon_V1_46.png'
        },
        {
          text1: '自己控运维',
          text2: '实时化设备监控',
          src: IMG_URL + 'ad_guide/icon_V1_49.png'
        }
      ],
      swiperOption1: {
        slideToClickedSlide: true,
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev'
        }
      },
      swiperOption2: {
        spaceBetween: 20,
        centeredSlides: true,
        freeMode: true,
        slidesPerView: 'auto',
        autoplay: true,
        loop: true,
        slideToClickedSlide: true
      },
      partnerList: {
        logo: [
          IMG_URL + 'ad_guide/logo/001.jpg',
          IMG_URL + 'ad_guide/logo/002.jpg',
          IMG_URL + 'ad_guide/logo/003.jpg',
          IMG_URL + 'ad_guide/logo/004.jpg',
          IMG_URL + 'ad_guide/logo/005.jpg',
          IMG_URL + 'ad_guide/logo/006.jpg',
          IMG_URL + 'ad_guide/logo/007.jpg',
          IMG_URL + 'ad_guide/logo/008.jpg',
          IMG_URL + 'ad_guide/logo/009.jpg',
          IMG_URL + 'ad_guide/logo/010.jpg',
          IMG_URL + 'ad_guide/logo/011.jpg',
          IMG_URL + 'ad_guide/logo/012.jpg',
          IMG_URL + 'ad_guide/logo/014.jpg'
        ],
        detail: [
          IMG_URL + 'ad_guide/ptest1.png',
          IMG_URL + 'ad_guide/ptest2.png',
          IMG_URL + 'ad_guide/ptest3.png',
          IMG_URL + 'ad_guide/ptest4.png',
          IMG_URL + 'ad_guide/ptest1.png',
          IMG_URL + 'ad_guide/ptest1.png',
          IMG_URL + 'ad_guide/ptest1.png',
          IMG_URL + 'ad_guide/ptest1.png',
          IMG_URL + 'ad_guide/ptest1.png',
          IMG_URL + 'ad_guide/ptest1.png',
          IMG_URL + 'ad_guide/ptest1.png',
          IMG_URL + 'ad_guide/ptest1.png'
        ]
      }
    };
  },
  mounted() {
    // this.$refs.mySwiper1.swiper.controller.control = this.$refs.mySwiper2.swiper
    // this.$refs.mySwiper2.swiper.controller.control = this.$refs.mySwiper1.swiper
  },
  methods: {
    checkPhone() {
      let res = validate.account(this.mobile)
      if (res.validate) {
        return
      } else {
        this.$message.error(res.errorText)
      }
    },
    submit() {
      if (!this.mobile) {
        this.$message.error('请输入手机号码')
        return
      }
      if (!(validate.account(this.mobile)).validate) {
        this.$message.error(res.errorText)
        return
      }
      let args = {
        mobile: this.mobile
      }
      guide.getMobile(this, args).then(res => {
        if (res.need_register) {
          this.$router.push({
            path: '/guide/login',
            query: { mobile: this.mobile }
          })
          return
        }
        this.$message('你已注册过');
        this.$router.push({
          path: '/login',
        })
      }).catch(err => {
        this.$message.error(err.response.data.message)
      })
    }
  }

};
</script>
<style lang="less">
@img: "http://cdn.xingstation.cn/ad_guide/";
a {
  cursor: pointer;
}
button {
  cursor: pointer;
}
p {
  padding: 0;
  margin: 0;
}
.bg {
  width: 100%;
  position: relative;
}
.guide-index {
  width: 100%;
  overflow-x: hidden;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  h2 {
    color: #333;
    font-size: 32px;
    font-weight: bold;
  }
  h4 {
    font-size: 18px;
    color: #333;
    font-weight: 600;
    margin-top: 10px;
  }
  .head {
    width: 100%;
    position: relative;
    .main-head {
      width: 260px;
      display: inline-block;
      position: absolute;
      top: 50%;
      left: 15%;
      transform: translateY(-50%);
      z-index: 9;
      .text1 {
        font-size: 36px;
        color: #fff;
        margin-bottom: 5px;
      }
      .text2 {
        font-size: 16px;
        color: #fff;
      }
    }
    .text-head {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: 9;
      text-align: center;
      font-size: 36px;
      color: #fff;
    }
    .input-mobile {
      width: 100%;
      position: relative;
      margin-top: 20px;
      &:before {
        content: "";
        width: 159px;
        height: 28px;
        border-radius: 15px;
        position: absolute;
        top: 0%;
        left: 0%;
        z-index: 0;
        background: linear-gradient(0deg, #6775eb, #af66cb);
        background: -webkit-linear-gradient(0deg, #6775eb, #af66cb);
      }
      input {
        width: 155px;
        height: 24px;
        line-height: 24px;
        border-radius: 15px;
        border: none;
        position: relative;
        z-index: 99;
        padding-left: 10px;
        margin-left: 2px;
        margin-top: 2px;
        font-size: 12px;
        color: #666;
        margin-right: 6px;
      }
      button {
        width: 90px;
        height: 24px;
        padding: 0;
        line-height: 24px;
        border-radius: 15px;
        font-size: 12px;
        color: #fff;
        border: none;
        background: -webkit-linear-gradient(0deg, #007cce, #00d2d0, #00f6d2);
      }
    }
  }
  .advantages {
    width: 660px;
    text-align: center;
    margin: 0 auto;
    position: relative;
    margin-bottom: 20px;
    padding-top: 40px;
    .advantage {
      text-align: center;
      width: 150px;
      height: 150px;
      border: solid 1px #fbfbfb;
      box-shadow: 0px 0px 5px #aaa;
      padding-top: 25px;
      margin-top: 30px;
      margin-bottom: 15px;
      .ad-icon {
        width: 35px;
        display: block;
        margin: 0 auto;
        margin-bottom: 28px;
      }
      .p1 {
        color: #000;
        font-weight: bold;
        font-size: 16px;
        padding: 3px 0px;
        text-align: center;
      }
      .p2 {
        color: #532bb1;
        font-size: 16px;
        font-weight: bold;
        text-align: center;
        padding: 2px 0px;
      }
    }
  }
  .partners {
    width: 100%;
    position: relative;
    text-align: center;
    .group1 {
      position: relative;
      width: 100%;
      background-color: #f4f5f7;
      text-align: center;
      padding-top: 40px;
      margin: 0 auto;
      padding-bottom: 20px;
    }
    .swiper1 {
      width: 1000px;
      padding: 30px 0px;
      .slide-item {
        width: 100%;
        text-align: center;
        padding: 0px 50px;
        img {
          margin: 0 auto;
          max-width: 100%;
        }
      }
      .swiper-button-prev {
        background-image: url("@{img}prev.png");
        width: 26px;
        height: 81px;
        background-size: 100% auto;
      }
      .swiper-button-next {
        background-image: url("@{img}next.png");
        width: 26px;
        height: 81px;
        background-size: 100% auto;
      }
    }
    .swiper2 {
      width: 100%;
      padding-top: 10px;
      padding-bottom: 10px;
      margin-top: 30px;
      margin-bottom: 30px;
      .slide-item {
        width: 120px !important;
        text-align: center;
        border: solid 1px #fbfbfb;
        box-shadow: 0px 0px 5px #aaa;
        img {
          width: 100%;
        }
      }
    }
  }
  .show-login {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: #f4f5f7;
    padding: 50px 0px;
    .com {
      width: 350px;
      border-radius: 15px;
      // background: linear-gradient(0deg, #007cce, #00d2d0, #00f6d2);
      // background: -webkit-linear-gradient(0deg, #007cce, #00d2d0, #00f6d2);
      background-image: url("@{img}icon_V1_75.png");
      background-position: center top;
      background-size: 100% auto;
      background-repeat: no-repeat;
      padding: 20px;
      .tips {
        color: #fafafa;
        font-size: 30px;
        font-weight: 400;
      }
      .login-form {
        display: block;
        text-align: center;
        width: 80%;
        margin: 0 auto;
        margin-top: 25px;
        margin-bottom: 10px;
        input {
          border: none;
          background-color: #fff;
          width: 100%;
          margin: 10px auto;
          text-align: center;
          color: #333;
          font-size: 12px;
          padding: 8px 12px;
        }
        button {
          border: none;
          width: 100%;
          color: #fff;
          text-align: center;
          font-size: 12px;
          padding: 8px 12px;
          background: linear-gradient(0deg, #6775eb, #af66cb);
          background: -webkit-linear-gradient(0deg, #6775eb, #af66cb);
        }
      }
    }
  }
}
</style>
