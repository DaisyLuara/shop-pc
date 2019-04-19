<template>
  <div class="about-container">
    <div class="about-header">
      <img
        :src="IMG_URL + 'ad_guide/about_bg1.jpg'"
        class="bg"
      >
      <div class="tit-text">
        <p class="big-tit">关于我们</p>
        <p class="small-tit">一起创造未来</p>
      </div>
    </div>
    <div class="introduce">
      <el-container>
        <el-aside width="300px">星视度介绍</el-aside>
        <el-main>
          <p class="text">上海星视度科技有限公司脱胎于上海动景集团，总部位于上海市浦东陆家嘴。始创于2009年专注于视觉图像识别的视度科技公司，是“线下场景数字化与体验营销”行业的开创者和塑造者。</p>
          <p class="text">星视度是“AiFitAr”操作系统+“镜像视界”的场景化平台，旨在让简单的数据更鲜活•让人性的交流更温暖•让商业的体验更智能。</p>
          <p class="text">短短3年时间，星视度公司所研发的智能体验屏已经完成了3次产品迭代，以智慧商业终端的形式入驻上海乃至全国各大顶级购物中心。借助丰富的交互体验、新潮的节目创意、精细的营销方案、强大的运营平台，星视度的智能体验产品已经成为商业项目智慧化升级的首选方案。并在新客招揽、用户留存、行为分析、画像描绘等方面，为客户提供了无可取代的现实作用和商业价值。</p>
        </el-main>
      </el-container>
    </div>
    <div class="stone-step">
      <el-container>
        <el-aside width="300px">星视度里程碑</el-aside>
        <el-main>
          <!-- <div style="height: 300px;">
            <el-steps
              direction="vertical"
              :active="1"
            >
              <el-step
                icon="el-icon-circle2"
                class="step1"
                title="2019年"
                description="召唤宝商户平台上线 "
              ></el-step>
              <el-step
                icon="el-icon-circle1"
                class="step2"
                title="2018年"
                description="成为阿里新零售·2018天猫双十一·智能体验首席供应商 "
              >
              </el-step>
              <el-step
                icon="el-icon-circle2"
                class="step3"
                title="2009年"
                description="Actiview星视度科技有限公司创立"
              ></el-step>
            </el-steps>
          </div> -->
          <el-timeline
            style="min-height:360px;"
            class="steps"
          >
            <el-timeline-item
              v-for="(activity, index) in activities"
              :key="index"
              :icon="activity.icon"
              :type="activity.type"
              :color="activity.color"
              :size="activity.size"
              :timestamp="activity.timestamp"
              :hide-timestamp="true"
              :class="activity.class"
            >
              <p class="text1">{{activity.timestamp}}</p>
              <p class="text2">{{activity.content}}</p>
            </el-timeline-item>
          </el-timeline>
        </el-main>
      </el-container>
    </div>
  </div>
</template>
<script>
const IMG_URL = process.env.IMG_URL;
import { Container, Header, Main, Aside, Timeline, TimelineItem } from "element-ui";
export default {
  name: "Home",
  components: {
    "el-container": Container,
    "el-header": Header,
    "el-main": Main,
    "el-aside": Aside,
    "el-timeline": Timeline,
    "el-timeline-item": TimelineItem,
  },
  data() {
    return {
      IMG_URL: IMG_URL,
      activities: [{
        content: '召唤宝商户平台上线',
        timestamp: '2019年',
        size: 'large',
        icon: 'el-icon-bigger',
        color: '#fff',
        class: 'big'
      },
      {
        content: '成为阿里新零售·2018天猫双十一·智能体验首席供应商',
        timestamp: '2018年',
        icon: 'el-icon-small',
        color: '#fff',
        class: 'small'
      },
      {
        content: 'Actiview星视度科技有限公司创立',
        timestamp: '2009年',
        size: 'large',
        icon: 'el-icon-bigger',
        color: '#fff',
        class: 'big'
      }]
    };
  },
  mounted() {
  }
};
</script>
<style lang="less">
@img: "http://cdn.xingstation.cn/ad_guide/";
.bg {
  width: 100%;
  position: relative;
  z-index: 0;
}
.about-container {
  width: 100%;
  position: relative;
  z-index: 0;
  .about-header {
    width: 100%;
    position: relative;
    .tit-text {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: 5;
      .big-tit {
        color: #fff;
        font-size: 28px;
        margin: 5px auto;
        font-weight: 900;
        text-align: center;
      }
      .small-tit {
        color: #fff;
        font-size: 16px;
        text-align: center;
      }
    }
  }
  .el-container {
    text-align: left;
    padding-top: 35px;
    padding-bottom: 15px;
  }
  .el-aside {
    display: flex;
    flex-direction: column;
    justify-content: top;
    align-items: right;
    text-align: left;
    font-size: 26px;
    color: #333;
    padding-left: 100px;
  }

  .introduce,
  .stone-step {
    position: relative;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 60px 0px;
  }

  .introduce {
    background-color: #fff;
    padding-top: 10px;
    padding-bottom: 15px;
    .el-aside {
      color: #000;
    }
    .el-main {
      width: 850px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: left;
      text-align: left;
      padding: 0;
      p {
        text-align: left;
      }
    }
  }

  .stone-step {
    background-image: url("@{img}about_bg2.jpg");
    background-position: center top;
    background-size: 100% auto;
    background-repeat: no-repeat;
    .el-container {
      color: #fff;
      margin-bottom: -20px;
      padding-top: 20px;
    }
    .el-aside {
      color: #fff;
    }
    .el-main {
      width: 850px;
      padding-left: 20px;
      padding-top: 12px;
    }
    .steps {
      .big {
        height: 100px;
        .el-timeline-item__tail {
          height: 90px;
          margin-top: 24px;
        }
      }
      .small {
        height: 100px;
        margin-bottom: 20px;
        margin-top: 23px;
        .el-timeline-item__tail {
          height: 90px;
          margin-top: 21px;
        }
      }
      .el-timeline-item__wrapper {
        padding-left: 50px;
        top: -8px;
      }
      .el-icon-small {
        &:before {
          display: inline-block;
          content: " ";
          width: 20px;
          height: 20px;
          background: url("@{img}point.png") center center/80% auto no-repeat;
        }
      }
      .el-icon-bigger {
        &:before {
          display: inline-block;
          content: " ";
          width: 35px;
          height: 35px;
          background: url("@{img}c2.png") center center/100% auto no-repeat;
        }
      }
      .text1 {
        color: #fff;
        font-size: 22px;
        margin-bottom: 5px;
        padding-left: 12px;
      }
      .text2 {
        color: #fff;
        position: relative;
        font-size: 18px;
        font-weight: 400;
        padding-left: 16px;
        &:before {
          content: "";
          width: 5px;
          height: 5px;
          background: url("@{img}c1.png") center center/100% auto no-repeat;
          position: absolute;
          top: 32%;
          left: 0%;
        }
      }
    }
  }

  .text {
    width: 80%;
    text-align: left;
    font-size: 16px;
    line-height: 30px;
    margin-top: 0px;
    margin-bottom: 15px;
    color: 333;
  }
}
</style>
