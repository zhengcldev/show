<template>
  <div>
    <el-table :data="tableData" style="width: 100%" stripe="true">
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
      dialogFormVisible: false,
      formLabelWidth: '120px',
    }
  },
  created() {
    this.getRequest('/skyline/getDataset', null).then(resp => {
      if (resp.data.data) {
        this.tableData = resp.data.data;
      }
    })
  },
  methods: {
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

<style>

</style>
