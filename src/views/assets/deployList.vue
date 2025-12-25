<template>
  <div>
    <div class="action">
      <el-card>
        <div class="update">
          <el-divider><strong><i class="el-icon-s-promotion"></i>部署选项</strong></el-divider>
          <el-row :gutter="20">
            <template  v-for="(val, key) in actionName">
              <el-col :span="1.2" :key="key">
                <el-popover
                  v-if="val.action === 'DeployIntranet'"
                  placement="right"
                  width="400"
                  trigger="click"
                  v-model="visibleI">
                  <Intranet></Intranet>
                  <div style="text-align: center; margin: 0">
                    <el-button size="mini" type="text" @click="visibleI = false">取消</el-button>
                    <el-button type="primary" size="mini" @click.native="assetsArgsActions(val.action, val.name, 100)">开始部署</el-button>
                  </div>
                  <el-button type="primary" size="small" :icon="val.icon" slot="reference">{{ val.name }}</el-button>
                </el-popover>
                <el-popover
                  class="ex-col-2"
                  v-else-if="val.action === 'DeployExtranet'"
                  placement="right"
                  width="400"
                  trigger="click"
                  v-model="visibleE">
                  <Extranet></Extranet>
                  <div style="text-align: center; margin: 0">
                    <el-button size="mini" type="text" @click="visibleE = false">取消</el-button>
                    <el-button type="primary" size="mini" @click.native="assetsArgsActions(val.action, val.name, 200)">开始部署</el-button>
                  </div>
                  <el-button type="primary" size="small" :icon="val.icon" slot="reference">{{ val.name }}</el-button>
                </el-popover>
              </el-col>
            </template>
          </el-row>
        </div>
      </el-card>
    </div>
    <div class="table-data">
      <el-card>
        <el-divider><strong><i class="el-icon-s-promotion"></i>服务器列表</strong></el-divider>
        <div class="data-action">
          <el-row :gutter="20">
            <el-col :span="1" class="col-1">
              <el-input placeholder="请输入内容" v-model="queryPages.search" suffix-icon="el-icon-date" clearable @click.native="getAssetsList">
                <el-button slot="append" icon="el-icon-search"></el-button>
              </el-input>
            </el-col>
            <el-col :span="1" class="col-2">
              <el-button type="primary" icon="el-icon-circle-plus-outline" @click="addServerDialogVisible = true">添加服务器</el-button>
            </el-col>
            <el-col :span="1" class="col-3" v-if="1>2">
              <el-button type="danger" icon="el-icon-delete" @click="delAssets(null)">删除服务器</el-button>
            </el-col>
          </el-row>
        </div>
        <div class="table-data">
          <el-table :data="dataList" border strip v-loading="loading" @selection-change="handleSelectionChange" :header-cell-style="{background: '#FAFAFA'}" element-loading-text="拼命加载中">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="id" label="id"></el-table-column>
            <el-table-column prop="project" label="项目"></el-table-column>
            <el-table-column prop="ip" label="ip" width="160"></el-table-column>
            <el-table-column prop="memory" label="内存"></el-table-column>
            <el-table-column prop="cpu" label="cpu"></el-table-column>
            <el-table-column prop="disk" label="硬盘"></el-table-column>
            <el-table-column prop="os" label="操作系统" width="180"></el-table-column>
            <el-table-column prop="idc" label="idc"></el-table-column>
            <el-table-column prop="runStatus" label="更新状态" width="110">
              <template slot-scope="scope">
                <el-tag v-if="scope.row.runStatus === 100" type="info">未部署</el-tag>
                <el-tag v-if="scope.row.runStatus === 200" type="success">部署完成</el-tag>
                <el-tooltip class="item" effect="dark" content="部署中" placement="right-start">
                  <i v-if="scope.row.runStatus === 300" class="el-icon-loading" style="font-size: 17px;color: red"></i>
                </el-tooltip>
                <el-tag v-if="scope.row.runStatus === 400" type="danger">部署失败</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="updateTime" label="更新时间" width="180"></el-table-column>
            <el-table-column prop="finishedTime" label="结束时间" width="180"></el-table-column>
            <el-table-column fixed="right" label="操作" width="230">
                <template slot-scope="scope">
                  <el-button size="mini" type="info" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)">
                    编辑
                  </el-button>
                  <el-button size="mini" type="danger" icon="el-icon-delete" @click="delAssets(scope.row)">
                    删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        <div class="page">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="queryPages.currentPage"
            :page-sizes="[10, 20, 30, 40, 50]"
            :page-size="queryPages.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total_assets">
          </el-pagination>
        </div>
        <div class="add">
          <el-dialog
            title="添加服务器"
            :visible.sync="addServerDialogVisible"
            width="45%"
            center
            >
            <div class="options">
              <el-row :gutter="20" justify="center" type="flex">
                <el-col :span="7" class="titles ip-c">
                  <strong>ip:</strong>
                </el-col>
                <el-col :span="7">
                  <el-input clearable type="text" autocomplete="off" v-model="ipValue"></el-input>
                </el-col>
              </el-row>
              <el-row :gutter="20" justify="center" type="flex">
                <el-col :span="7" class="titles item-c">
                  <strong>项目:</strong>
                </el-col>
                <el-col :span="7">
                  <el-select v-model="itemValue" clearable placeholder="请选择">
                    <el-option
                      v-for="item in items"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-col>
              </el-row>
              <el-row :gutter="20" justify="center" type="flex">
                <el-col :span="7" class="titles">
                  <strong>操作系统:</strong>
                </el-col>
                <el-col :span="7">
                  <el-select v-model="osValue" clearable placeholder="请选择">
                    <el-option
                      v-for="item in system"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-col>
              </el-row>
              <el-row :gutter="20" justify="center" type="flex">
                <el-col :span="7" class="titles idc-c">
                  <strong>idc:</strong>
                </el-col>
                <el-col :span="7">
                  <el-select v-model="idcValue" clearable placeholder="请选择">
                    <el-option
                      v-for="item in idcs"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-col>
              </el-row>
              <el-row :gutter="20" justify="center" type="flex">
                <el-col :span="7" class="titles idc-c">
                  <strong>key上传:</strong>
                </el-col>
                <el-col :span="7">
                  <el-upload
                    class="upload-demo"
                    drag
                    :action="uploadUrl()"
                    :on-success="uploadSuccess"
                    :on-error="uploadError"
                    multiple
                    :data="fileName"
                    >
                    <i class="el-icon-upload"></i>
                    <div class="el-upload__text">将服务器密钥文件拖到此处，或<em>点击上传</em></div>
<!--                    <div class="el-upload__tip" slot="tip" style="color:#78b178">服务器密钥上传</div>-->
                  </el-upload>
                </el-col>
              </el-row>
              <el-row :gutter="20" justify="center" type="flex">
                <el-col :span="7" class="titles">
                  <strong>cpu:</strong>
                </el-col>
                <el-col :span="20">
                  <el-slider
                    v-model="cpuNum"
                    show-input>
                  </el-slider>
                </el-col>
              </el-row>
              <el-row :gutter="20" justify="center" type="flex">
                <el-col :span="7" class="titles">
                  <strong>内存:</strong>
                </el-col>
                <el-col :span="20">
                  <el-slider
                    v-model="memoryNum"
                    show-input>
                  </el-slider>
                </el-col>
              </el-row>
              <el-row :gutter="20" justify="center" type="flex">
                <el-col :span="7" class="titles">
                  <strong>硬盘:</strong>
                </el-col>
                <el-col :span="20">
                  <el-slider
                    v-model="diskNum"
                    show-input>
                  </el-slider>
                </el-col>
              </el-row>
            </div>
            <div slot="footer" class="dialog-footer">
              <el-button @click="addServerDialogVisible = false">取 消</el-button>
              <el-button type="primary" @click="addAssets()" :loading="addLoading">确 定</el-button>
            </div>
          </el-dialog>
        </div>
        <div class="edit">
          <el-dialog
            title="编辑服务器"
            :visible.sync="editServerDialogVisible"
            width="45%"
            center
            >
            <div class="options">
              <el-row :gutter="20" justify="center" type="flex">
                <el-col :span="7" class="titles ip-c">
                  <strong>ip:</strong>
                </el-col>
                <el-col :span="7">
                  <el-input clearable type="text" autocomplete="off" v-model="ipValue"></el-input>
                </el-col>
              </el-row>
              <el-row :gutter="20" justify="center" type="flex">
                <el-col :span="7" class="titles item-c">
                  <strong>项目:</strong>
                </el-col>
                <el-col :span="7">
                  <el-select v-model="itemValue" clearable placeholder="请选择">
                    <el-option
                      v-for="item in items"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-col>
              </el-row>
              <el-row :gutter="20" justify="center" type="flex">
                <el-col :span="7" class="titles">
                  <strong>操作系统:</strong>
                </el-col>
                <el-col :span="7">
                  <el-select v-model="osValue" clearable placeholder="请选择">
                    <el-option
                      v-for="item in system"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-col>
              </el-row>
              <el-row :gutter="20" justify="center" type="flex">
                <el-col :span="7" class="titles idc-c">
                  <strong>idc:</strong>
                </el-col>
                <el-col :span="7">
                  <el-select v-model="idcValue" clearable placeholder="请选择">
                    <el-option
                      v-for="item in idcs"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-col>
              </el-row>
              <el-row :gutter="20" justify="center" type="flex">
                <el-col :span="7" class="titles idc-c">
                  <strong>key上传:</strong>
                </el-col>
                <el-col :span="7">
                  <el-upload
                    class="upload-demo"
                    drag
                    :on-success="uploadSuccess"
                    :on-error="uploadError"
                    :action="uploadUrl()"
                    multiple
                    :data="fileName"
                  >
                    <i class="el-icon-upload"></i>
                    <div class="el-upload__text">将服务器密钥文件拖到此处，或<em>点击上传</em></div>
<!--                    <div class="el-upload__tip" slot="tip" style="color:#78b178">服务器密钥上传</div>-->
                  </el-upload>
                </el-col>
              </el-row>
              <el-row :gutter="20" justify="center" type="flex">
                <el-col :span="7" class="titles">
                  <strong>cpu:</strong>
                </el-col>
                <el-col :span="20">
                  <el-slider
                    v-model="cpuNum"
                    show-input>
                  </el-slider>
                </el-col>
              </el-row>
              <el-row :gutter="20" justify="center" type="flex">
                <el-col :span="7" class="titles">
                  <strong>内存:</strong>
                </el-col>
                <el-col :span="20">
                  <el-slider
                    v-model="memoryNum"
                    show-input>
                  </el-slider>
                </el-col>
              </el-row>
              <el-row :gutter="20" justify="center" type="flex">
                <el-col :span="7" class="titles">
                  <strong>硬盘:</strong>
                </el-col>
                <el-col :span="20">
                  <el-slider
                    v-model="diskNum"
                    show-input>
                  </el-slider>
                </el-col>
              </el-row>
            </div>
            <div slot="footer" class="dialog-footer">
              <el-button @click="editServerDialogVisible = false">取 消</el-button>
              <el-button type="primary" @click="updateAssets()" :loading="addLoading">确 定</el-button>
            </div>
          </el-dialog>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
import { assetsList, assetsAdd, assetsUpdate, assetsDelete } from '@/api';
import { elConfirm } from '@/modules'
import {filter} from "core-js/internals/array-iteration";
import Intranet from '../assets/selectItem/Intranet';
import Extranet from '../assets/selectItem/Extranet';
import baseUrl from "../../utlis/baseUrl";
import { mapState } from 'vuex';
import store from '../../store/index';

export default {
  name: 'deployList',
  data() {
    return {
      value: "",
      socket: "",
      itemValue: "",
      osValue: "",
      idcValue: "",
      ipValue: "",
      runStatus: "",
      result: [],
      dataList: [],
      multipleSelection: [],
      loading: true,
      addLoading: false,
      editLoading: false,
      addServerDialogVisible: false,
      editServerDialogVisible: false,
      visibleI: false,
      visibleE:false,
      total_assets: 10,
      cpuNum: 0,
      memoryNum: 0,
      diskNum: 0,
      activeName:'',
      //传入参数
      deployItem: {
        projectName: "",
        dbIp: "",
        dbPort: "",
        dbPassword: "",
      },
      // 更新的动作可以放到数据库里
      actionName: [
        { action: 'DeployIntranet', icon: 'el-icon-hot-water', name: '内网项目部署', index: 'first' },
        { action: 'DeployExtranet', icon: 'el-icon-bicycle', name: '外网项目部署', index: 'second' },
      ],
      items: [{
          value: 'test',
          label: 'test'
        }],
      system: [{
          value: 'centos7.6 64bit',
          label: 'centos7.6 64bit'
        },{
          value: 'centos7.9 64bit',
          label: 'centos7.9 64bit'
        }],
      idcs: [{
          value: 'tx',
          label: '腾讯'
        },{
          value: 'aliyun',
          label: '阿里云'
        }],
      fileName: {
        fileName: this.ipValue,
      },
      queryPages: {
        currentPage: 1,
        pageSize: 10,
        search: '',
      },
    };
  },
  components: {
    Intranet,
    Extranet
  },
  computed: {
    ...mapState({
      'deployData': state => state.addRouters.deployItem,
    })
  },
  mounted() {
    this.getAssetsList()
    this.fileName.user = sessionStorage.getItem('user');
    this.fileName.token = sessionStorage.getItem('token');
  },
  methods: {
    async getAssetsList () {
      this.loading = true;
      await assetsList({
        search: this.queryPages.search,
        size: this.queryPages.pageSize,
        page: this.queryPages.currentPage,
      }).then(res => {
        this.dataList = res.data.data;
        this.total_assets = res.data.total_assets;
        this.loading = false
      })
    },
    async addAssets () {
      if (!this.ipValue) {
        return this.$message.error('ip不能为空')
      }
      if (!this.itemValue) {
        return this.$message.error('项目不能为空')
      }
      await elConfirm("确定添加吗？").then(() => {
        this.addLoading = true;
        assetsAdd({
          ip: this.ipValue,
          project: this.itemValue,
          os: this.osValue,
          cpu: this.cpuNum,
          memory: this.memoryNum,
          disk: this.diskNum,
          idc: this.idcValue,
          runStatus: 100,
        }).then(res => {
          if (res.data.status === 666) {
            this.getAssetsList();
            this.$message.success(res.data.msg)
          } else {
            this.$message.error(res.data.msg)
          }
          this.addLoading = false;
        })
      }).catch( () => {
        this.addLoading = false;
        this.$message.success('操作已取消')
      })
    },
    async updateAssets () {
      if (!this.ipValue) {
        return this.$message.error('ip不能为空')
      }
      if (!this.itemValue) {
        return this.$message.error('项目不能为空')
      }
      await elConfirm("确定修改吗？").then(() => {
        this.addLoading = true;
        assetsUpdate({
          ip: this.ipValue,
          project: this.itemValue,
          os: this.osValue,
          cpu: this.cpuNum,
          memory: this.memoryNum,
          disk: this.diskNum,
          idc: this.idcValue,
          runStatus: this.runStatus,
        }).then(res => {
          if (res.data.status === 666) {
            this.getAssetsList();
            this.$message.success(res.data.msg)
          } else {
            this.$message.error(res.data.msg)
          }
          this.addLoading = false;
        })
      }).catch( () => {
        this.addLoading = false;
        this.$message.success('操作已取消')
      })
    },
    async delAssets(data) {
      let data_ = [];
      if (this.multipleSelection.length === 0) {
        if (data) {
          data_.push(data.id)
        } else {
          return this.$message.error('请勾选需要删除的ip.')
        }
      } else {
        data_ = this.multipleSelection.map(res => {return res.id})
      }
      await elConfirm("确定删除吗？").then(() => {
        assetsDelete({
          id: JSON.stringify(data_)
        }).then(res => {
          if (res.data.status === 666) {
              this.getAssetsList();
              this.$message.success(res.data.msg)
            } else {
              this.$message.error(res.data.msg)
            }
        })
        }).catch( () => {
          this.$message.success('操作已取消')
        })
    },
    async handleSizeChange (newPageSize) {
      this.queryPages.pageSize = newPageSize;
      await this.getAssetsList()
    },
    async handleCurrentChange (currentPage) {
      this.queryPages.currentPage = currentPage;
      await this.getAssetsList()
    },
    uploadUrl () {
      return `${baseUrl}/assets/upload/`
    },
    uploadSuccess (response, file) {
      if (response.status === 666) {
        this.$message.success(response.msg)
      } else {
        this.$message.error(response.msg)
      }
    },
    uploadError(err) {
      this.$message.error(err)
    },
    handleEdit (index, row) {
      this.editServerDialogVisible = true;
      this.ipValue = row.ip;
      this.itemValue = row.project;
      this.idcValue = row.idc;
      this.osValue = row.os;
      this.cpuNum = row.cpu;
      this.memoryNum = row.memory;
      this.diskNum = row.disk;
      this.runStatus = row.runStatus
    },
    handleSelectionChange (val) {
      this.multipleSelection = val;
    },
    // 输入参数更新
    assetsArgsActions (action, name, i) {
      let info = "";
      if (i === 100) {
        if (!sessionStorage.getItem('projectName')) {
          return this.$message.error('请输入项目名')
        }
        if (!sessionStorage.getItem('dbPort')) {
          return this.$message.error('请输入数据库端口')
        }
      } else if (i === 200) {
        if (!sessionStorage.getItem('projectName')) {
          return this.$message.error('请输入项目名')
        }
        if (!sessionStorage.getItem('dbPort')) {
          return this.$message.error('请输入数据库端口')
        }
        if (!sessionStorage.getItem('dbIp')) {
          return this.$message.error('请输入数据库master ip')
        }
        if (!sessionStorage.getItem('slaveIp')) {
          return this.$message.error('请输入数据库slave ip')
        }
        if (!sessionStorage.getItem('dbPassword')) {
          return this.$message.error('请输入数据库密码')
        }
        if (!sessionStorage.getItem('gameIp')) {
          return this.$message.error('请输入游戏中心服ip')
        }
        if (!sessionStorage.getItem('frontIp')) {
          return this.$message.error('请输入前置机ip')
        }
        if (!sessionStorage.getItem('rw')) {
          return this.$message.error('请选择是否开启主从')
        }
      } else {
        return this.$message.error('参数不合法')
      }
      info = sessionStorage.getItem('projectName')
      if (this.multipleSelection.length === 0) {
        return this.$message.error('请先勾选需要部署的服务器.')
      }
      elConfirm(`确定部署【${info}】吗？`).then(() =>{
        for (let i=0; i<this.multipleSelection.length; i++) {
          let routeData = this.$router.resolve(
            { path: `/assets/deploy/${this.multipleSelection[i].project}/${this.multipleSelection[i].ip}/${action}` }
            );
          window.open(routeData.href, '_blank');
        }
      }).catch( () => {
        this.$message.success('操作已取消')
      })
    },
  }
}
</script>

<style lang="scss" scoped>
.action {
  margin-bottom: 22px;
  min-width: 1612px;
}
.data-action {
  min-width: 1612px;
  margin-bottom: 22px;
}
.table-el {
  margin-bottom: 22px;
}
.page {
  margin-top: 22px;
}
::v-deep .el-col-7 {
  width: auto;
}
.titles {
  line-height: 40px;
  margin-bottom: 22px;
}
.ip-c {
  margin-right: 43px;
}
.item-c {
  margin-right: 27px;
}
.idc-c {
  margin-right: 36px;
}
::v-deep .el-dialog__title {
  font-weight: 700;
}
.select {
  margin-left: 45px;
}
.select > * {
  margin: 14px 0;
  line-height: 46px;
}
.notice {
  color: #e55656;
  font-size: 8px;
}
.ex-col-2 {
  margin-left: 18px;
}
.col-1 {
  width: 300px;
}
.col-2 {
  margin-left: 6px;
}
.col-3 {
  margin-left: 81px;
}
</style>
