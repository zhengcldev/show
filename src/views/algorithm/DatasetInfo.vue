<template>
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
    <el-table-column prop="transCount" sortable label="交易条数" width="110px" align="center"></el-table-column>
    <el-table-column prop="itemCount" sortable label="不同项数量" width="120px" align="center"></el-table-column>
    <el-table-column prop="avgTransLen" sortable label="平均交易长度" width="130px" align="center"></el-table-column>
    <el-table-column prop="maxTransLen" sortable label="最大交易长度" width="130px" align="center"></el-table-column>
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
</template>

<script>
export default {
  data() {
    return {
      tableData: []
    }
  },
  created() {
    this.getRequest('/skyline/getDataset',null).then(resp=>{
      if(resp.data.data){
        this.tableData=resp.data.data;      }
    })
  },
  methods: {
    handleEdit(index, row) {
      console.log(index, row);
    },
    handleDelete(index, row) {
      console.log(index, row);
    },
    formatDate(row, column) {
      let date = new Date(parseInt(row.addTime));
      let Y = date.getFullYear() + '-';
      let M = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) + '-' : date.getMonth() + 1 + '-';
      let D = date.getDate() < 10 ? '0' + date.getDate() + ' ' : date.getDate() + ' ';
      let h = date.getHours() < 10 ? '0' + date.getHours() + ':' : date.getHours() + ':';
      let m = date.getMinutes()  < 10 ? '0' + date.getMinutes() + ':' : date.getMinutes() + ':';
      let s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
      return Y + M + D + h + m + s;
    }
  }
}
</script>

<style>

</style>
