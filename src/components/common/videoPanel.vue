<template>
  <div class="video-panel">
    <el-dialog 
      :visible.sync="videoVisible" 
      :before-close="cancel" 
      @open="handleOpen()">
      <div slot="title">
        <span class="video-panel__title">视频管理</span>
        <input
          v-model="serch.name"
          placeholder="搜索"
          clearable
          class="video-panel__search"
          @keyup.enter="searchMedia()"
        >
      </div>
      <div>
        <div 
          v-loading="loading" 
          class="video-panel__body">
          <li
            v-for="obj in dataVideo"
            :key="obj.id"
            class="video-panel__img-item"
            @click="selectImg(obj)"
          >
            <video 
              :src="obj.url" 
              controls="controls" 
              class="video-panel__img">您的浏览器不支持</video>
            <div class="video-panel__img-name">{{ obj.name }}</div>
            <div 
              v-for="selectedObj in selectedImgs" 
              :key="selectedObj.id">
              <div v-if="obj.id == selectedObj.id">
                <div class="video-panel__arrow-wrap"/>
                <i class="video-panel__arrow"/>
              </div>
            </div>
          </li>
        </div>
        <div class="video-panel__footer">
          <el-upload
            :action="SERVER_URL + '/api/video'"
            :data="{type: type}"
            :headers="formHeader"
            :before-upload="beforeUpload"
            :on-success="handleSuccess"
            :on-error="handleError"
            :multiple="false"
            :auto-upload="true"
            :show-file-list="false"
            :disabled="uploadDisabled"
            list-type="picture"
            class="video-panel__upload"
          >
            <el-button 
              size="small" 
              type="primary">点击上传</el-button>
          </el-upload>
          <span class="image-type">仅支持mp4一种格式, 大小为50M以内</span>
          <div class="video-panel__page">
            <el-pagination
              :total="pagination.count"
              :page-size="pagination.limit"
              :current-page.sync="pagination.page_num"
              layout="total, prev, pager, next, jumper"
              @current-change="changeCurrent"
            />
          </div>
        </div>
      </div>
      <div slot="footer">
        <div 
          name="footer" 
          class="footer">
          <div class="video-panel__choose-num">已选择{{ selectedImgs.length }}个视频</div>
          <el-button @click="cancel()">取 消</el-button>
          <el-button 
            type="primary" 
            @click="confirm()">确 定</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getVideoMediaList } from "service";

import {
  Button,
  Tabs,
  TabPane,
  Upload,
  Pagination,
  MessageBox,
  Dialog
} from "element-ui";
import auth from "service/auth";

export default {
  name: "VideoPanel",
  components: {
    "el-button": Button,
    "el-tabs": Tabs,
    "el-tab-pane": TabPane,
    "el-upload": Upload,
    "el-pagination": Pagination,
    "el-dialog": Dialog
  },
  props: {
    videoVisible: {
      type: Boolean,
      required: true
    },
    singleFlag: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      loading: true,
      type: "video",
      dataVideo: [],
      serch: {
        name: ""
      },
      formHeader: {
        Authorization: "Bearer" + auth.getToken()
      },
      pagination: {
        limit: 10,
        page_num: 1,
        count: 0
      },
      selectedImgs: [],
      SERVER_URL: process.env.SERVER_URL,
      uploadDisabled: false
    };
  },
  created() {},
  methods: {
    handleError() {
      this.loading = false;
    },
    handleOpen() {
      this.getVideoMediaList();
    },
    changeCurrent(currentPage) {
      this.pagination.page_num = currentPage;
      this.getVideoMediaList();
    },
    handleClose(selectedImgs) {
      this.serch.name = "";
      this.searchedMediaList = [];
      this.selectedImgs = [];
      this.uploadDisabled = false;
      this.$emit("update:videoVisible", false);
      this.$emit("close", selectedImgs);
    },

    cancel() {
      this.handleClose([]);
    },

    confirm() {
      this.handleClose(this.selectedImgs);
    },

    selectImg(obj) {
      var isExsisted = false;
      if (this.singleFlag) {
        this.selectedImgs = [];
        this.selectedImgs.push(obj);
      } else {
        for (let i = 0; i < this.selectedImgs.length; i++) {
          if (this.selectedImgs[i].id == obj.id) {
            isExsisted = true;
            this.selectedImgs.splice(i, 1);
            break;
          }
        }
      }
    },
    getVideoMediaList() {
      let params = {
        page: this.pagination.page_num,
        type: "video",
        name: this.serch.name
      };
      getVideoMediaList(this, params)
        .then(res => {
          this.dataVideo = res.data;
          this.pagination.count = res.meta.pagination.total;
          this.loading = false;
        })
        .catch(err => {
          console.log(err);
          this.loading = false;
        });
    },
    searchMedia() {
      this.loading = true;
      this.getVideoMediaList();
    },

    handleSuccess(response, file, fileList) {
      this.getVideoMediaList();
    },

    beforeUpload(file) {
      this.loading = true;
      const isJPG = file.type === "video/mp4";
      const isLt2M = file.size / 1024 / 1024 < 10;
      if (!isJPG) {
        this.loading = false;
        this.$message.error("上传图片仅支持mp4一种格式!");
        return isJPG;
      }
      if (!isLt2M) {
        this.loading = false;
        this.$message.error("上传图片大小不能超过 50MB!");
        return isLt2M;
      }
    }
  }
};
</script>


<style lang="less">
.video-panel {
  .el-dialog--large {
    width: 70%;
  }

  .el-dialog__header {
    padding: 20px 20px 20px;
  }

  .el-dialog__headerbtn {
    position: absolute;
    right: 15px;
    top: 20px;
    .el-icon {
      font-size: 20px;
    }
  }
  .image-type {
    color: #999;
    font-size: 12px;
  }
  .el-dialog__body {
    position: relative;
    padding: 0px;
    border-top: 1px solid #d3dce6;
    border-bottom: 1px solid #d3dce6;
    border-right: 1px solid #d3dce6;
  }
  .el-dialog__footer {
    .footer {
      text-align: center;
      button {
        width: 150px;
      }
    }
  }
}
.video-panel__choose-num {
  font-size: 14px;
  display: inline-block;
  position: absolute;
  left: 18px;
  line-height: 40px;
  color: #56636d;
}

.video-panel__title {
  color: #c0ccda;
  font-size: 20px;
  font-weight: 300;
  .backImgPanel {
    color: #38f;
    font-weight: bold;
  }
  .backImgPanel:hover {
    color: #07d;
  }
}
.video-panel__search {
  float: right;
  margin-top: -7px;
  padding-left: 30px !important;
  margin-right: 30px;
  border: 1px solid #d3dce6;
  border-radius: 5px;
  width: 163px;
  height: 33px;
  background-color: #eff2f7;
  background-image: url("../../assets/images/icons/search-icon.png");
  background-repeat: no-repeat;
  background-position: 5% 50%;
}

.video-panel__body {
  padding-bottom: 100px;
}
.video-panel__img-item {
  overflow: hidden;
  position: relative;
  margin-left: 20px;
  margin-top: 20px;
  margin-bottom: 24px;
  height: 200px;
  display: inline-block;
  cursor: pointer;
}
.video-panel__img {
  width: 300px;
  height: 170px;
}
.video-panel__img-size {
  position: absolute;
  bottom: 30px;
  width: 130px;
  color: white;
  background-color: rgba(0, 0, 0, 0.5);
  text-align: center;
  height: 25px;
  line-height: 25px;
  font-size: 12px;
}
.video-panel__img-name {
  position: absolute;
  bottom: 10px;
  width: 130px;
  white-space: nowrap;
  text-overflow: ellipsis;
  -o-text-overflow: ellipsis;
  overflow: hidden;
}
.video-panel__arrow {
  background-image: url("../../assets/images/icons/selected.png");
  background-repeat: no-repeat;
  height: 15px;
  position: absolute;
  top: 4px;
  right: 4px;
  width: 15px;
}
.video-panel__arrow-wrap {
  transform: rotate(45deg);
  width: 50px;
  height: 50px;
  background-color: #20a0ff;
  position: absolute;
  top: -25px;
  right: -25px;
}

.video-panel__footer {
  height: 57px;
  background-color: #eff2f7;
  position: absolute;
  bottom: 0px;
  width: 100%;
}
.video-panel__upload {
  display: inline-block;
  .el-upload {
    line-height: 57px;
    margin-left: 30px;
  }
}

.video-panel__page {
  float: right;
  margin-top: 13px;
  display: inline-block;
  vertical-align: middle;
}
</style>
