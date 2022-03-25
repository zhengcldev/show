<template>
  <div class="box">
    <el-row style="height: 10%">
      <el-form :inline="true" ref="form" :model="form" :rules="rules" class="login-box">
        <el-form-item label="提出算法:" prop="sourceOption">
          <el-select
              v-model="value1"
              multiple
              filterable

              reserve-keyword
              placeholder="请选择提出算法"

              :loading="loading"
              @change="changTarget1(value1)">
            <el-option
                v-for="item in form.sourceOption"
                :key="item.id"
                :label="item.algoName"
                :value="item.algoName">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="对比算法:" prop="targetOption">
          <el-select
              v-model="value2"
              multiple
              filterable
              collapse-tags
              reserve-keyword
              placeholder="请选择对比算法"
              :loading="loading"
              @change="changTarget2(value2)">
            <el-option
                v-for="item in form.targetOption"
                :key="item.id"
                :label="item.algoName"
                :value="item.algoName">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="数据集:" prop="dataOption">
          <el-select
              v-model="value3"
              multiple
              filterable
              reserve-keyword
              placeholder="请选择数据集"
              :loading="loading"
              @change="changTarget3(value3)">
            <el-option
                v-for="item in form.dataOption"
                :key="item.id"
                :label="item.dataName"
                :value="item.dataName">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="runAlgo('form')">运行</el-button>
        </el-form-item>
      </el-form>
    </el-row>
    <!--    图表-->
    <el-row v-loading="loadingAlgo"
            element-loading-text="算法执行中"
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(0, 0, 0, 0.8)"
            style="height: 45%">
      <el-col :span="12">
        <div id="Runtime" :style="{width: '100%', height: '100%',fontSize:'25px'}"></div>
      </el-col>
      <el-col :span="12">
        <div id="Memory" :style="{width: '100%', height: '100%',fontSize:'25px'}"></div>
      </el-col>
    </el-row>
    <el-row style="height: 45%">
      <el-col :span="12">
        <div id="SFUI" :style="{width: '100%', height: '100%',fontSize:'25px'}"></div>
      </el-col>
      <el-col :span="12">
        <div id="SearchCount" :style="{width: '100%', height: '100%',fontSize:'25px'}"></div>
      </el-col>
    </el-row>

  </div>

</template>

<script>
import * as echarts from "echarts";

export default {
  data() {
    return {
      form: {
        sourceOption: [],
        targetOption: [],
        dataOption: []
      },
      seriesSFUI: [],
      runtime: [[]],
      memory: [[]],
      SFUI: [[]],
      searchSpace: [[]],
      series: [],
      mySeries: [],
      myAlgo: [],
      myData: [],
      value1: [],
      value2: [],
      value3: [],
      loading: false,
      loadingAlgo: false,
      algoName: '',
      dataName: '',
      id: '',
      rules: {
        source: [{
          required: true,
          message: '请选择提出算法',
          trigger: ["blur", 'change']
        }],
        target: [{
          required: true,
          message: '请选择对比算法',
          trigger: ["blur", 'change']
        }],
        dataset: [{
          required: true,
          message: '请选择数据集',
          trigger: ["blur", 'change']
        }]
      }
    }
  },
  created() {
    this.getAlgoName1();
    this.getAlgoName2();
    this.getAlgoName3();
  },
  methods: {
    getAlgoName1() {
      this.getRequest("/skyline/getAlgorithm", {isSource: '1'}).then(resp => {
        this.form.sourceOption = resp.data.data;
      })
    },
    getAlgoName2() {
      this.getRequest("/skyline/getAlgorithm", {isSource: '0'}).then(resp => {
        this.form.targetOption = resp.data.data;
      })
    },
    getAlgoName3() {
      this.getRequest("/skyline/getDataset", null).then(resp => {
        this.form.dataOption = resp.data.data;
      })
    },
    changTarget1(value) {
      this.value1 = value;
    },
    changTarget2(value) {
      this.value2 = value;
    },
    changTarget3(value) {
      this.value3 = value;
    },
    runAlgo(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let returnDta = {
            //source:this.form.sourceOption.map(o=>{return[o.algoName].toString()}),
            source: this.value1,
            target: this.value2,
            data: this.value3
          };
          this.loadingAlgo = true;
          this.postRequest('/skyline/runAlgorithm', returnDta).then(resp => {
            if (resp) {
              this.loadingAlgo = false;
              //todo 清空画布,首页图片,重置密码
              if (resp.data.data) {
                for (let i = 0; i < this.value1.length + this.value2.length; i++) {
                  this.mySeries.push({type: 'bar'});
                }
                this.myAlgo.push('product');
                for (let i = 0; i < this.value1.length; i++) {
                  this.myAlgo.push(this.value1[i]);
                }
                for (let i = 0; i < this.value2.length; i++) {
                  this.myAlgo.push(this.value2[i]);
                }
                for (let i = 0; i < this.value3.length; i++) {
                  this.myData.push(this.value3[i]);
                }
                this.runtime = resp.data.data.runtime;
                this.memory = resp.data.data.memory;
                this.SFUI = resp.data.data.SFUI;
                this.searchSpace = resp.data.data.searchSpace;
                this.runtime.unshift(this.myAlgo);
                this.memory.unshift(this.myAlgo);
                this.SFUI.unshift(this.myAlgo);
                this.searchSpace.unshift(this.myAlgo);
                for (let i = 1; i < this.myAlgo.length; i++) {
                  let dataSFUI = [];
                  for (let k = 1; k < this.SFUI.length; k++) {
                    dataSFUI.push(this.SFUI[k][i]);
                  }
                  let temp = {
                    type: 'bar',
                    data: dataSFUI,
                    coordinateSystem: 'polar',
                    name: this.myAlgo[i],
                    stack: 'a',
                    emphasis: {
                      focus: 'series'
                    }
                  };
                  this.seriesSFUI.push(temp);
                }
                this.rotation()
              } else {
                this.$message({
                  message: '未知错误，请重试！',
                  type: 'warning'
                });
              }
            }
          }).catch(function (error) {
            console.log(error);
          });
        } else {
          this.$message({
            message: '请填入所有必填信息',
            type: 'warning'
          });
          return false;
        }
      });
    },
    rotation() {
      /*
      * option = {
  angleAxis: {},
  radiusAxis: {
    type: 'category',
    data: this.myData,
    z: 10
  },
  polar: {},
  series: this.seriesSFUI,
  legend: {
    show: true,
    data: this.myAlgo
  }
};*/
      let drawSFUI = echarts.init(document.getElementById('SFUI'));
      let drawSearchCount = this.$echarts.init(document.getElementById('SearchCount'));
      let drawRuntime = this.$echarts.init(document.getElementById('Runtime'));
      let drawMemory = this.$echarts.init(document.getElementById('Memory'));
      let runtimeOption = {
        legend: {},
        tooltip: {},
        title: {
          text: '时间:'
        },
        dataset: {
          // 提供一份数据。
          source: this.runtime
        },
        // 声明一个 X 轴，类目轴（category）。默认情况下，类目轴对应到 dataset 第一列。
        xAxis: {type: 'category', name: '数据集'},
        // 声明一个 Y 轴，数值轴。
        yAxis: {type: 'value', name: 'Sec'},
        // 声明多个 bar 系列，默认情况下，每个系列会自动对应到 dataset 的每一列。
        series: this.mySeries
      };
      let algo = [];
      for (let i = 1; i < this.myAlgo.length; i++) {
        algo.push(this.myAlgo[i]);
      }
      let optionSFUI = {
        angleAxis: {},
        title: {
          text: 'SFUI数量:'
        },
        radiusAxis: {
          type: 'category',
          data: this.myData,
          z: 10
        },
        polar: {},
        series: this.seriesSFUI,
        legend: {
          show: true,
          data: algo
        }
      };
      let memoryOption = {
        legend: {},
        tooltip: {},
        title: {
          text: '内存:'
        },
        dataset: {
          // 提供一份数据。
          source: this.memory
        },
        // 声明一个 X 轴，类目轴（category）。默认情况下，类目轴对应到 dataset 第一列。
        xAxis: {type: 'category', name: '数据集'},
        // 声明一个 Y 轴，数值轴。
        yAxis: {type: 'value', name: 'MB'},
        // 声明多个 bar 系列，默认情况下，每个系列会自动对应到 dataset 的每一列。
        series: this.mySeries
      };
      let SFUIOption = {
        legend: {},
        tooltip: {},
        title: {
          text: 'SFUI:'
        },
        dataset: {
          // 提供一份数据。
          source: this.SFUI
        },
        // 声明一个 X 轴，类目轴（category）。默认情况下，类目轴对应到 dataset 第一列。
        xAxis: {type: 'category', name: '数据集'},
        // 声明一个 Y 轴，数值轴。
        yAxis: {},
        // 声明多个 bar 系列，默认情况下，每个系列会自动对应到 dataset 的每一列。
        series: this.mySeries
      };
      let searchSpaceOption = {
        legend: {},
        tooltip: {},
        title: {
          text: '搜索空间:'
        },
        dataset: {
          // 提供一份数据。
          source: this.searchSpace
        },
        // 声明一个 X 轴，类目轴（category）。默认情况下，类目轴对应到 dataset 第一列。
        xAxis: {type: 'category', name: '数据集'},
        // 声明一个 Y 轴，数值轴。
        yAxis: {},
        // 声明多个 bar 系列，默认情况下，每个系列会自动对应到 dataset 的每一列。
        series: this.mySeries
      };
      //作图optionSFUI
      console.log(optionSFUI);
      drawSFUI.setOption(optionSFUI);
      drawSearchCount.setOption(searchSpaceOption);
      drawRuntime.setOption(runtimeOption);
      drawMemory.setOption(memoryOption);

    }
  }
}
</script>
<style lang="scss" scoped>
.el-row {
  margin-bottom: 10px;
  display: flex;
  flex-wrap: wrap;
}

.box {
  width: 80vw;
  height: 85vh;
}
</style>