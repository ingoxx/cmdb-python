<template>
  <div>
    <el-card class="platformAction">
      <el-divider
        ><strong
          ><i class="el-icon-s-cooperation"></i>web操作</strong
        ></el-divider
      >
      <!-- 选择项目 -->
      <div class="select-look">
        <el-select
          class="select-el-p"
          v-model="project"
          clearable
          placeholder="请选择项目"
        >
          <el-option
            v-for="(item, index) in projectList"
            :key="index"
            :label="item"
            :value="item"
          ></el-option>
        </el-select>
      </div>
      <!-- 更新路径 -->
      <div class="uploadFile" v-loading="runStatus">
        <el-input
          type="textarea"
          :rows="9"
          placeholder="请输入更新路径, 如: www.aaa.com/path/path/bbb.php"
          v-model="textarea"
          @input="formatUpdatePath"
        >
        </el-input>
      </div>
      <!-- 提交更新 -->
      <div class="updateProcess" v-if="admin.includes(currentUser) || super_user.includes(currentUser)">
        <el-button type="primary" plain @click="updateCode(textarea)" :disabled="function(){if(textarea && project) return false;return true;}()"
          >提交更新</el-button
        >
      </div>
      <!-- 清除缓存 -->
      <div class="updateProcess" v-if="admin.includes(currentUser) || super_user.includes(currentUser)">
        <el-popover
          placement="right"
          width="400"
          trigger="click"
          v-model="visible1"
        >
          <div class="block">
            <el-cascader
              v-model="chooseItemCache"
              :options="CacheList"
              @change="selectItemCache"
              clearable
            ></el-cascader>
          </div>
          <div style="text-align: right; margin: 0; margin-top: 12px">
            <el-button size="mini" type="text" @click="visible1 = false"
              >取消</el-button
            >
            <el-button type="primary" size="mini" @click="clearCache()"
              >清除缓存</el-button
            >
          </div>
          <el-button
            class="change-button"
            slot="reference"
            type="primary"
            plain
            :loading="cacheLoading"
            >删除缓存</el-button
          >
        </el-popover>
      </div>
      <!-- 开关debug -->
      <div class="updateProcess" v-if="admin.includes(currentUser) || super_user.includes(currentUser)">
        <el-popover
          placement="right"
          width="400"
          trigger="click"
          v-model="visible6"
        >
          <div class="block">
            <el-cascader
              v-model="chooseItemCache"
              :options="CacheList"
              @change="selectItemCache"
              clearable
            ></el-cascader>
          </div>
          <div style="text-align: right; margin: 0; margin-top: 12px">
            <el-button size="mini" type="text" @click="visible6 = false"
              >取消</el-button
            >
            <el-button type="warning" size="mini" @click="onOffDebug(1)"
              >打开debug</el-button
            >
            <el-button type="primary" size="mini" @click="onOffDebug(2)"
              >关闭debug</el-button
            >
          </div>
          <el-button
            class="change-button"
            slot="reference"
            type="primary"
            plain
            :loading="debugLoading"
            >开关debug</el-button
          >
        </el-popover>
      </div>
      <!-- 查看svn -->
      <div class="updateProcess" v-if="admin.includes(currentUser) || super_user.includes(currentUser)">
        <el-popover
          placement="right"
          width="400"
          trigger="click"
          v-model="visible2"
        >
        <!-- :props="props"
              collapse-tags -->
          <div class="block">
            <el-cascader
              v-model="chooseItemCache"
              :options="CacheList"
              @change="selectItemCache"
              clearable
            >
            </el-cascader>
          </div>
          <div style="text-align: right; margin: 0; margin-top: 12px">
            <el-button size="mini" type="text" @click="visible2 = false"
              >取消</el-button
            >
            <el-button :loading="pullProjectLoading" type="primary" size="mini" @click="projectSvnVersion(1)"
              >拉取最新svn版本</el-button
            >
            <el-button :loading="debugLoading" type="primary" size="mini" @click="projectSvnVersion(2)"
              >查看svn版本</el-button
            >
            <div class="ep-notic">
              <p class="content">
                *查看svn版本号没更新，这个按钮【拉取最新svn版本】也要点，别只点一个
              </p>
            </div>
          </div>
          <el-button
            class="change-button"
            slot="reference"
            type="primary"
            plain
            
            >查看项目svn版本</el-button
          >
        </el-popover>
      </div>
      <!-- 上传web文件 -->
      <div class="updateProcess" v-if="upload_user.includes(currentUser) || super_user.includes(currentUser)">
        <el-button
          type="primary"
          plain
          @click="uploadWebFileOpen()"
          >上传文件</el-button
        >
      </div>
      <!-- 刷新cdn -->
      <div class="updateProcess refresh-svn" v-if="upload_user.includes(currentUser) || super_user.includes(currentUser)">
        <el-popover
          placement="right"
          width="400"
          trigger="click"
          v-model="visible4"
        >
          <div class="block">
            <el-cascader
              filterable
              v-model="selectedCdnItem"
              :options="refreshList"
              @change="selectItemCache"
              clearable
            ></el-cascader>
          </div>
          <div style="text-align: right; margin: 0; margin-top: 12px">
            <el-button size="mini" type="text" @click="visible4 = false"
              >取消</el-button
            >
            <el-button type="primary" size="mini" @click="refreshCdn()"
              >刷新cdn</el-button
            >
          </div>
          <el-button
            class="change-button"
            slot="reference"
            type="primary"
            plain
            :loading="refreshCdnLoading"
            >刷新cdn</el-button
          >
        </el-popover>
      </div>
    </el-card>
    <el-card class="box-card">
      <!---搜索--->
      <div class="row-el">
        <el-row :gutter="20">
          <el-col :span="1" class="col-1">
            <el-input
              placeholder="请输入内容"
              v-model="queryPages.search"
              suffix-icon="el-icon-date"
              clearable
              @click.native="getWebList"
            >
              <el-button slot="append" icon="el-icon-search"></el-button>
            </el-input>
          </el-col>
          <el-col :span="1" class="col-2">
            <el-date-picker
              v-model="value"
              type="daterange"
              align="right"
              unlink-panels
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :picker-options="pickerOptions"
              @change="getWebList"
              value-format="yyyy-MM-dd"
            >
            </el-date-picker>
          </el-col>
          <el-col :span="1" class="col-3">
            <el-select
              class="select-el"
              v-model="searchProject"
              clearable
              placeholder="请选择项目"
              @change="getWebList"
            >
              <el-option
                v-for="(item, index) in projectList"
                :key="index"
                :label="item"
                :value="item"
              ></el-option>
            </el-select>
          </el-col>
          <!-- <el-col :span="1" v-if="admin.includes(currentUser)" class="col-4"> -->
          <el-col :span="1" v-if="false" class="col-4">   
            <el-button
              type="warning"
              @click="updateCodeSelect"
              :loading="verifyLoading"
            >
              <i class="el-icon-potato-strips"></i> api模块审核更新
            </el-button>
          </el-col>
        </el-row>
      </div>
      <!--web列表-->
      <div class="table-el">
        <el-table
          :data="WebList"
          border
          strip
          v-loading="loading"
          :header-cell-style="{ background: '#FAFAFA' }"
          @selection-change="handleSelectionChange"
          element-loading-text="拼命加载中"
        >
          <el-table-column type="selection"></el-table-column>
          <el-table-column prop="id" label="id"></el-table-column>
          <el-table-column
            prop="project"
            label="项目"
          ></el-table-column>
          <el-table-column prop="status" label="状态">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="primary"
                v-if="scope.row.status === 104"
                :loading="true"
              >
                更新中
              </el-button>
              <el-link
                type="danger"
                :underline="false"
                v-else-if="scope.row.status === 102"
                >失败</el-link
              >
              <el-link
                type="success"
                :underline="false"
                v-else-if="scope.row.status === 100"
                >完成</el-link
              >
              <el-link
                type="warning"
                :underline="false"
                v-else-if="scope.row.status === 103"
                >需审核</el-link
              >
            </template>
          </el-table-column>
          <el-table-column
            prop="content"
            label="更新路径"
            width="550"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            prop="operate_user"
            label="操作用户"
          ></el-table-column>
          <el-table-column
            prop="start_time"
            label="提交时间"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column fixed="right" label="文件内容">
            <template slot-scope="scope">
              <el-link type="success" @click="checkWebUpdate(scope.row)"
                >打开文件<i class="el-icon-view el-icon--right"></i
              ></el-link>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="280">
            <template slot-scope="scope">
              <el-tooltip
                class="item"
                effect="dark"
                content="复制更新内容"
                placement="top-start"
              >
                <el-button
                  size="mini"
                  type="success"
                  v-clipboard:copy="scope.row.content"
                  >复制</el-button
                >
              </el-tooltip>
              <el-button size="mini" type="danger" @click="delWeb(scope.row)" v-if="super_user.includes(currentUser)"
                >删除</el-button
              >
              <!-- <el-button
                size="mini"
                type="warning"
                @click="downloadFile(scope.row)"
                >下载</el-button
              > -->
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!---分页--->
      <div class="page-el">
        <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryPages.currentPage"
          :page-sizes="[10, 20, 30, 40, 50]"
          :page-size="queryPages.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total_contents"
        >
        </el-pagination>
      </div>
      <!-- 上传web文件 -->
      <el-dialog
        title="上传文件"
        :visible.sync="uploadVisible"
      >
      <!--  -->
        <el-upload
              class="upload-demo"
              ref="webUploadRef"
              :before-upload="beforeUpload"
              :on-success="uploadSuccess"
              :on-error="uploadError"
              :on-progress="handleProgress"
              :http-request="clickUploadFile"
			        action=""
			        :on-change="handleChange"
              multiple
              drag
              :limit="200"
              :file-list="fileList"
              :data="webFileUploadData"
              :on-exceed="uploadLimit"
              :auto-upload="false"
          >
          <i class="el-icon-upload"></i>
          <div class="el-upload__tip" slot="tip">
			<div>
				注意：上传的文件名必须跟更新路径上的文件名一致, 最多同时上传20个文件
			</div> 
      <transition name="el-zoom-in-center">
        <!-- <div v-show="show2" class="transition-box">.el-zoom-in-center</div> -->
        <div class="cus-progress" v-show="showPercentage">
          <el-progress :percentage="percentage" v-if="percentage < 100"></el-progress>
          <el-progress :percentage="100" status="success" v-else></el-progress>
        </div>
      </transition>
      
			<div class="cus-el-upload">
				<el-button style="margin-left: 10px;" size="small" type="success" @click="cusSubmit()" :loading="uploadLoading" icon="el-icon-s-promotion">点击上传</el-button>
			</div>
		  </div>
        </el-upload>
      </el-dialog>
      <!-- web文件内容 -->
      <el-dialog
        title="更新内容"
        :visible.sync="CronResVisible"
        :close-on-click-modal="false"
      >
        <el-card class="layout-bottom">
          <el-divider><strong><i class="el-icon-platform-eleme"></i>更新路径</strong></el-divider>
          <p>
            <span class="item-name">更新路径:</span>
            <el-link type="success" :underline="false">{{
              cronContent
            }}</el-link>
          </p>
        </el-card>
        <el-card
          class="content-layout-height"
          v-loading="loadingResult"
          element-loading-text="正在拼命获取文件内容"
          element-loading-spinner="el-icon-loading"
        >
          <el-divider
            ><strong
              ><i class="el-icon-platform-eleme"></i>文件内容</strong
            ></el-divider
          >
          <template>
            <div class="format-code">
              <pre><code class="format-code-1">{{ curCode }}</code></pre>
            </div>
          </template>
        </el-card>
      </el-dialog>
      <!-- adjust启动日志 -->
      <el-dialog
        title="adjust启动日志"
        :visible.sync="checkAdBootLogVisible"
        :close-on-click-modal="false"
      >
        <el-card class="layout-bottom">
          <el-divider><strong><i class="el-icon-platform-eleme"></i>项目</strong></el-divider>
          <p>
            <span class="item-name">项目:</span>
            <el-link type="success" :underline="false">{{ adName }}</el-link>
          </p>
        </el-card>
        <el-card
          class="content-layout-height"
          v-loading="loadingResult"
          element-loading-text="正在拼命获取文件内容"
          element-loading-spinner="el-icon-loading"
        >
          <el-divider
            ><strong
              ><i class="el-icon-platform-eleme"></i>日志内容</strong
            ></el-divider
          >
          <template>
            <div class="format-code">
              <pre><code>{{ curCode }}</code></pre>
            </div>
          </template>
        </el-card>
      </el-dialog>
    </el-card>
  
  </div>
</template>

<script>
import {
  webList,
  delWeb,
  updateCode,
  checkWebUpdate,
  downloadFile,
  cacheList,
  clearCache,
  createWebLog,
  onOffDebug,
  checkUpdateStatus,
  processReload,
  checkProjectSvnVersion,
  refreshSvn,
  webUpload,
  restartAdApi,
  getAdLog,
  refreshCdnApi,
  webFileUpload,
} from "@/api";
import "codemirror/theme/ambiance.css";
import { elConfirm } from "@/modules";
import baseUrl from "../../utlis/baseUrl";
import { Notification } from "element-ui";
import { DarkMode } from '@vue-a11y/dark-mode';
import { EventBus } from '@/utlis/eventBus';

export default {
  name: "webList",
  data() {
    return {
      showPercentage: false,
      percentage: 0,
		  uploadLoading: false,
      fileList: [],
      props: { multiple: true },
      refreshCdnLoading: false,
      visible6: false,
      selectedCdnItem: [],
      refreshList: [],
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            },
          },
        ],
      },
      pullProjectLoading: false,
      adName: "",
      adBootLog: "",
      checkAdBootLogVisible: false,
      restartAdLoading: false,
      selectedItem: [],
      adjustList: [],
      checked1: false,
      checked2: false,
      restartAd: "",
      currentToken: "",
      webFileUploadData:{},
      uploadVisible:false,
      leaveClose: true,
      noticeSvn: "如svn版本没更新请点击这里",
      refreshSvnLoading: false,
      CronResVisible: false,
      visible: false,
      loading: true,
      loadingResult: true,
      updateLoading: false,
      visible1: false,
      visible4: false,
      cacheLoading: false,
      createLogLoading: false,
      visible2: false,
      debugLoading: false,
      runStatus: false,
      verifyLoading: false,
      reloadProcessStatus: false,
      projectList: [],
      upload_user: [],
      super_user: [],
      multipleSelection: [],
      chooseItemCache: [],
      WebList: [],
      CacheList: [],
      admin: [],
      currentUser: "",
      cronContent: "",
      textarea: "",
      project: "",
      searchProject: "",
      value: "",
      content: "",
      url: "",
      curCode: "",
      total_contents: 10,
      active: 0,
      count: 0,
      status: true,
      formLabelWidth: "120px",
      queryPages: {
        currentPage: 1,
        pageSize: 10,
        search: "",
        start: "",
        end: "",
      },
      cmOptions: {
        //codeMirror的配置
        // 　　value: '', //编辑器的初始值（文本）
        // 　　mode: "html", //以什么格式进行代码高亮
        theme: "ambiance", // ambiance, foo bar, darcula //配置编辑器的主题样式
        //  　　indentUnit: 1, //缩进单位
        //  　　smartIndent: true, // 自动缩进
        // 　　 tabSize: 1, //tab字符的宽度
        lineNumbers: true, // 是否显示行
        //  　　firstLineNumber: 1, //第一行的行号
        //  　　showCursorWhenSelecting: true, // 在选择时是否显示光标
        readOnly: true, //是否只读,不能获取焦点
      },
    };
  },
  components: {
    // DarkMode,
  },
  methods: {
  formatProgress(percentage) {
      return percentage === 100 ? '满' : `${percentage}%`;
  },
	handleChange(file, fileList) {
		this.fileList = fileList;
	},
  cusSubmit() {
    if (this.$refs.webUploadRef.uploadFiles.length === 0) {
      return this.$message.error('请选取文件')
    }
    // 直接使用 submit() 提交
    // this.$refs.webUploadRef.submit();
    this.clickUploadFile();
  },

  async clickUploadFile(option) {
      this.uploadLoading = true;
      this.showPercentage = true;

      let formData = new FormData();

      formData.append('project', this.project)
      formData.append('key', 20)
      formData.append('user', sessionStorage.getItem('user'));
      formData.append('token', sessionStorage.getItem('token'));

      var files = this.textarea.split('\n');

      files.forEach(file => {
        formData.append('content', file);
      });

      this.fileList.forEach(file => {
        formData.append('files', file.raw);
      });

      // 发起上传请求
      const resp = await webFileUpload(formData, {
        timeout: 1200000,
        onUploadProgress: (e) => {
          if (e.total > 0) {
            this.handleProgress({
              percent: Math.round((e.loaded / e.total) * 100)
            });
          }
        }
      }).catch(err => { 
        console.log("assetsUpload err >>>", err) 
      });

      if (resp.data.code === 10000) {
        this.$message.success(resp.data.message);
      } else {
        this.$message.error(resp.data.message);
      }

      this.getWebList();
      setTimeout(() =>{
        this.$refs.webUploadRef.clearFiles();
        this.uploadVisible = false;
        this.uploadLoading = false;
        this.showPercentage = false;
        this.percentage = 0;
      }, 3000);
      // this.$refs.webUploadRef.clearFiles();
      // this.uploadVisible = false;
      // this.uploadLoading = false;
      // this.showPercentage = false;
      // this.percentage = 0;
    },
    formatUpdatePath(data) {
      const nd = data.split("\n").map(line => line.replace(/\\/g, "/"));
      this.textarea = nd.join("\n");
    },
    loadingEvent () {
      EventBus.$on('updateData', this.handleDataUpdate);
    },
    handleDataUpdate(data) {
      this.restartAdLoading = data.message;
      this.loadingResult = data.message;
      this.refreshSvnLoading = data.message;
      this.loading = data.message;
      this.runStatus = data.message;
      this.verifyLoading = data.message;
      this.createLogLoading = data.message;
      this.loadingResult = data.message;
      this.cacheLoading = data.message;
      this.debugLoading = data.message;
      this.pullProjectLoading = data.message;

    },
    async getAdjustLog(name) {
      this.checkAdBootLogVisible = true;
      this.loadingResult = true;
      this.curCode = "";
      this.adName = name;
      const resp = await getAdLog({item: this.adName, user: this.currentUser});
      if (resp.data.status != 666) {
        this.curCode = resp.data.msg;
      } else {
        this.curCode = resp.data.data;
      }
      this.loadingResult = false;
    },
    async restartAdjust() {
      if (!this.checked1 && !this.checked2) {
        return this.$message.error("请先选中要重启的adjust");
      }

      if (this.checked1) {
        this.selectedItem.push("luckytruco-adjust");
      }

      if (this.checked2) {
        this.selectedItem.push("trucomaster-adjust");
      }

      this.restartAdLoading = true;
      
      const resp = await restartAdApi({
        user: this.currentUser,
        item: this.selectedItem.join(","),
      })

      if (resp.data.status == 666) {
        this.$message.success(resp.data.msg);
      } else {
        
        this.$message.error(resp.data.msg);
      }

      this.selectedItem = [];
      this.restartAdLoading = false;

    },
    initUploadData() {
      this.currentUser = sessionStorage.getItem("user");
      this.currentToken = sessionStorage.getItem("token");
    },
    uploadError(err) {
      this.$message.error(err)
    },
    uploadLimit(err) {
      this.$message.error('只能同时上传20个文件')
    },
    handleProgress(event, file) {
      console.log('上传进度:', event.percent)
      this.percentage = event.percent;
    },
    uploadSuccess (response, file) {
      if (response.code === 10000 || response.code === 200) {
        this.$message.success(response.msg);
        this.getWebList()
      } else {
        this.$message.error(response.msg)
      }
      this.$refs.webUploadRef.clearFiles();
      this.webFileUploadData = {};
    },
    beforeUpload(file) {
      var filePath = file.name;
      //获取最后一个.的位置
      var index= filePath.lastIndexOf(".");
      //获取后缀
      var ext = filePath.substr(index+1);
      //输出结果
      const fileSuffix = ['zip', 'php', 'html', 'js', 'css', 'png', 'jpg'];
      // const isSQL = ext === 'zip' || ext === 'php' || ext === 'html' || ext === 'js' || ext === 'css' || ext === 'html';
      if (!fileSuffix.includes(ext)) {
        const sff = fileSuffix.join(', ');
        this.$message.error(`该文件${filePath}不能上传, 只能上传${sff}后缀的文件!`);
        return isSQL;
      }
        
      return new Promise((resolve, reject) => {
        this.webFileUploadData = {
          content: JSON.stringify(this.textarea.split("\n")),
          project: this.project,
          key: 20,
          user: this.currentUser,
          token: this.currentToken,
        };

        resolve(true);
      });
    },
    uploadWebFileUrl() {
      return `${baseUrl}/web/upload/`;
    },
    uploadWebFileOpen() {
      if (!this.project) {
        return this.$message.error("请选择项目");
      }
      if (this.textarea == "") {
        return this.$message.error("请输入更新路径");
      }
      this.uploadVisible = true;
    },
    async refreshSvn () {
      this.refreshSvnLoading = true;
      const resp = await refreshSvn({ refresh: "" })
      if (resp.data.status == 666) {
        this.$message.success(resp.data.msg);
      } else {
        this.$message.error(resp.data.msg);
      }
      this.refreshSvnLoading = false;
    },
    async delWeb(row) {
      await elConfirm(`确定删除${row.id}吗？`)
        .then(() => {
          delWeb({ web_id: JSON.stringify([row.id]) }).then((res) => {
            if (res.data.status === 666) {
              this.getWebList();
              this.$message.success(`${res.data.msg}`);
            } else {
              this.$message.error(`${res.data.msg}`);
            }
          });
        })
        .catch(() => {
          this.$message.info("已取消");
        });
        this.refreshSvnLoading = false;
    },
    async DeleteSelectedPlatform() {
      if (this.multipleSelection.length === 0) {
        return this.$message.error("请先勾选需要删除的平台.");
      }
      var platform_list = [];
      for (let i = 0; i < this.multipleSelection.length; i++) {
        platform_list.push(this.multipleSelection[i].id);
      }
      await elConfirm(`确定都删除${platform_list}吗？`)
        .then(() => {
          delWeb({ web_id: JSON.stringify(platform_list) }).then((res) => {
            if (res.data.status === 666) {
              this.getWebList();
              this.$message.success(`${res.data.msg}`);
            } else {
              this.$message.error(`${res.data.msg}`);
            }
          });
        })
        .catch(() => {
          this.$message.info("已取消");
        });
    },
    async getWebList() {
      this.loading = true;
      if (this.value !== null) {
        this.queryPages.start = this.value[0];
        this.queryPages.end = this.value[1];
      } else {
        this.queryPages.start = "";
        this.queryPages.end = "";
      }
      
      var searchId = ""
      if (this.queryPages.search == "失败") {
        searchId = 102;
      }  else if (this.queryPages.search == "成功") {
        searchId = 100;
      } else if (this.queryPages.search == "更新中") {
        searchId = 104;
      } else if (this.queryPages.search == "需审核") {
        searchId = 103;
      } else {
        searchId = this.queryPages.search;
      }

      await webList({
        search: searchId,
        searchProject: this.searchProject,
        size: this.queryPages.pageSize,
        page: this.queryPages.currentPage,
        start: this.queryPages.start,
        end: this.queryPages.end,
      }).then((res) => {
        if (res.data.status === 666) {
          this.WebList = res.data.data;
          this.total_contents = res.data.total_contents;
          this.projectList = res.data.projects;
          this.admin = res.data.admin;
          this.upload_user = res.data.upload_user;
          this.super_user = res.data.super_user;
          this.adjustList = res.data.adjust_list;
          this.refreshList = res.data.refresh_list;
        } else {
          this.$message.error(res.data.msg);
        }
        this.loading = false;
      });
    },
    async updateCode(row) {
      //写入路径更新
      let data = null;
      if (!this.project) {
        return this.$message.error("请选择项目");
      }
      if (row === "") {
        return this.$message.error("请输入更新内容");
      }
      data = {
        content: JSON.stringify(row.split("\n")),
        // content: JSON.stringify(this.formatUpdatePath(row)),
        project: this.project,
        key: 20,
      };
      await elConfirm("确定更新吗？")
        .then(() => {
          this.runStatus = true;
          updateCode(data).then((res) => {
            if (res.data.status === 666) {
              this.$message.success(res.data.msg);
            } else {
              this.$message.error(res.data.msg);
            }
            this.getWebList();
            this.runStatus = false;
          });
        })
        .catch(() => {
          this.runStatus = false;
          this.$message.info("已取消");
        });
    },
    async updateCodeSelect() {
      //勾选id更新
      let data = null;
      let content = JSON.stringify(
        this.multipleSelection.map((res) => {
          return res.id;
        })
      );
      if (this.multipleSelection.length === 0) {
        return this.$message.error("请勾选需要更新的路径");
      }
      data = {
        content: JSON.stringify(
          this.multipleSelection.map((res) => {
            return res.id;
          })
        ),
        project: "any",
        key: 10,
      };
      await elConfirm(`确定更新${content}吗？`)
        .then(() => {
          this.verifyLoading = true;
          updateCode(data).then((res) => {
            if (res.data.status === 666) {
              this.$message.success(res.data.msg);
            } else {
              this.$message.error(res.data.msg);
            }
            this.getWebList();
            this.verifyLoading = false;
          });
        })
        .catch(() => {
          this.verifyLoading = false;
          this.$message.info("已取消");
        });
    },
    async createWebLog(row) {
      var data = "";
      if (!this.project) {
        return this.$message.error("请选择项目");
      }
      if (row === "") {
        return this.$message.error("请输入路径");
      }
      data = {
        content: JSON.stringify(row.split("\n")),
        user: sessionStorage.getItem("user"),
        project: this.project + "log",
      };
      await elConfirm("确定创建吗？")
        .then(() => {
          this.createLogLoading = true;
          createWebLog(data).then((res) => {
            if (res.data.status === 666) {
              this.getWebList();
              this.$message.success(res.data.msg);
            } else {
              this.$message.success(res.data.msg);
            }
            this.createLogLoading = false;
            loading.close();
          });
        })
        .catch(() => {
          this.$message.info("已取消");
          this.createLogLoading = false;
          loading.close();
        });
    },
    async checkWebUpdate(row) {
      //查看外网的文件内容
      this.cronContent = row.content;
      this.CronResVisible = true;
      this.curCode = "";
      this.loadingResult = true;
      await checkWebUpdate({
        web_id: row.id,
        project: row.project,
        user: sessionStorage.getItem("user"),
      }).then((res) => {
        if (res.data.status === 666) {
          this.curCode = res.data.data;
        } else {
          this.CronResVisible = false;
          this.$message.error(res.data.data);
        }
        this.loadingResult = false;
      });
    },
    async getCacheList() {
      cacheList({ name: "cmdb" }).then((res) => {
        if (res.data.status === 666) {
          this.CacheList = res.data.data;
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    async refreshCdn() {
      await elConfirm(`确定刷新${this.selectedCdnItem[0]}吗？`)
        .then(() => {
          this.refreshCdnLoading = true;
          refreshCdnApi({
            domain: this.selectedCdnItem[0],
            path: this.selectedCdnItem[1],
            user: sessionStorage.getItem("user"),
          }).then((res) => {
            if (res.data.status === 666) {
              this.$message.success(`${res.data.msg}`);
            } else {
              this.$message.error(`${res.data.msg}`);
            }
            this.refreshCdnLoading = false;
          });
        })
        .catch(() => {
          this.refreshCdnLoading = false;
          this.$message.info("已取消");
        });
    },
    async clearCache() {
      await elConfirm(`确定清除${this.chooseItemCache[1]}的缓存吗？`)
        .then(() => {
          this.cacheLoading = true;
          clearCache({
            cache_name: this.chooseItemCache[0],
            path: this.chooseItemCache[1],
            user: sessionStorage.getItem("user"),
          }).then((res) => {
            if (res.data.status === 666) {
              this.$message.success(`${res.data.msg}`);
            } else {
              this.$message.error(`${res.data.msg}`);
            }
            this.cacheLoading = false;
          });
        })
        .catch(() => {
          this.cacheLoading = false;
          this.$message.info("已取消");
        });
    },
    async onOffDebug(action) {
      if (this.chooseItemCache.length < 1) {
        this.$message.error("请选择项目");
        return;
      }
      
      if (this.chooseItemCache[0] != "海外捕鱼admin") {
        this.$message.error("仅限后台操作, 其他暂不支持");
        return;
      }

      var notice = action === 1 ? "开启" : "关闭";
      await elConfirm(`确定【${notice}】${this.chooseItemCache[1]}的debug吗？`)
        .then(() => {
          this.debugLoading = true;
          onOffDebug({
            action: action,
            project: this.chooseItemCache[1],
            type: this.chooseItemCache[0],

          }).then((res) => {
            if (res.data.status === 666) {
              this.$message.success(`${res.data.msg}`);
            } else {
              this.$message.error(`${res.data.msg}`);
            }
            this.debugLoading = false;
          });
        })
        .catch(() => {
          this.debugLoading = false;
          this.$message.info("已取消");
        });
    },
    async projectSvnVersion(selector) {
      if (this.chooseItemCache.length == 0) {
        this.$message.error("请选择项目");
        return;
      }
      if (selector == 1) {
        this.pullProjectLoading = true;
      } else {
        this.debugLoading = true;
      }
      
      await checkProjectSvnVersion({
        project: this.chooseItemCache[0],
        path: this.chooseItemCache[1],
        selector: selector,
      }).then((res) => {
        if (res.data.status === 666) {
          this.$alert(res.data.data, {
            confirmButtonText: "确定",
            // callback: action => {
            //   this.$message({
            //     type: 'info',
            //     message: `action: ${ action }`
            //   });
            // }
          });
        } else {
          this.$message.error(`${res.data.msg}`);
        }
        this.debugLoading = false;
        this.pullProjectLoading = false;
      });
    },
    // 10分钟内检测传输状态
    async checkUpdateStatus(task_id) {
      await checkUpdateStatus({ name: "文件", file: "文件", task_id: task_id })
        .then((res) => {
          if (res.data.status === 666) {
            this.status = false;
            this.getWebList();
          } else if (res.data.status === -5) {
            this.status = false;
            this.getWebList();
          } else {
            this.count += 1;
            if (this.count === 10000) {
              this.getWebList();
            }
          }
        })
        .catch(() => {
          this.status = false;
        });
    },
    // 重启ftp
    async reloadProcess() {
      if (!this.project) {
        return this.$message.error("请选择项目");
      }
      await elConfirm(`确定重启${this.project}的ftp吗？`)
        .then(() => {
          this.reloadProcessStatus = true;
          processReload({ project: `${this.project}_ftp` }).then((res) => {
            if (res.data.status === 666) {
              this.$message.success(`${res.data.msg}`);
            } else {
              this.$message.error(`${res.data.msg}`);
            }
            this.reloadProcessStatus = false;
          });
        })
        .catch(() => {
          this.reloadProcessStatus = false;
          this.$message.info("已取消");
        });
    },
    selectItemCache(data) {
      // console.log(data);
    },
    handleSizeChange(newPageSize) {
      this.queryPages.pageSize = newPageSize;
      this.getWebList();
    },
    handleCurrentChange(currentPage) {
      this.queryPages.currentPage = currentPage;
      this.getWebList();
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    async downloadFile(row) {
      const resp = await downloadFile({web_id: row.id, project: row.project});
      if(resp.data.status && resp.data.status === 10002) {
        this.$message.error("下载失败, 文件不存在");
        return;
      }

      if (resp.status && resp.status == 200) {
        const url = window.URL.createObjectURL(new Blob([resp.data]));
        const link = document.createElement('a');
        link.href = url;
        let fileSplit = row.content.split("/");
        link.download = fileSplit[fileSplit.length - 1];
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        return this.$message.success("下载成功");
      }
    },
    next() {
      if (this.active++ > 1) this.active = 0;
    },
    open() {
        this.$notify({
          title: "注意",
          message: "点击搜索框可刷新表格数据",
          offset: 620,
          type: "warning",
          duration: 1800,
          position: 'top-left'
      });
    },
  },
  mounted() {
    this.initUploadData();
    this.getWebList();
    this.getCacheList();
    this.open();
    this.loadingEvent();
  },
};
</script>

<style lang="scss" scoped>
.row-el {
  overflow: hidden;
  // min-width: 1612px;
  margin-bottom: 22px;
}
.table-el {
  margin-bottom: 22px;
}
.el-input {
  width: 78%;
  right: 10%;
}
.el-tag {
  margin: 7px;
}
.level-top {
  border-top: 1px solid #eee;
}
.level-bottom {
  border-bottom: 1px solid #eee;
}
.center {
  display: flex;
  align-items: center;
}
.el-tree {
  padding: 3px 54px;
}
// .page-el {

// }
.platformAction {
  margin-bottom: 30px;
}
.uploadFile {
  width: 100%;
  margin: 15px auto;
}
.updateProcess {
  float: left;
  margin-bottom: 18px;
}
.updateProcess > * {
  display: inline-block;
  line-height: 7px;
  width: auto;
  text-align: center;
  margin: 5px 12px;
}
.tip-gap {
  font-size: 12px;
  margin: 1px 4px;
}
.set-position {
  right: 0;
}
.set-sure {
  margin-top: 7px;
}
.set-tag-inline {
  display: inline-block;
}
.set-tag-height {
  margin-top: 10px;
}
.look-good-1 {
  min-width: 265px;
}
.look-good-2 {
  min-width: 248px;
  position: relative;
  right: 79px;
}
.look-good {
  position: relative;
  right: 68px;
  min-width: 390px;
}
.layout-bottom {
  margin-bottom: 8px;
}
.content-layout-height {
  height: 600px;
}
.content-height {
  height: 500px;
  overflow: auto;
}
.look-good-button {
  position: relative;
  right: 50px;
}
::v-deep .el-dialog {
  width: 58%;
}
::v-deep .CodeMirror {
  height: 533px;
}
::v-deep .CodeMirror-code {
  text-align: justify;
  font-size: 17px;
}
.format-code {
  height: 533px;
  text-align: justify;
  font-size: 17px;
  overflow: auto;
  color: #c3c3c3;
  background-color: #292828;
  padding: 6px 12px;
  box-sizing: border-box;
  width: auto;
}
.color-look {
  margin: auto 8px;
}
.select-look {
  float: left;
  margin-bottom: 22px;
}
.change-button {
  line-height: 7px;
}

// new css
.col-1 {
  width: 350px;
  // padding-right: 0 !important;
}

@media only screen and (max-width: 1441px) {
  .col-1 {
    width: 250px;
  }
}
.col-1 div {
  width: 100%;
  margin-left: 33px;
}
@media only screen and (max-width: 1441px) {
  .col-1 div {
    width: 100%;
    margin-left: 23px;
  }
}
.col-2 {
  width: 350px;
}
@media only screen and (max-width: 1441px) {
  .col-2 {
    width: 250px;
  }
}
.col-2 div {
  width: 100%;
  margin-left: 4px;
}
.col-3 {
  width: 240px;
}
.col-3 div {
  margin-left: 6px;
  width: 100%;
}
.col-4 {
  width: 140px;
  margin-left: 15px;
}
.col-5 {
  width: 140px;
  margin-left: 13px;
}
.refresh-svn button {
    height: 34px;
    line-height: 8px;
}
::v-deep .el-upload__tip {
  	color: rgb(189, 59, 59);
  	.cus-el-upload {
		margin: 10px 0;
	}
}
.sure {
  margin-left: 0!important;
}
.sure-1 {
  margin-top: 16px;
}
.boot {
  font-size: 12px;
    position: relative;
    top: 14px;
}
.change {
  position: relative;
  right: 9px;
}
.format-code-1 {
  white-space: break-spaces;
}
.ep-notic {
  margin-top: 10px;
  .content {
    font-size: 11px;
    color: #df4a4a;
  }
}
::v-deep .el-upload-dragger {
  display: flex;
  justify-content: center;
  align-items: center;
  .cus-el-upload {
    margin-top: 31px;
  }
}
.cus-progress {
  margin: 8px 169px;
}
</style>
