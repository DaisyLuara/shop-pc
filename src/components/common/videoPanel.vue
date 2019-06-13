<template>
  <div class="video-panel">
    <el-dialog
      :visible.sync="videoPanelVisible"
      :before-close="cancel"
      width="90%"
      @open="handleOpen()"
    >
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
        <el-tabs
          v-loading="loading"
          v-model="activeTabName"
          type="card"
          @tab-click="handleTabsClick"
        >
          <el-tab-pane
            v-for="item in mediaGroup.mediaGroupList"
            :name="item.name"
            :groupId="item.id"
            :key="item.id"
          >
            <span 
              slot="label" 
              :groupId="item.id">
              {{ item.name }}
              <span class="number">{{ item.count }}</span>
            </span>
            <div class="video-panel__body">
              <li
                v-for="obj in dataImg"
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
          </el-tab-pane>
        </el-tabs>
        <div class="video-panel__footer">
          <span class="image-type">新文件在资源管理模块上传审核后方可使用</span>
          <div class="video-panel__page">
            <el-pagination
              :total="pagination.count"
              :pager-count="5"
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
import {
  getImgMediaList,
  getQiniuToken,
  imgMediaUpload,
  getMediaGroup,
  randomString
} from "service";

import {
  Button,
  Tabs,
  TabPane,
  Upload,
  Pagination,
  Dialog,
  MessageBox
} from "element-ui";

export default {
  name: "PicturePanel",
  components: {
    "el-button": Button,
    "el-tabs": Tabs,
    "el-tab-pane": TabPane,
    "el-upload": Upload,
    "el-pagination": Pagination,
    "el-dialog": Dialog
  },
  props: {
    videoPanelVisible: {
      type: Boolean,
      required: true
    },
    videoSingleFlag: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      activeTabName: "",
      loading: true,
      type: "video",
      dataImg: [],
      serch: {
        name: ""
      },
      mediaGroup: {
        mediaGroupList: [],
        groupId: null
      },
      pagination: {
        limit: 20,
        page_num: 1,
        count: 0
      },
      selectedImgs: [],
      mediaBase: process.env.SERVER_URL,
    };
  },
  created() {},
  methods: {
    async handleOpen() {
      try {
        let res = await getQiniuToken(this);
        let args = {
          type: this.type,
          status: 1
        };
        let mediaGroupsData = await getMediaGroup(this, args);
        this.mediaGroup.mediaGroupList = mediaGroupsData.data;
        this.mediaGroup.groupId = this.mediaGroup.mediaGroupList[0].id;
        this.activeTabName = this.mediaGroup.mediaGroupList[0].name;
        await this.getImgMediaList(this.mediaGroup.mediaGroupList[0].id);
      } catch (e) {
        console.log(e);
      }
    },
    handleTabsClick(tab, event) {
      var selId = tab.$vnode.data.attrs.groupId;
      if (selId == this.mediaGroup.groupId) {
        return;
      }
      this.mediaGroup.groupId = selId;
      this.loading = true;
      this.getImgMediaList(this.mediaGroup.groupId);
    },
    changeCurrent(currentPage) {
      this.pagination.page_num = currentPage;
      this.getImgMediaList(this.mediaGroup.groupId);
    },
    handleClose(selectedImgs) {
      this.serch.name = "";
      this.searchedMediaList = [];
      this.selectedImgs = [];
      this.$emit("update:videoPanelVisible", false);
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
      if (this.videoSingleFlag) {
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
    getImgMediaList(groupId) {
      let params = {
        page: this.pagination.page_num,
        name: this.serch.name,
        status: 1
      };
      this.serch.name === "" ? delete params.name : "";
      getImgMediaList(this, groupId, params)
        .then(res => {
          this.dataImg = res.data;
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
      this.getImgMediaList(this.mediaGroup.groupId);
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
    margin: 20px 20px;
    display: inline-block;
  }
  .el-dialog__body {
    position: relative;
    padding: 0px;
    border-top: 1px solid #d3dce6;
    border-bottom: 1px solid #d3dce6;
    border-right: 1px solid #d3dce6;
    .el-tabs {
      height: 450px;
      .el-tabs__header {
        float: left;
      }
    }
    .el-tabs__header {
      z-index: 3;
      background-color: white;
      height: 100%;
      width: 170px;
      border-right: 1px solid rgb(209, 219, 229);
      border-bottom: none;
      padding: 0;
      position: relative;
      margin: 0 0 15px;
      float: left;
      .el-tabs__nav {
        width: 100%;
        .el-tabs__item {
          display: block;
          background-color: #eff2f7;
          .number {
            float: right;
          }
          &.is-active {
            border: none;
            background-color: white;
          }
        }
      }
    }
    .el-tabs__content {
      height: 100%;
      overflow: scroll;
      .el-tab-pane {
        padding-bottom: 100px;
        height: 100%;
      }
    }
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
  background-image: url("~assets/images/icons/search-icon.png");
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
  height: 160px;
  display: inline-block;
  cursor: pointer;
}
.video-panel__img {
  width: 130px;
  height: 130px;
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
  background-image: url("~assets/images/icons/selected.png");
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

.video-panel__searched-body {
  overflow: scroll;
  padding-bottom: 100px;
}

.video-panel__footer {
  height: 57px;
  background-color: #eff2f7;
  position: absolute;
  bottom: 0px;
  padding-left: 170px;
  width: 100%;
}

.video-panel__page {
  float: right;
  margin-top: 13px;
  display: inline-block;
  vertical-align: middle;
}
</style>
