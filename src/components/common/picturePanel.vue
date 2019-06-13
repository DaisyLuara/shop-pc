<template>
  <div class="picture-panel">
    <el-dialog 
      :visible.sync="panelVisible" 
      :before-close="cancel" 
      width="90%" 
      @open="handleOpen()">
      <div slot="title">
        <span class="picture-panel__title">图片管理</span>
        <input
          v-model="serch.name"
          placeholder="搜索"
          clearable
          class="picture-panel__search"
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
            <div class="picture-panel__body">
              <li
                v-for="obj in dataImg"
                :key="obj.id"
                class="picture-panel__img-item"
                @click="selectImg(obj)"
              >
                <img 
                  :src="obj.url" 
                  class="picture-panel__img">
                <div class="picture-panel__img-size">{{ obj.width }} * {{ obj.height }}</div>
                <div class="picture-panel__img-name">{{ obj.name }}</div>
                <div 
                  v-for="selectedObj in selectedImgs" 
                  :key="selectedObj.id">
                  <div v-if="obj.id == selectedObj.id">
                    <div class="picture-panel__arrow-wrap"/>
                    <i class="picture-panel__arrow"/>
                  </div>
                </div>
              </li>
            </div>
          </el-tab-pane>
        </el-tabs>
        <div class="picture-panel__footer">
          <span class="image-type">新文件在资源管理模块上传审核后方可使用</span>
          <div class="picture-panel__page">
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
          <div class="picture-panel__choose-num">已选择{{ selectedImgs.length }}张图片</div>
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
  getMediaGroup,
} from "service";

import {
  Button,
  Tabs,
  TabPane,
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
    "el-pagination": Pagination,
    "el-dialog": Dialog
  },
  props: {
    panelVisible: {
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
      activeTabName: "",
      loading: true,
      type: "image",
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
  created() {
  },
  methods: {
    async handleOpen() {
      try {
        let args = {
          type: "image",
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
      this.$emit("update:panelVisible", false);
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
    },
  }
};
</script>


<style lang="less">
.picture-panel {
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
        height: 450px;
        overflow-y:scroll;
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
.picture-panel__choose-num {
  font-size: 14px;
  display: inline-block;
  position: absolute;
  left: 18px;
  line-height: 40px;
  color: #56636d;
}

.picture-panel__title {
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
.picture-panel__search {
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

.picture-panel__body {
  padding-bottom: 100px;
}
.picture-panel__img-item {
  overflow: hidden;
  position: relative;
  margin-left: 20px;
  margin-top: 20px;
  margin-bottom: 24px;
  height: 160px;
  display: inline-block;
  cursor: pointer;
}
.picture-panel__img {
  width: 130px;
  height: 130px;
}
.picture-panel__img-size {
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
.picture-panel__img-name {
  position: absolute;
  bottom: 10px;
  width: 130px;
  white-space: nowrap;
  text-overflow: ellipsis;
  -o-text-overflow: ellipsis;
  overflow: hidden;
}
.picture-panel__arrow {
  background-image: url("~assets/images/icons/selected.png");
  background-repeat: no-repeat;
  height: 15px;
  position: absolute;
  top: 4px;
  right: 4px;
  width: 15px;
}
.picture-panel__arrow-wrap {
  transform: rotate(45deg);
  width: 50px;
  height: 50px;
  background-color: #20a0ff;
  position: absolute;
  top: -25px;
  right: -25px;
}

.picture-panel__searched-body {
  overflow: scroll;
  padding-bottom: 100px;
}

.picture-panel__footer {
  height: 57px;
  background-color: #eff2f7;
  position: absolute;
  bottom: 0px;
  padding-left: 170px;
  width: 100%;
}
.picture-panel__upload {
  display: inline-block;
  .el-upload {
    line-height: 57px;
    margin-left: 30px;
  }
}

.picture-panep__upload-btn {
  width: 86px;
  height: 36px;
  background-color: #13ce66;
  border: none;
}

.picture-panel__page {
  float: right;
  margin-top: 13px;
  display: inline-block;
  vertical-align: middle;
}
</style>
