<template>
  <div>
    <el-card class="platformAction">
      <el-divider><strong><i class="el-icon-s-cooperation"></i>平台操作</strong></el-divider>
      <div class="actions">
        <div class="uploadFile">
        <el-upload
          class="upload-demo"
          ref="upload"
          :action="uploadUrl()"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :file-list="fileList"
          :auto-upload="false"
          :data="fileDate"
          :on-success="uploadSuccess"
          :on-error="uploadError"
        >
          <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
          <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
          <div slot="tip" class="el-upload__tip">
            <el-link type="info" class="tip-gap" :underline="false" >每次只能上传一个文件</el-link>
            <el-popover
              placement="right"
              width="331"
              trigger="click"
              v-model="visible"
              >
              <div>
                <el-input v-model="values" placeholder="请输入文件名" class="set-position"></el-input>
              </div>
              <div class="set-tag-height">
                <el-row type="flex" justify="space-around">
                  <el-col :span="8" v-for="(pac, index) in packageList" :key="index">
                    <el-tag class="tag-el-p" type="success" effect="plain" size="mini" @click="handleStuff(pac)">{{ pac }}</el-tag>
                  </el-col>
                </el-row>
              </div>
              <div class="set-sure">
                <el-button size="mini" type="primary" @click="changeFileName">确定</el-button>
              </div>
              <el-link type="success" class="tip-gap" slot="reference">修改文件名</el-link>
            </el-popover>
          </div>
        </el-upload>
      </div>
        <div class="updateProcess">
        <el-button type="warning" plain @click="updatePackage('更新游戏包')">更新游戏包</el-button>
      </div>
      </div>
      <div class="pro-progress" v-if="beginShowProgress">
        <el-progress :percentage="uploadProgress"></el-progress>
      </div>
    </el-card>
    <el-card class="box-card">
      <!---搜索--->
      <div class="row-el">
        <el-row :gutter="10">
          <el-col :span="5">
            <el-input placeholder="请输入内容" v-model="queryPages.search" suffix-icon="el-icon-date" clearable @click.native="getPlatformList">
              <el-button slot="append" icon="el-icon-search"></el-button>
            </el-input>
          </el-col>
          <el-col :span="2" class="wd">
            <el-button type="primary"  @click="AddFormVisible = true">
            <i class="el-icon-circle-plus-outline"></i> 添加平台
            </el-button>
          </el-col>
          <el-col :span="2" class="wd col-3">
            <el-button type="danger" @click="DeleteSelectedPlatform">
              <i class="el-icon-delete"></i> 批量删除
            </el-button>
          </el-col>
        </el-row>
      </div>
      <!--平台列表-->
      <div class="table-el">
        <el-table :data="platformList" border strip v-loading="loading" :header-cell-style="{background: '#FAFAFA'}" @selection-change="handleSelectionChange" element-loading-text="拼命加载中">
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column prop="id" label="id"></el-table-column>
          <el-table-column prop="name" label="项目"></el-table-column>
          <el-table-column prop="desc" label="描述" width="220"></el-table-column>
          <el-table-column prop="cdn_domain" label="cdn域名" width="230"></el-table-column>
          <el-table-column prop="updated_date" label="更新时间" width="180"></el-table-column>
          <el-table-column fixed="right" label="操作" width="380">
            <template slot-scope="scope">
              <el-button size="mini" type="info" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
              <el-button size="mini" type="danger" @click="delPlatform(scope.$index, scope.row)">删除</el-button>
              <el-button size="mini" type="primary" @click="handleCheck(scope.$index, scope.row)">下载明细</el-button>
              <el-button slot="reference" size="mini" type="primary" @click="fileStatus(scope.row)">查询文件状态</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!---分页--->
      <div class="page-el">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryPages.currentPage"
          :page-sizes="[10, 20, 30, 40, 50]"
          :page-size="queryPages.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total_platform">
        </el-pagination>
      </div>
    </el-card>
    <el-dialog title="添加平台" :visible.sync="AddFormVisible">
        <el-form :model="form" status-icon :rules="rules" ref="form">
          <el-form-item prop="name" label="平台名" :label-width="formLabelWidth">
            <el-input placeholder="请输入平台名" clearable class="el-input" v-model="form.name" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item prop="desc" label="平台描述" :label-width="formLabelWidth">
            <el-input placeholder="请输入平台描述" clearable class="el-input" v-model="form.desc" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item prop="cdn_domain" label="cdn域名" :label-width="formLabelWidth">
            <el-input placeholder="请输入cdn域名" clearable class="el-input" v-model="form.cdn_domain" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="AddFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="addPlatform('form')">确 定</el-button>
        </div>
      </el-dialog>
    <el-dialog title="编辑平台" :visible.sync="EditFormVisible">
          <el-form :model="form" status-icon :rules="rules" ref="form">
          <el-form-item prop="name" label="平台名" :label-width="formLabelWidth">
            <el-input placeholder="请输入平台名" :disabled="true" clearable class="el-input" v-model="form.name" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item prop="desc" label="平台描述" :label-width="formLabelWidth">
            <el-input placeholder="请输入平台描述" clearable class="el-input" v-model="form.desc" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item prop="cdn_domain" label="cdn域名" :label-width="formLabelWidth">
            <el-input placeholder="请输入cdn域名" clearable class="el-input" v-model="form.cdn_domain" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="EditFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="editPlatform('form')">确 定</el-button>
        </div>
        </el-dialog>
    <el-dialog title="查询下载明细" :visible.sync="checkVisible">
        <el-form :model="form" status-icon :rules="rules" ref="form">
          <el-form-item prop="name" label="平台名" :label-width="formLabelWidth">
            <el-input placeholder="请输入平台名" :disabled="true" clearable class="el-input" v-model="form.name" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item prop="cdn_domain" label="cdn域名" :label-width="formLabelWidth">
            <el-input placeholder="请输入cdn域名" :disabled="true" clearable class="el-input" v-model="form.cdn_domain" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="时间" :label-width="formLabelWidth">
            <div class="block">
              <el-date-picker
                v-model="value2"
                type="daterange"
                align="right"
                unlink-panels
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :picker-options="pickerOptions"
                value-format="yyyy-MM-dd"
                class="date-el"
              >
              </el-date-picker>
            </div>
          </el-form-item>
        </el-form>
        <div v-loading="downloadLoading" element-loading-text="拼命统计中"
              element-loading-spinner="el-icon-loading">
          <div>
            <p>游戏包下载的每天统计</p>
            <GChart
              type="ColumnChart"
              :data="chartData"
              :options="chartOptionTwo"
            />
          </div>
<!--          <div>-->
<!--            <p>游戏包下载的累计统计</p>-->
<!--            <apexchart width="500" type="bar" :options="chartOptions" :series="series"></apexchart>-->
<!--          </div>-->
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="checkVisible = false">取 消</el-button>
          <el-button type="primary" @click="checkDownload('form')">查 询</el-button>
        </div>
        </el-dialog>
    <el-dialog  :visible.sync="checkFileStatusVisible">
      <el-descriptions class="margin-top" title="查询文件状态" :column="3" :size="size" border>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-files"></i>
            文件名
          </template>
          <el-tag v-loading="fileInfo">{{ fileStatusInfo.file }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-time"></i>
            上传时间
          </template>
          <el-tag v-loading="fileInfo">{{ fileStatusInfo.time }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-news"></i>
            文件大小
          </template>
          <el-tag v-loading="fileInfo">{{ fileStatusInfo.file_size }}</el-tag>
        </el-descriptions-item>
      </el-descriptions>
    </el-dialog>
  </div>
</template>

<script>
import { platformList, editPlatform, addPlatform, delPlatform, checkUpdateStatus, countDownload, checkFileStatus } from '@/api'
import { elConfirm } from '@/modules'
import Nprogress from "nprogress"
import baseUrl from '../../utlis/baseUrl'
import apexchart from 'vue-apexcharts'
import { GChart } from 'vue-google-charts'

export default {
  name: 'platformList',
  data () {
    var validatePlatformName = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入平台名'))
      }
      callback()
    };
    var validatePlatformDesc = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入平台描述'))
      }
      callback()
    };
    var validatePlatformCdn = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入cdn域名'))
      }
      callback()
    };
    return {
      AddFormVisible: false,
      EditFormVisible: false,
      checkVisible: false,
      visible: false,
      loading: true,
      checkFileStatusVisible: false,
      downloadLoading: false,
      total_platform: 10,
      formLabelWidth: '120px',
      url: "",
      values: "",
      value2: "",
      fileName: '',
      size: "",
      status: true,
      uploadStatus: 0,
      uploadProgress: 0,
      beginShowProgress: false,
      fileInfo: false,
      count: 0,
      multipleSelection: [],
      fileList: [],
      fileStatusInfo: [],
      platformList: [],
      parent_id: [],
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          }
        }]
      },
      packageList: ['fish.ipa', 'mhfish.ipa', 'kbfish.ipa', 'fish_sougou.ipa'],
      fileDate: {
        user: '',
        token: '',
        name: '',
        fileName: ''
      },
      form: {
        name: '',
        desc: '',
        cdn_domain: '',
      },
      rules: {
        name: [
          { validator: validatePlatformName, trigger: 'blur' },
        ],
        desc: [
          { validator: validatePlatformDesc, trigger: 'blur' },
        ],
        cdn_domain: [
          { validator: validatePlatformCdn, trigger: 'blur' },
        ]
      },
      queryPages: {
        currentPage: 1,
        pageSize: 10,
        search: ''
      },
      chartOptions: {
        chart: {
          id: 'vuechart-example'
        },
        xaxis: {
          categories: ['成功', '失败', '总共']
        }
      },
      series: [{
        name: '游戏包下载情况',
        data: []
      }],
      chartData: [
        ['时间', '成功', '失败', '总的'],
      ],
      chartOptionTwo: {
        chart: {
          title: 'Company Performance',
          subtitle: 'Sales, Expenses, and Profit: 2014-2017',
        }
      }
    }
  },
  components: {
    // apexchart,
    GChart,
  },
  methods: {
    async editPlatform (formName) {
      await this.$refs[formName].validate((valid) => {
        if (!valid) return;
        elConfirm(`确定修改${this.form.name}吗？`).then(() => {
          editPlatform(this.form).then(res => {
            if (res.data.status === 666) {
                this.getPlatformList();
                this.$message.success(res.data.msg)
              } else {
                this.$message.error(res.data.msg)
              }
          })
        }).catch(() => {
          this.$message.info('已取消')
        })
      })
    },
    async delPlatform (index, row) {
      await elConfirm(`确定删除${row.name}吗？`).then(() => {
        delPlatform(
          { id: JSON.stringify([row.id]) }
          ).then(res => {
          if (res.data.status === 666) {
            this.getPlatformList();
            this.$message.success(`${res.data.msg}`)
          } else {
            this.$message.error(`${res.data.msg}`)
          }
        })
      }).catch(() => {
        this.$message.info('已取消')
      })
    },
    async DeleteSelectedPlatform () {
      if (this.multipleSelection.length === 0) {
        return this.$message.error('请先勾选需要删除的平台.')
      }
      var platform_list = [];
      for (let i = 0; i < this.multipleSelection.length; i++) {
        platform_list.push(this.multipleSelection[i].id)
      }
      await elConfirm(`确定删除吗？`).then(() => {
        delPlatform(
          { id: JSON.stringify(platform_list) }
          ).then(res => {
          if (res.data.status === 666) {
            this.getPlatformList();
            this.$message.success(`${res.data.msg}`);
          } else {
            this.$message.error(`${res.data.msg}`);
          }
        })
      }).catch(() => {
        this.$message.info('已取消')
      })
    },
    async addPlatform (formName){
      await this.$refs[formName].validate((valid) => {
        if (!valid) return;
        elConfirm(`确定添加${this.form.name}吗？`).then(() => {
          addPlatform(
              this.form
          ).then(res => {
            if (res.data.status === 666) {
              this.getPlatformList();
              this.$message.success(res.data.msg)
            } else {
              this.$message.error(res.data.msg)
            }
          })
        }).catch(() => {
            this.$message.info('已取消')
          })
      })
    },
    async getPlatformList () {
      this.loading = true;
      await platformList({
        search: this.queryPages.search,
        size: this.queryPages.pageSize,
        page: this.queryPages.currentPage,
      }).then(res => {
        this.platformList = res.data.data;
        this.total_platform = res.data.total_platform;
        this.loading = false;
      })
    },
    // 10分钟内检测传输状态
    async checkUpdateStatus (file, task_id) {
      await checkUpdateStatus({name: this.multipleSelection[0].name, file: file, task_id: task_id}).then(res => {
        if (res.data.status === 666) {
          this.status = false;
          Nprogress.done();
          this.$message.success({
            duration: 30000,
            showClose: true,
            message: res.data.msg,
            type: 'warning'
          });
        }
        else if (res.data.status === -5) {
          this.status = false;
          Nprogress.done();
          this.$message.error({
            duration: 0,
            showClose: true,
            message: res.data.msg,
          });
        }
        else {
          this.count += 1;
          if (this.count===60) {
            this.$message.error({
              duration: 30000,
              showClose: true,
              message: `上传${file}到外网失败`,
            });
            Nprogress.done();
          }
        }
      }).catch(() => {
        this.status = false;
      })
    },
    // 统计ipa包下载
    async checkDownload () {
      if (!this.value2) {
        return this.$message.error('请输入起始跟结束日期.')
      }
      this.downloadLoading = true;
      let start = "", end = "";
      if (this.value2) {
        start = this.value2[0];
        end = this.value2[1];
      } else {
        start = '';
        end = '';
      }
      await countDownload({
        name: this.form.name,
        start: start,
        end: end
      }).then(res =>{
        if (res.data.status === 666) {
          // this.series = res.data.data;
          this.chartData = res.data.data_e;
          this.$message.success(res.data.msg);
        } else {
          this.$message.error(res.data.msg);
        }
        this.downloadLoading = false;
      })
    },
    // 查询ftp上的文件状态
    async fileStatus (row) {
      if (this.$refs.upload.uploadFiles.length === 0) {
        return this.$message.error('请先选择文件')
      }
      this.checkFileStatusVisible = true;
      this.fileStatusInfo = "";
      this.fileInfo = true;
      await checkFileStatus({name: row.name, file: this.$refs.upload.uploadFiles[0].name}).then(res => {
        if (res.data.status === 666) {
          this.fileStatusInfo = res.data.data;
        } else {
          this.$message.error(res.data.msg)
        }
        this.fileInfo = false;
      })
    },
    // 更新游戏包
    updatePackage (title) {
      if (this.multipleSelection.length === 0) {
        return this.$message.error('请先勾选需要更新的平台.')
      }
      if (this.multipleSelection.length !== 1) {
        return this.$message.error('更新游戏包只能勾选一个平台.')
      }
      elConfirm(`确定更新吗？`).then(() =>{
        let routeData = this.$router.resolve(
          { path: `/platforms/update/${this.multipleSelection[0].name}/${title}/${this.fileName}/${this.multipleSelection[0].cdn_domain}` }
          );
        window.open(routeData.href, '_blank');
      }).catch(() => {
        this.$message.info('已取消')
      })
    },
    // 上传文件
    submitUpload() {
      if (this.multipleSelection.length === 0) {
        return this.$message.error('请先勾选平台.')
      }
      if (this.multipleSelection.length !== 1) {
        return this.$message.error('上传文件只能勾选一个平台.')
      }
      if (this.$refs.upload.uploadFiles.length === 0) {
        return this.$message.error('请先选择文件')
      }
      this.fileDate.name = this.multipleSelection[0].name;
      this.fileDate.fileName = this.values;
      this.fileDate.user = sessionStorage.getItem('user');
      this.fileDate.token = sessionStorage.getItem('token');
      this.$refs.upload.submit();
    },
    uploadError(err) {
      this.$message.error(err)
    },
    // 上传成功后回调
    uploadSuccess(response, file) {
      this.values = '';
      this.fileName = file.name;
      let that = this;
      if(response.status === 666){
        this.$message.warning({
          duration: 3000,
          showClose: true,
          message: `正在上传${this.fileName}到外网....`,
          type: 'warning'
        });
        Nprogress.start();
        // 这里是把上传到服务器的文件，再通过ftp传到其他服务器上（循环检测传输情况）
        let setI = setInterval(function () {
          if(that.status && that.count < 60) {
            that.checkUpdateStatus(file.name, response.data)
          } else {
            that.status = true;
            that.count = 0;
            clearInterval(setI);
          }
        }, 5000)
      } else {
        this.$message.error(response.msg);
      }
    },
    // 修改文件名
    changeFileName() {
      this.visible = false;
      if (this.$refs.upload.uploadFiles.length === 0) {
        return this.$message.error('请先选择文件')
      }
      if (this.values) {
        this.$refs.upload.uploadFiles[0].name = this.values
      }
    },
    handleSizeChange (newPageSize) {
      this.queryPages.pageSize = newPageSize;
      this.getPlatformList()
    },
    handleCurrentChange (currentPage) {
      this.queryPages.currentPage = currentPage;
      this.getPlatformList()
    },
    handleEdit (index, row) {
      this.EditFormVisible = true;
      this.form.name = row.name;
    },
    handleCheck (index, row) {
      this.checkVisible = true;
      this.downloadLoading = false;
      this.form.name = row.name;
      this.form.cdn_domain = row.cdn_domain;
    },
    handleRemove(file, fileList) {
      this.fileName = '';
      this.uploadStatus = 0;
      console.log(file, fileList);
    },
    handleSelectionChange (val) {
      this.multipleSelection = val;
    },
    handlePreview(file) {
      console.log(file, this.$refs.upload.uploadFiles[0].name);
    },
    // 点击文字填充到input
    handleStuff(n) {
      this.values = n
    },
    uploadUrl() {
      return `${baseUrl}/platforms/file/`
    }
  },
  mounted () {
    this.getPlatformList()
  }
}
</script>

<style lang="scss" scoped>
.row-el {
  min-width: 1621px;
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
.page-el {

}
.platformAction {
  margin-bottom: 30px;
}
.uploadFile {
  //width: 30%;
  margin: 0 auto;
}
.updateProcess{
  margin-top: 10px;
  margin-bottom: 12px;
}
.updateProcess > *{
  display: inline-block;
  line-height: 7px;
  width: auto;
  text-align: center;
  margin: 5px 10px;
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
.pro-progress {
  width: 32%;
  margin: 0 auto;
}
.tag-el-p {
  cursor: pointer;
}
.block {
  margin-left: 8px;
  float: left;
  width: 78%;
}
.date-el {
  width: 100%;
}
::v-deep #apexchartsvuechartxexample {
  margin: 0 auto;
}
::v-deep .el-form-item {
  margin-left: 63px;
}
.wd{
  position: relative;
  left: -66px;
}
.actions {
  float: left;
}
::v-deep .el-col-5 {
  width: 380px;
}
::v-deep .el-col-2 {
  width: 119px!important;
}
.col-3 {
  padding-left: 26px!important;
}
</style>
