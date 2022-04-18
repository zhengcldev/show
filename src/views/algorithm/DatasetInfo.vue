<template>
  <div>
    <el-form>
      <el-form :inline="true">
        <el-form-item label="数据集名" label-width="90px" required="true" class="white-space">
          <el-input style="width: 200px" v-model="addForm.dataName" placeholder="必填字段，数据集名"></el-input>
        </el-form-item>
        <el-form-item label="描述" label-width="100px" class="white-space">
          <el-input style="width: 200px" v-model="addForm.description" placeholder="数据集基本描述"></el-input>
        </el-form-item>
        <el-form-item style="margin-left: 20px;margin-right: 20px" label="是否真实数据集" required="true" label-width="100px"
                      class="white-space">
          <el-radio style="margin-left: 15px;margin-right: 10px" v-model="addForm.isReal" label="1">是</el-radio>
          <el-radio v-model="addForm.isReal" label="0">否</el-radio>
        </el-form-item>
        <el-form-item label="事务条数" required="true" label-width="100px" class="white-space">
          <el-input style="width: 200px" v-model="addForm.transCount" placeholder="请输入事务条数"></el-input>
        </el-form-item>
      </el-form>

      <el-form :inline="true">
        <el-form-item label="不同项数量" label-width="90px" required="true" class="white-space">
          <el-input style="width: 200px" v-model="addForm.itemCount" placeholder="请输入不同项数量"></el-input>
        </el-form-item>
        <el-form-item label="平均事务长度" label-width="100px" required="true" class="white-space">
          <el-input style="width: 200px" v-model="addForm.avgTransLen" placeholder="请输入平均事务长度"></el-input>
        </el-form-item>
        <el-form-item style="margin-left: 20px;margin-right: 20px" label="是否稀疏数据集" required="true" label-width="100px"
                      class="white-space">
          <el-radio style="margin-left: 15px;margin-right: 10px" v-model="addForm.isSparse" label="1">是</el-radio>
          <el-radio v-model="addForm.isSparse" label="0">否</el-radio>
        </el-form-item>
        <el-form-item label="最大事务长度" required="true" label-width="100px" class="white-space">
          <el-input style="width: 200px" v-model="addForm.maxTransLen" placeholder="请输入最大事务长度"></el-input>
        </el-form-item>
      </el-form>
      <el-form :inline="true">
        <el-form-item>
          <el-upload
              ref="uploadTxt"
              action=""
              :limit="limitNum"
              :auto-upload="false"
              accept=".txt"
              :before-upload="beforeUploadFile"
              :on-change="fileChange"
              :on-exceed="exceedFile"
              :on-success="handleSuccess"
              :file-list="fileList"
              :data="qqq"
          >
            <el-button size="small" plain>选择数据集</el-button>
            <div slot="tip" class="el-upload__tip">
              只能上传txt文件，且不超过50M
            </div>
          </el-upload>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="uploadClick">立即上传</el-button>
        </el-form-item>
      </el-form>
    </el-form>
    <div>
      <el-table :data="tableData" style="width: 100%"
                stripe="true">
        <el-table-column prop="id" label="id" sortable width="60px" align="center"></el-table-column>
        <el-table-column prop="dataName" label="数据集名称" width="120px" align="center"></el-table-column>
        <el-table-column prop="description" label="描述" width="100px" align="center"></el-table-column>
        <el-table-column prop="isSparse" label="是否稀疏" width="100px" align="center">
          <template slot-scope="scope">
            <span v-if=" scope.row.isSparse=== 0 ">否</span>
            <span v-else>是</span>
          </template>
        </el-table-column>
        <el-table-column prop="transCount" sortable label="事务条数" width="110px" align="center"></el-table-column>
        <el-table-column prop="itemCount" sortable label="不同项数量" width="120px" align="center"></el-table-column>
        <el-table-column prop="avgTransLen" sortable label="平均事务长度" width="130px" align="center"></el-table-column>
        <el-table-column prop="maxTransLen" sortable label="最大事务长度" width="130px" align="center"></el-table-column>
        <el-table-column prop="isReal" label="真实数据集" width="100px" align="center">
          <template slot-scope="scope">
            <span v-if=" scope.row.isReal=== 0 ">否</span>
            <span v-else>是</span>
          </template>
        </el-table-column>
        <el-table-column prop="addTime" sortable label="添加时间" align="center" :formatter="formatDate"></el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
          background
          :current-page="currentPage"
          :page-size="pageSize"
          :total="totalListMedia"
          :page-sizes="[3, 5, 10, 20, 30,40,50]"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
          layout="total, sizes, prev, pager, next, jumper"/>
    </div>
    <el-dialog title="编辑数据集" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="数据集名称" :label-width="formLabelWidth">
          <el-input v-model="form.dataName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="描述" :label-width="formLabelWidth">
          <el-input v-model="form.description" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="是否稀疏" :label-width="formLabelWidth">
          <el-select v-model="form.isSparse" placeholder="是否稀疏数据集">
            <el-option label="是" value="1"></el-option>
            <el-option label="否" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="事务条数" :label-width="formLabelWidth">
          <el-input v-model="form.transCount" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="不同项数量" :label-width="formLabelWidth">
          <el-input v-model="form.itemCount" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="平均事务长度" :label-width="formLabelWidth">
          <el-input v-model="form.avgTransLen" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="最大事务长度" :label-width="formLabelWidth">
          <el-input v-model="form.maxTransLen" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="真实数据集" :label-width="formLabelWidth">
          <el-select v-model="form.isReal" placeholder="是否真实数据集">
            <el-option label="是" value="1"></el-option>
            <el-option label="否" value="0"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="onEdit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableData: [],
      limitNum: 1,
      fileList: [],
      totalListMedia: 0, //分页单页显示条数
      MediaList: [], // 接口数据
      currentPage: 1, //  el-pagination 第几页
      pageSize: 3, //  el-pagination 每页的数据
      addForm: {
        dataName: '',
        description: '',
        isSparse: '',
        transCount: '',
        itemCount: '',
        avgTransLen: '',
        maxTransLen: '',
        isReal: '',
        addTime: '',
        dataUrl: '',
      },
      form: {
        id: '',
        dataName: '',
        description: '',
        isSparse: '',
        transCount: '',
        itemCount: '',
        avgTransLen: '',
        maxTransLen: '',
        isReal: '',
        addTime: ''
      },
      requestForm:{
        currentPage:'',
        pageSize:'',
      },
      dialogFormVisible: false,
      formLabelWidth: '120px',
    }
  },
  created() {
    this.addData(this.currentPage, this.pageSize);
  },
  methods: {
    addData(page, size) {
      this.requestForm.currentPage=page;
      this.requestForm.pageSize=size;
      this.postRequest('/skyline/getDataset', this.requestForm).then(resp => {
        if (resp.data.data) {
          this.tableData = resp.data.data.list;
          this.totalListMedia = resp.data.data.total;
        }
      })
    },
    //改变分页单页显示条数
    handleSizeChange(size) {
      this.pageSize = size
      // 每次改变页码大小,重定向第一页
      this.currentPage = 1
      // 调用接口数据
      this.addData(this.currentPage, this.pageSize)
    },
    // 点击第几页把页码传进来，发送接口请求改变数据
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage
      // 调用接口数据
      this.addData(this.currentPage, this.pageSize)
    },
    uploadClick() {
      this.$refs.uploadTxt.submit();
      this.addForm.addTime = new Date().getTime();
      //this.addForm.addName = sessionStorage.getItem("userId");
      this.addForm.addName =this.$cookies.get("userId");
      this.postRequest("/skyline/insertDataset", this.addForm).then(resp => {
        if (resp.data.data) {
          //this.$message.success("数据集" + this.addForm.dataName + "添加成功");
          this.addForm = {};
        } else {
          this.$message.error("数据集添加失败");
        }
      })
    },
    // 上传文件之前的钩子, 参数为上传的文件,若返回 false 或者返回 Promise 且被 reject，则停止上传
    beforeUploadFile(file) {
      // console.log(file)
      const extension = file.name.substring(file.name.lastIndexOf('.') + 1)
      const size = file.size / 1024 / 1024
      if (extension !== 'txt') {
        this.$notify.warning({
          title: '警告',
          message: `只能上传txt（即后缀是.txt）的文件`
        })
      }
      if (size > 50) {
        this.$notify.warning({
          title: '警告',
          message: `文件大小不得超过50M`
        })
      }
      let fd = new FormData();//通过form数据格式来传
      fd.append("dataset", file); //传文件
      this.postRequest("/skyline/datasetUpload", fd).then(resp => {
        this.$message.success(file.name);
      });
    },
    // 文件状态改变时的钩子
    fileChange(file, fileList) {
      // console.log(file)
      // console.log(fileList)
    },
    // 文件超出个数限制时的钩子
    exceedFile(files, fileList) {
      this.$notify.warning({
        title: '警告',
        message: `只能选择 ${
            this.limitNum
        } 个文件，当前共选择了 ${files.length + fileList.length} 个`
      })
    },
    // 文件上传成功时的钩子
    handleSuccess(res, file, fileList) {
      console.log(res)
      // this.formData.url = res.data  //服务器返回的文件地址
      this.$message({
        message: '文件上传成功',
        type: 'success'
      })
      this.$refs.uploadTxt.clearFiles()// 清除上次上传记录
    },
    // 文件上传失败时的钩子
    handleError(err, file, fileList) {
      this.$message.error(err.msg)
    },
    handleEdit(index, row) {
      this.dialogFormVisible = true;
      this.form.id = row.id;
    },
    onEdit() {
      this.dialogFormVisible = false;
      this.postRequest('/skyline/updateDataset', this.form).then(resp => {
        if (resp.data.data != null) {
          this.$message.success("数据集信息更新成功");
          setTimeout(function () {
            location.reload()
          }, 2000);
          this.form = {};
        } else {
          this.$message.error("数据集信息更新失败");
        }
      })
    },
    handleDelete(index, row) {
      let params = {id: row.id};
      this.deleteRequest('/skyline/deleteDataset', params).then(resp => {
        if (resp.data.data) {
          this.$message.success("数据集删除成功");
          setTimeout(function () {
            location.reload()
          }, 2000);
        } else {
          this.$message.error("数据集删除失败");
        }
      })
    }
    ,
    formatDate(row, column) {
      let date = new Date(parseInt(row.addTime));
      let Y = date.getFullYear() + '-';
      let M = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) + '-' : date.getMonth() + 1 + '-';
      let D = date.getDate() < 10 ? '0' + date.getDate() + ' ' : date.getDate() + ' ';
      let h = date.getHours() < 10 ? '0' + date.getHours() + ':' : date.getHours() + ':';
      let m = date.getMinutes() < 10 ? '0' + date.getMinutes() + ':' : date.getMinutes() + ':';
      let s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
      return Y + M + D + h + m + s;
    }
  }
}
</script>

<style lang="scss">
.white-space {
  white-space: pre
}
</style>
