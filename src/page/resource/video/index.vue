<template>
  <div>
    <div
      v-loading="setting.loading"
      :element-loading-text="setting.loadingText"
      class="video-manage"
    >
      <div class="video-group-title">
        <span>分组名称：</span>
        <span>{{ mediaGroup.renameGroupValue }}</span>
        <el-popover
          ref="rename"
          v-model="mediaGroup.mediaGroupRenameFlag"
          placement="bottom"
          width="260"
        >
          <p>编辑名称</p>
          <el-input
            v-model="mediaGroup.renameGroupValue"
            :maxlength="6"
            placeholder="不超过6个"
            class="rename-input"
          />
          <div class="btn-wrap">
            <el-button 
              type="primary" 
              size="small" 
              @click="modifyGroupName">确定</el-button>
            <el-button
              size="small"
              @click="mediaGroup.mediaGroupRenameFlag = false, mediaGroup.renameGroupValue = renameGroup"
            >取消</el-button>
          </div>
        </el-popover>
        <a 
          v-popover:rename 
          v-show="mediaGroup.renameGroupValue !== '默认分组'">重命名</a>
      </div>
      <div class="grouping-image-wrap">
        <div class="grouping-wrap">
          <ul class="grouping-list clearfix">
            <li
              v-for="(item,index) in mediaGroup.mediaGroupList"
              :key="index"
              :class="{'grouping-active': mediaGroup.groupId == item.id}"
              @click="getImgMediaList(item.id,item.name)"
            >
              <span>{{ item.name }}</span>
              <span class="number">{{ item.count }}</span>
            </li>
          </ul>
          <el-popover
            ref="add-title"
            v-model="mediaGroup.mediaGroupAddFlag"
            placement="bottom"
            width="260"
          >
            <p>添加分组</p>
            <el-input
              v-model="mediaGroup.addGroupNameValue"
              :maxlength="6"
              placeholder="不超过6个字"
              class="group-input"
            />
            <div class="btn-wrap">
              <el-button 
                type="primary" 
                size="small" 
                @click="addMediaGroup">确定</el-button>
              <el-button
                size="small"
                @click="mediaGroup.mediaGroupAddFlag = false,mediaGroup.addGroupNameValue = ''"
              >取消</el-button>
            </div>
          </el-popover>
          <el-button v-popover:add-title>添加分组</el-button>
        </div>
        <div class="image-warp">
          <div class="image-title-group"/>
          <!-- 视频列表 -->
          <ul class="image-list">
            <div
              v-show="mediaImage.mediaList.length == 0"
              class="hint-message"
            >暂无数据，可点击左下角“上传视频”按钮添加</div>
            <li 
              v-for="(imageItem, index) in mediaImage.mediaList" 
              :key="imageItem.id">
              <video
                :src="imageItem.url"
                class="image-file"
                controls="controls"
                @click="mediaVideo.imageVisible = true, mediaVideo.mediaVideoUrl = imageItem.url"
              >您的浏览器不支持</video>
              <p
                class="item-text"
              >{{ imageItem.name.length>8 ? imageItem.name.substring(0,7)+'...':imageItem.name }}</p>
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
                  <a
                    slot="reference"
                  >{{ imageItem.status === 0 ? '未通过' : imageItem.status === 1 ? '通过' : '待审核' }}</a>
                </el-popover>
              </div>
            </li>
          </ul>
          <!-- 视频上传 -->
          <div class="submit-warp">
            <el-upload
              ref="upload"
              :action="Domain"
              :data="uploadForm"
              :before-upload="beforeUpload"
              :on-success="handleSuccess"
              :multiple="false"
              :auto-upload="true"
              :show-file-list="false"
              :on-error="handleError"
              list-type="video"
              class="upload"
            >
              <el-button 
                size="small" 
                type="success">上传视频</el-button>
            </el-upload>
            <span class="image-type">仅支持mp4一种格式, 大小为100M以内</span>
            <div class="pagination">
              <el-pagination
                :page-size="pagination.limit"
                :pager-count="5"
                :total="pagination.count"
                :current-page.sync="pagination.page_num"
                small
                layout="prev, pager, next, total"
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
import {
  getImgMediaList,
  modifyImgMedia,
  getQiniuToken,
  imgMediaUpload,
  getMediaGroup, // 分组列表
  saveMediaGroup,
  modifyMediaGroupName,
  //视频审核
  imageReview
} from "service";

import {
  Popover,
  Button,
  Input,
  Upload,
  Pagination,
  Dialog,
  Message
} from "element-ui";

export default {
  components: {
    "el-button": Button,
    "el-popover": Popover,
    "el-input": Input,
    "el-upload": Upload,
    "el-pagination": Pagination,
    "el-dialog": Dialog
  },
  data() {
    return {
      mediaGroup: {
        mediaGroupRenameFlag: false,
        mediaGroupAddFlag: false,
        mediaGroupList: [],
        addGroupNameValue: "",
        renameGroupValue: "",
        groupId: null
      },
      Domain: "http://upload.qiniu.com",
      uploadForm: {
        token: "",
        key: ""
      },
      audit: "",
      setting: {
        loading: false,
        loadingText: "拼命加载中"
      },
      pagination: {
        limit: 20,
        page_num: 1,
        count: 0
      },
      operate: {
        renamePopoverArray: [],
        renameValueArray: []
      },
      groupId: null,
      type: "video",
      mediaImage: {
        imageVisible: false,
        mediaRename: false,
        mediaImageUrl: "",
        mediaList: []
      }
    };
  },
  computed: {
    renameGroup() {
      let rename = "";
      this.mediaGroup.mediaGroupList.find(item => {
        if (item.id === this.mediaGroup.groupId) {
          rename = item.name;
          return;
        }
      });
      return rename;
    }
  },
  created() {
    this.init();
  },
  methods: {
    async init() {
      try {
        this.setting.loading = true;
        let args = {
          type: this.type
        };
        let res = await getQiniuToken(this);
        let mediaGroupsData = await getMediaGroup(this, args);
        this.mediaGroup.mediaGroupList = mediaGroupsData.data;
        this.mediaGroup.groupId = this.mediaGroup.mediaGroupList[0].id;
        this.mediaGroup.renameGroupValue = this.mediaGroup.mediaGroupList[0].name;
        await this.getImgMediaList(this.mediaGroup.mediaGroupList[0].id);
        this.uploadForm.token = res;
        this.setting.loading = false;
      } catch (e) {
        console.log(e);
        this.setting.loading = false;
      }
    },
    // 增加分组
    async addMediaGroup() {
      try {
        if (this.mediaGroup.addGroupNameValue.trim()) {
          let args = {
            name: this.mediaGroup.addGroupNameValue,
            type: this.type
          };
          let res = await saveMediaGroup(this, args);
          let argsGroup = {
            type: this.type
          };
          let mediaGroupsData = await getMediaGroup(this, argsGroup);
          this.mediaGroup.mediaGroupAddFlag = false;
          this.mediaGroup.mediaGroupList = mediaGroupsData.data;
          this.mediaGroup.addGroupNameValue = "";
        } else {
          this.mediaGroup.mediaGroupAddFlag = false;
          this.mediaGroup.addGroupNameValue = "";
          MessageBox.alert("增加的分组名称不能为空");
        }
      } catch (e) {}
    },
    // 修改分组名称
    async modifyGroupName() {
      let params = {
        name: this.mediaGroup.renameGroupValue,
        type: this.type
      };
      try {
        let argsGroup = {
          type: this.type
        };
        await modifyMediaGroupName(this, this.mediaGroup.groupId, params);
        let mediaGroupsData = await getMediaGroup(this, argsGroup);
        this.mediaGroup.mediaGroupList = mediaGroupsData.data;
        this.mediaGroup.mediaGroupRenameFlag = false;
      } catch (e) {
        this.mediaGroup.mediaGroupRenameFlag = false;
      }
    },
    handleError() {
      this.setting.loading = false;
    },
    handleImageClose() {
      this.mediaImage.imageVisible = false;
    },
    changeCurrent(currentPage) {
      this.pagination.page_num = currentPage;
      this.getImgMediaList(this.mediaGroup.groupId);
    },
    // 获取视频列表
    getImgMediaList(groupId, groupName) {
      this.mediaGroup.groupId = groupId;
      let _this = this;
      let args = {
        page: this.pagination.page_num
      };
      getImgMediaList(this, groupId, args)
        .then(res => {
          this.mediaImage.mediaList = res.data;
          this.pagination.count = res.meta.pagination.total;
          groupName ? (this.mediaGroup.renameGroupValue = groupName) : "";
          this.setModelFlag(this.mediaImage.mediaList);
          this.setting.loading = false;
        })
        .catch(err => {
          _this.setting.loading = false;
          console.log(err);
        });
    },
    // 设置for循环列表中的v-model值
    setModelFlag(dataList) {
      this.operate.renameValueArray = [];
      this.operate.renamePopoverArray = [];
      dataList.map(v => {
        this.operate.renamePopoverArray.push({ flag: false });
        this.operate.renameValueArray.push({ name: v.name });
      });
    },
    // 处理视频列表中按钮的确定和取消操作的标记
    handleOperationButtonClick(index, modelName, imageId) {
      if (modelName === "rename") {
        this.operate.renameValueArray[index].name = this.mediaImage.mediaList[
          index
        ].name;
        this.operate.renamePopoverArray[index].flag = false;
      }
    },
    // 视频的重命名处理
    mediaRenameHandle(index, imageId) {
      if (this.operate.renameValueArray[index].name.trim()) {
        this.setting.loading = true;
        let name = this.operate.renameValueArray[index].name;
        this.operate.renamePopoverArray[index].flag = false;
        this.modifyMedia(imageId, name);
      } else {
        this.operate.renameValueArray[index].name = this.mediaImage.mediaList[
          index
        ].name;
        this.operate.renamePopoverArray[index].flag = false;
        this.$message({
          message: "请输入要重命名的内容",
          type: "warning"
        });
      }
    },
    // 修改视频名称
    modifyMedia(id, name) {
      let args = {
        name: name
      };
      modifyImgMedia(this, id, args, this.mediaGroup.groupId)
        .then(res => {
          this.getImgMediaList(this.mediaGroup.groupId);
        })
        .catch(err => {
          this.setting.loading = false;
        });
    },
    // 上传前调用的方法，主要用来获取token和key
    beforeUpload(file) {
      this.setting.loading = true;
      let name = file.name;
      let type = name.substring(name.lastIndexOf("."));
      let isLt100M = file.size / 1024 / 1024 < 100;
      let time = new Date().getTime();
      let random = parseInt(Math.random() * 10 + 1, 10);
      let suffix = time + "_" + random + "_" + name;
      let key = encodeURI(`${suffix}`);
      const isJPG = file.type === "video/mp4";
      const isLt10M = file.size / 1024 / 1024 < 100;
      if (!isJPG) {
        this.$message.error("上传视频仅支持mp4一种格式!");
        this.setting.loading = false;
        return isJPG;
      }
      if (!isLt100M) {
        this.$message.error("上传视频大小不能超过 100MB!");
        this.setting.loading = false;
        return isLt10M;
      }
      this.uploadForm.key = key;
      return this.uploadForm;
    },
    // 上传成功后的处理
    async handleSuccess(response, file) {
      let [key, name, size] = [response.key, file.name, file.size];
      let type = name.substring(name.lastIndexOf("."));
      let params = {
        key: key,
        name: name,
        size: size,
        type: this.type
      };
      try {
        let argsGroup = {
          type: this.type
        };
        await imgMediaUpload(this, this.mediaGroup.groupId, params);
        await this.getImgMediaList(this.mediaGroup.groupId);
        let mediaGroupsData = await getMediaGroup(this, argsGroup);
        this.mediaGroup.mediaGroupList = mediaGroupsData.data;
      } catch (e) {
        console.log(e);
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
  .video-group-title {
    padding: 27px 0 13px 27px;
    span {
      color: #5e6d82;
      font-size: 18px;
      line-height: 25px;
    }
    a {
      color: #20a0ff;
      cursor: pointer;
      font-size: 13px;
      line-height: 18px;
      padding-left: 18px;
    }
  }
  .grouping-image-wrap {
    padding-top: 30px;
    display: -webkit-flex;
    display: -moz-flex;
    display: flex;
    .grouping-wrap {
      background-color: #eff2f7;
      margin-left: 27px;
      max-height: 768px;
      min-width: 180px;
      min-height: 400px;
      overflow: auto;
      li {
        cursor: pointer;
        color: #5e6d82;
        font-size: 14px;
        line-height: 42px;
        padding: 0 18px;
        transition: all 0.5s;
        &:hover {
          color: #000;
        }
      }
      .grouping-active {
        background-color: #fff;
      }
      .number {
        float: right;
      }
      .el-button {
        background-color: #eff2f7;
        color: #56636d;
        font-size: 14px;
        margin: 10px 18px 10px;
        outline: none;
        width: 144px;
        border-radius: initial;
      }
      .el-button:hover {
        border: 1px solid #bfcbd9;
      }
    }

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
      width: 150px;
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
      width: 130px;
    }
  }
}
.hint-message {
  text-align: center;
  font-size: 12px;
  color: #ccc;
}

.el-popover {
  padding: 10px 15px;
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
  margin-top: 10px;
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

.image-operation a {
  color: #20a0ff;
  cursor: pointer;
  font-size: 13px;
  line-height: 17px;
  margin-right: 6px;
}
.image-file {
  cursor: pointer;
  height: 130px;
  margin-right: 10px;
  width: 130px;
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

