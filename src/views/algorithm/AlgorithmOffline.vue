<template>
  <div class="box">
    <el-row style="height: 10%">
      <el-form :inline="true" ref="form" :model="form" :rules="rules" class="login-box">
        <el-form-item label="提出算法:" prop="sourceOption">
          <el-select
              v-model="value"
              filterable
              placeholder="请选择提出算法"
              :loading="loading"
              @change="changTarget(value)">
            <el-option
                v-for="item in form.sourceOption"
                :key="item.id"
                :label="item.algoName"
                :value="item.algoName">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="runAlgo('form')">运行</el-button>
        </el-form-item>
      </el-form>
    </el-row>
    <!--    图表-->
    <el-row style="height: 40%" v-if="this.value==='SFUI-UF'">
      <el-col :span="11" style="margin-right: 50px">
        <div>(a) 数组长度:</div>
        <img id="umaxLength" :style="{width: '100%', height: '100%',fontSize:'25px'}"  src=""/>
      </el-col>
      <el-col :span="11">
        <div>(b) 搜索空间:</div>
        <img id="SearchCount" :style="{width: '100%', height: '100%',fontSize:'25px' }"  src=""/>
      </el-col>
    </el-row>
    <el-row style="height: 40%" v-if="this.value==='SFUI-UF'">
      <el-col :span="11" style="margin-right: 50px">
        <div>(c) 运行时间:</div>
        <img id="Runtime" :style="{width: '100%', height: '100%',fontSize:'25px'}" src=""/>
      </el-col>
      <el-col :span="11">
        <div>(d) 消耗内存:</div>
        <img id="Memory" :style="{width: '100%', height: '100%',fontSize:'25px'}"  src=""/>
      </el-col>
    </el-row>
  </div>

</template>

<script>
export default {
  name: "AlgorithmOffline",
  data() {
    return {
      form: {
        sourceOption: [],
      },
      value: '',
      id: '',
      algo: '',
      runTimeSrc: '',
      memorySrc: '',
      searchSpaceSrc: '',
      umaxLengthSrc: '',
      rules: {
        source: [{
          required: true,
          message: '请选择提出算法',
          trigger: ["blur", 'change']
        }]
      },
    }
  },
  created() {
    this.getAlgoName();
  },
  methods: {
    runAlgo() {
      this.initSrc();
      document.getElementById("umaxLength").src = this.umaxLengthSrc;
      document.getElementById("SearchCount").src = this.searchSpaceSrc;
      document.getElementById("Runtime").src = this.runTimeSrc;
      document.getElementById("Memory").src = this.memorySrc;
    },
    initSrc() {
      if (this.value === "SFUI-UF") {
        this.umaxLengthSrc = "/Image/SFUI_UF/umax.png";
        this.searchSpaceSrc = "/Image/SFUI_UF/search.png";
        this.runTimeSrc = "/Image/SFUI_UF/runtime.png";
        this.memorySrc = "/Image/SFUI_UF/memory.png";

      } else if(this.value === "SFU-CE"){
        this.umaxLengthSrc = "";
        this.searchSpaceSrc = "";
        this.runTimeSrc = "";
        this.memorySrc = "";
      }
    },
    getAlgoName() {
      this.getRequest("/skyline/getAlgorithm", {isSource: '1'}).then(resp => {
        this.form.sourceOption = resp.data.data;
      })
    },
    changTarget(value) {
      this.value = value;
    }
  }
}
</script>

<style scoped>

</style>