<template>
  <div>
    <!-- <div class="topbar">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>图片管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>-->
    <div
      v-loading="setting.loading"
      :element-loading-text="setting.loadingText"
      class="video-manage"
    >
      <div class="grouping-image-wrap">
        <div class="image-warp">
          <div class="image-title-group">
            <el-checkbox v-model="checkbox.allChecked" size="small" @change="allCheckedHandle">全选</el-checkbox>
            <el-popover
              ref="delete-image"
              v-model="mediaVideo.mediaDelete"
              :disabled="mediaVideo.disabledFlag"
              placement="bottom"
              width="260"
            >
              <p>确定删除该视频?</p>
              <p class="hint">若删除，不会对目前已使用该图片的相关业务造成影响。</p>
              <div class="btn-wrap">
                <el-button type="primary" size="small" @click="imageDeleteHandle">确定</el-button>
                <el-button
                  size="small"
                  @click="mediaVideo.mediaDelete = false,setModelFlag(mediaVideo.mediaList)"
                >取消</el-button>
              </div>
            </el-popover>
            <a v-popover:delete-image :class="{ haveChooseImage : !mediaVideo.disabledFlag }">删除</a>
          </div>
          <!-- 视频列表 -->
          <ul class="image-list">
            <div
              v-show="mediaVideo.mediaList.length == 0"
              class="hint-message"
            >暂无数据，可点击左下角“上传视频”按钮添加</div>
            <li v-for="(imageItem, index) in mediaVideo.mediaList" :key="imageItem.id">
              <video
                :src="imageItem.url"
                class="image-file"
                controls="controls"
                @click="mediaVideo.imageVisible = true, mediaVideo.mediaVideoUrl = imageItem.url"
              >您的浏览器不支持</video>
              <p class="item-text">
                <el-checkbox
                  v-model="checkbox.checkboxList[index].flag"
                  size="small"
                  @change="checkBoxChange(index,imageItem.id)"
                >{{ imageItem.name }}</el-checkbox>
              </p>
              <div class="image-operation">
                <!-- 编辑名称 -->
                <el-popover
                  v-model="operate.renamePopoverArray[index].flag"
                  placement="bottom"
                  width="260"
                >
                  <p>编辑名称</p>
                  <el-input
                    v-model="operate.renameValueArray[index].name"
                    placeholder="请输入名称"
                    class="rename-input"
                  />
                  <div class="btn-wrap">
                    <el-button
                      type="primary"
                      size="small"
                      @click="mediaRenameHandle(index,imageItem.id)"
                    >确定</el-button>
                    <el-button
                      size="small"
                      @click="handleOperationButtonClick(index, 'rename', imageItem.id)"
                    >取消</el-button>
                  </div>
                  <a slot="reference">重命名</a>
                </el-popover>
                <!-- 删除 -->
                <el-popover
                  v-model="operate.deletePopoverArray[index].flag"
                  placement="bottom"
                  width="260"
                >
                  <p>确定删除该视频?</p>
                  <p class="hint">若删除，不会对目前已使用该图片的相关业务造成影响。</p>
                  <div class="btn-wrap">
                    <el-button
                      type="primary"
                      size="small"
                      @click="imageDeleteHandle(index, imageItem.id)"
                    >确定</el-button>
                    <el-button
                      size="small"
                      @click="handleOperationButtonClick(index, '', imageItem.id)"
                    >取消</el-button>
                  </div>
                  <a slot="reference">删除</a>
                </el-popover>
              </div>
            </li>
          </ul>
          <!-- 视频上传 -->
          <div class="submit-warp">
            <el-upload
              ref="upload"
              :action="SERVER_URL + '/api/video'"
              :data="{type: mediaVideo.type}"
              :headers="formHeader"
              :before-upload="beforeUpload"
              :on-success="handleSuccess"
              :multiple="false"
              :auto-upload="true"
              :show-file-list="false"
              :on-error="handleError"
              list-type="picture"
              class="upload"
            >
              <el-button size="small" type="success">上传视频</el-button>
            </el-upload>
            <span class="image-type">仅支持mp4一种格式, 大小为20M以内</span>
            <div class="pagination">
              <el-pagination
                :page-size="pagination.limit"
                :total="pagination.count"
                :current-page.sync="pagination.page_num"
                layout="prev, pager, next, jumper, total"
                @current-change="changeCurrent"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getVideoMediaList, deleteVideoMedia, modifyVideoMedia } from "service";
import Vue from "vue";
import {
  Popover,
  Button,
  Input,
  Checkbox,
  Upload,
  Pagination,
  Message
} from "element-ui";
import auth from "service/auth";

export default {
  components: {
    "el-button": Button,
    "el-popover": Popover,
    "el-input": Input,
    "el-checkbox": Checkbox,
    "el-upload": Upload,
    "el-pagination": Pagination
  },
  data() {
    return {
      setting: {
        loading: true,
        loadingText: "拼命加载中"
      },
      pagination: {
        limit: 10,
        page_num: 1,
        count: 0
      },
      operate: {
        renamePopoverArray: [],
        deletePopoverArray: [],
        renameValueArray: []
      },
      checkbox: {
        allChecked: false,
        checkboxList: [],
        checkedList: []
      },
      mediaVideo: {
        type: "video",
        disabledFlag: true,
        imageVisible: false,
        mediaDelete: false,
        mediaRename: false,
        mediaVideoUrl: "",
        mediaList: []
      },
      formHeader: {
        Authorization: "Bearer " + auth.getToken()
      },
      SERVER_URL: process.env.SERVER_URL
    };
  },
  created: function() {
    this.getVideoMediaList();
  },
  methods: {
    handleError() {
      this.setting.loading = false;
    },
    handleImageClose() {
      this.mediaVideo.imageVisible = false;
    },
    changeCurrent(currentPage) {
      this.pagination.page_num = currentPage;
      this.getVideoMediaList();
    },
    // 获取图片列表
    getVideoMediaList() {
      let _this = this;
      let args = {
        page: this.pagination.page_num,
        type: "video"
      };
      getVideoMediaList(this, args)
        .then(res => {
          this.mediaVideo.mediaList = res.data;
          this.pagination.count = res.meta.pagination.total;
          this.setModelFlag(this.mediaVideo.mediaList);
          this.setting.loading = false;
        })
        .catch(err => {
          _this.setting.loading = false;
          console.log(err);
        });
    },
    // 设置for循环列表中的v-model值
    setModelFlag(dataList) {
      this.checkbox.checkboxList = [];
      this.operate.renameValueArray = [];
      this.operate.renamePopoverArray = [];
      this.operate.deletePopoverArray = [];
      dataList.map(v => {
        this.operate.renamePopoverArray.push({ flag: false });
        this.operate.deletePopoverArray.push({ flag: false });
        this.checkbox.checkboxList.push({ flag: false });
        this.operate.renameValueArray.push({ name: v.name });
      });
      this.checkbox.allChecked = false;
      this.mediaVideo.disabledFlag = true;
      this.checkbox.checkedList = [];
    },
    // 处理图片列表中按钮的确定和取消操作的标记
    handleOperationButtonClick(index, modelName, imageId) {
      if (modelName === "rename") {
        this.operate.renameValueArray[index].name = this.mediaVideo.mediaList[
          index
        ].name;
        this.operate.renamePopoverArray[index].flag = false;
      } else {
        this.operate.deletePopoverArray[index].flag = false;
      }
      this.checkbox.checkboxList[index].flag = false;
      this.disabledHandle(imageId);
    },
    // 处理删除是否给以点击
    disabledHandle(imageId, type) {
      if (type != "boxChange") {
        let indexArr = this.checkbox.checkedList.indexOf(imageId);
        if (indexArr !== -1) {
          this.checkbox.checkedList.splice(indexArr, 1);
        }
      }
      if (this.checkbox.checkedList.length > 0) {
        this.mediaVideo.disabledFlag = false;
        if (
          this.checkbox.checkedList.length == this.checkbox.checkboxList.length
        ) {
          this.checkbox.allChecked = true;
        }
      } else {
        this.mediaVideo.disabledFlag = true;
        this.checkbox.allChecked = false;
      }
    },
    // 图片的重命名处理
    mediaRenameHandle(index, imageId) {
      if (this.operate.renameValueArray[index].name.trim()) {
        this.setting.loading = true;
        let name = this.operate.renameValueArray[index].name;
        this.operate.renamePopoverArray[index].flag = false;
        this.modifyMedia(imageId, name);
      } else {
        this.operate.renameValueArray[index].name = this.mediaVideo.mediaList[
          index
        ].name;
        this.operate.renamePopoverArray[index].flag = false;
        this.$message({
          message: "请输入要重命名的内容",
          type: "warning"
        });
      }
    },
    // 修改名称
    modifyMedia(id, name) {
      let args = {
        name: name
      };
      modifyVideoMedia(this, id, args)
        .then(res => {
          this.getVideoMediaList();
        })
        .catch(err => {
          this.setting.loading = false;
          console.log(err);
        });
    },
    beforeUpload(file) {
      this.setting.loading = true;
      const isJPG = file.type === "video/mp4";
      const isLt2M = file.size / 1024 / 1024 < 20;
      if (!isJPG) {
        this.$message.error("上传图片仅支持mp4一种格式!");
        this.setting.loading = false;
        return isJPG;
      }
      if (!isLt2M) {
        this.$message.error("上传图片大小不能超过 20MB!");
        this.setting.loading = false;
        return isLt2M;
      }
    },
    // 上传成功后的处理
    handleSuccess() {
      this.getVideoMediaList();
    },
    // 图片的删除操作
    imageDeleteHandle(index, imageId) {
      this.setting.loading = true;
      if (imageId) {
        this.checkbox.checkedList.push(imageId);
        this.deleteMedia(index, imageId);
      } else {
        this.deleteMedia(index, this.checkbox.checkedList);
      }
    },
    // 删除视频方法
    deleteMedia(index, ids) {
      let arr = [];
      if (this.mediaVideo.mediaDelete) {
        this.mediaVideo.mediaDelete = false;
      } else {
        this.operate.deletePopoverArray[index].flag = false;
      }
      if (typeof ids === "object") {
        arr = ids;
      } else {
        arr.push(ids);
      }
      let args = {
        ids: arr
      };
      deleteVideoMedia(this, args)
        .then(res => {
          this.pagination.page_num = 1;
          this.getVideoMediaList();
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 多选框改变时候的处理
    checkBoxChange(index, imageId) {
      if (this.checkbox.checkboxList[index].flag === true) {
        this.checkbox.checkedList.push(imageId);
      } else {
        let indexArr = this.checkbox.checkedList.indexOf(imageId);
        this.checkbox.checkedList.splice(indexArr, 1);
      }
      this.disabledHandle(imageId, "boxChange");
    },
    // 全选框处理
    allCheckedHandle() {
      if (this.checkbox.allChecked) {
        this.checkbox.checkedList = [];
        for (let item of this.checkbox.checkboxList) {
          item.flag = true;
        }
        for (let imageItem of this.mediaVideo.mediaList) {
          this.checkbox.checkedList.push(imageItem.id);
        }
        if (this.mediaVideo.mediaList.length != 0) {
          this.mediaVideo.disabledFlag = false;
        } else {
          this.mediaVideo.disabledFlag = true;
        }
      } else {
        for (let item of this.checkbox.checkboxList) {
          item.flag = false;
        }
        this.checkbox.checkedList = [];
        this.mediaVideo.disabledFlag = true;
      }
    }
  }
};
</script>

<style lang="less" scoped>
.video-manage {
  background-color: #fff;
  min-height: 500px;
  padding-bottom: 100px;
  .grouping-image-wrap {
    padding-top: 30px;
    display: -webkit-flex;
    display: -moz-flex;
    display: flex;
    .image-warp {
      margin-left: 40px;
      position: relative;
      width: 100%;
      .image-title-group {
        background-color: #eff2f7;
        height: 57px;
        line-height: 57px;
        margin-right: 30px;
        width: 97.5%;
      }
      .image-title-group a {
        color: #6b798c;
        cursor: pointer;
        font-size: 13px;
        margin-right: 10px;
      }
      .image-title-group .el-checkbox {
        color: #6b798c;
        margin: 0 10px;
        font-size: 13px;
      }
      .image-title-group .haveChooseImage {
        color: #20a0ff;
      }
    }
    .image-list {
      margin-top: 10px;
      padding-bottom: 80px;
      .image-size {
        background-color: rgba(0, 0, 0, 0.5);
        bottom: 49px;
        color: #fff;
        font-size: 14px;
        text-align: center;
        height: 35px;
        line-height: 35px;
        position: absolute;
        width: 130px;
      }
    }
    .image-list li {
      margin-right: 15px;
      width: 300px;
      display: inline-block;
      position: relative;
      margin-top: 5px;
      margin-bottom: 10px;
    }
    .image-list li p {
      color: #494949;
      font-size: 14px;
      line-height: 18px;
      height: 18px;
      margin: 5px 0;
      width: 300px;
    }
  }
}
.hint-message {
  text-align: center;
  font-size: 12px;
  color: #ccc;
}

.el-popover {
  position: relative;
  padding: 10px 15px;
  z-index: 2 !important;
}
.el-popover p {
  font-size: 14px;
  line-height: 20px;
}
.rename-input {
  margin-bottom: 15px;
}
.hint {
  color: #999;
}
.btn-wrap {
  text-align: right;
}

.submit-warp {
  background-color: #eff2f7;
  bottom: 0;
  height: 57px;
  margin-right: 20px;
  left: 0;
  position: absolute;
  min-width: 700px;
  width: 97.5%;
}

.upload {
  text-align: left;
  display: inline-block;
  margin-left: 23px;
  margin-top: 16px;
  width: 100px;
}
.pagination {
  text-align: right;
  margin-top: -32px;
  margin-right: 10px;
}

.image-operation {
  a {
    color: #20a0ff;
    cursor: pointer;
    font-size: 13px;
    line-height: 17px;
    margin-right: 6px;
  }
}
.image-file {
  cursor: pointer;
  height: 200px;
  margin-right: 10px;
  width: 300px;
}

.image-type {
  color: #999;
  font-size: 12px;
}
.widget-close {
  background: #fff;
  border-radius: 50%;
  cursor: pointer;
  position: absolute;
  right: 5%;
  top: 5%;
  z-index: 3444;
}
.widget-icon {
  display: block;
  font-style: normal;
  text-align: center;
  height: 40px;
  line-height: 40px;
  width: 40px;
}
.shade-image {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #000;
  opacity: 0.6;
  z-index: 2000;
}
.widget-content {
  -ms-transform: translateX(-50%);
  left: 50%;
  transform: translateX(-50%);
  top: 20%;
  position: absolute;
  z-index: 2001;
  img {
    width: 100%;
  }
}
</style>

