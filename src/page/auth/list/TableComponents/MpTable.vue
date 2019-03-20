<template>
  <div class="mp-table">
    <div class="mp-table-header">
      <div class="step">步骤</div>
      <div class="action">行动</div>
      <div class="download-btn">
        <div class="download-desc">下载小程序SDK V1.1</div>
        <img class="download-icon" :src="IMG_URL + 'ad_shop/img/auth/mp_sdk.png'">
      </div>
    </div>
    <div class="mp-table-content">
      <div class="mp-table-row">
        <div class="step bold">第1步</div>
        <div class="action">
          <a href="https://mp.weixin.qq.com/" target="_blank">进入微信公众平台https://mp.weixin.qq.com/</a>
        </div>
      </div>
      <div class="mp-table-row">
        <div class="step bold">第2步</div>
        <div class="action">
          <div>登陆小程序账号，点击<span class="purple">"设置"</span></div>
          <a href="http://image.exe666.com/1007/image/499_new_apps1.jpg" target="_blank">
            <img src="http://image.exe666.com/1007/image/499_new_apps1.jpg" style="width: 160px">
          </a>
        </div>
      </div>
      <div class="mp-table-row">
        <div class="step bold">第3步</div>
        <div class="action">
          <div>点击<span class="purple">"开发设置"</span></div>
          <a href="http://image.exe666.com/1007/image/946_new_apps2.jpg" target="_blank">
            <img src="http://image.exe666.com/1007/image/946_new_apps2.jpg" style="width: 200px">
          </a>
        </div>
      </div>
      <div class="mp-table-row">
        <div class="step bold">第4步</div>
        <div class="action">
          <div>点击 <span class="purple">"服务器域名"</span> 条目下的 <span class="purple">"修改"</span></div>
        </div>
      </div>
      <div class="mp-table-row">
        <div class="step bold">第5步</div>
        <div class="action">
          <div>通过管理员身份验证之后，填入request合法域名：<span class="purple">https://exelook.com</span></div>
          <a href="http://image.exe666.com/1007/image/122_new_apps4.jpg" target="_blank">
            <img src="http://image.exe666.com/1007/image/122_new_apps4.jpg" style="width: 380px">
          </a>
        </div>
      </div>
    </div>
    <div class="mp-table-content">
      <div class="mp-table-row">
        <div class="step bold">业务代码</div>
        <div class="action">
          <div>在小程序启动页面代码中的<span class="purple">'onLoad'</span>生命周期中，<br/>调用 <span class="purple">getXingPhoto(preview)</span>方法，<br/>调用微信登陆获取code，然后使用code换取openid，<br/>最后将sence和openid去换取照片信息。</div>
          <div class="tips">preview: 是否直接展示照片, true 即直接展示；<br/>如不展示，可在request success回调中获得图片url。 </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "MpTable",
  data () {
    return {
      IMG_URL: process.env.IMG_URL
    }
  }
}
</script>

<style lang="less" scoped>
.mp-table {
  width: 100%;
  background: #F4F7F9;
  border: 1px solid #EBEEF5;
  border-right: none;
  border-bottom: none;
  .purple {
    color: #9438E6;
  }
  .mp-table-header {
    width: 100%;
    display: flex;
    line-height: 50px;
    background: #956FD4;
    color: #FFF;
    position: relative;
    .step, .action {
      padding-top: 0;
      padding-bottom: 0;
    }
    .download-btn {
      position: absolute;
      top: 0;
      right: 0;
      width: 220px;
      height: 50px;
      color: #FFF;
      background: #00CFAD;
      display: flex;
      align-items: center;
      padding-left: 22px;
      cursor: pointer;
      .download-desc {
        margin-right: 10px;
      }
      .download-icon {
        display: block;
        width: 28px;
        height: 28px;
      }
    }
  }
  .mp-table-content {
    margin-bottom: 10px;
    background: #FFF;
    .mp-table-row {
      display: flex;
      align-items: flex-start;
      border-bottom: 1px solid #FAF9FA;
      &:last-child {
        align-items: center;
      }
    }
    &:last-child {
      .action::before {
        content: " ";
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        border-left: 1px solid #FAF9FA;
      }
    }
  }
  .step {
    padding: 20px 0 0 20px;
    width: 110px;
    &.bold {
      color: #000;
      font-weight: bold;
    }
  }
  .action {
    padding: 20px;
    flex: 1;
    position: relative;
    a {
      color: #5e6d82;
      display: block;
    }
    img {
      display: block;
      margin-top: 12px;
    }
    .tips {
      margin-top: 35px;
      font-size: 10px;
    }
  }
}
</style>