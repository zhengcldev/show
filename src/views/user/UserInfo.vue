<template>
  <div>
    <el-row>
      <el-col :span="24">
        <div v-if="Teacherform">
          <h4 class="title">教师信息</h4>
          　　　　//渲染教师信息
          <el-table :data="teacherData" border style="width: 100%" >
            <el-table-column prop="id" label="账号"></el-table-column>
            <el-table-column prop="tname" label="姓名"></el-table-column>
            <el-table-column prop="tsex" label="性别"></el-table-column>
            <el-table-column prop="tdepart" label="部门"></el-table-column>
            <el-table-column prop="class_cno" label="课程名"></el-table-column>
            <el-table-column prop="passwd" label="密码"></el-table-column>
            <el-table-column prop="role" label="角色"></el-table-column>
          </el-table>
        </div>

          <h4 class="title">学生信息</h4>
          　　　　//渲染学生信息
          <el-table :data="studentData" border style="width: 100%" >
            <el-table-column prop="id" label="学号"></el-table-column>
            <el-table-column prop="name" label="姓名"></el-table-column>
            <el-table-column prop="age" label="年龄"></el-table-column>
            <el-table-column prop="sex" label="性别"></el-table-column>
            <el-table-column prop="major" label="专业"></el-table-column>
            <el-table-column prop="depart" label="院系"></el-table-column>
            <el-table-column prop="term" label="学期"></el-table-column>
            <el-table-column prop="year" label="年级"></el-table-column>
            <el-table-column prop="passwd" label="密码"></el-table-column>
            <el-table-column prop="role" label="角色"></el-table-column>
          </el-table>

      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'UserInfo'
}
</script>

<style>
</style>
