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
    <el-row style="height: 40%">
      <el-col :span="12">
        <div id="PSFUI" :style="{width: '100%', height: '100%',fontSize:'25px'}"></div>
      </el-col>
      <el-col :span="12">
        <div id="SearchCount" :style="{width: '100%', height: '100%',fontSize:'25px'}"></div>
      </el-col>
    </el-row>

    <el-row style="height: 40%">
      <el-col :span="12">
        <div id="Runtime" :style="{width: '100%', height: '100%',fontSize:'25px'}"></div>
      </el-col>
      <el-col :span="12">
        <div id="Memory" :style="{width: '100%', height: '100%',fontSize:'25px'}"></div>
      </el-col>
    </el-row>
  </div>

</template>

<script>
export default {
  data() {
    return {
      form: {
        sourceOption: [],
        targetOption: [],
        dataOption: []
      },
      runtime: [],
      memory: [],
      PSFUI: [],
      searchSpace: [],
      series: [],
      mySeries: [],
      myAlgo: [],
      value1: [],
      value2: [],
      value3: [],
      loading: false,
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
  mounted() {
    //this.rotation()
  },
  methods: {
    remoteMethod2(query) {
      //remote :remoteMethod=""
      if (query !== '') {
        this.loading = true;
        setTimeout(() => {
          this.loading = false;
          this.form.targetOption = this.states2.filter(item => {
            return item.algoName.toLowerCase()
                .indexOf(query.toLowerCase()) > -1;
          });
        }, 200);
      } else {
        this.form.targetOption = [];
      }
    },
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
        this.form.dataOption =  resp.data.data;
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
          this.postRequest('/skyline/runAlgorithm', returnDta).then(resp => {
            if (resp) {
              if (resp.data.data) {

                for (let i = 0; i < this.value1.length+this.value2.length; i++) {
                  this.mySeries.push({type: 'bar'});
                }
                this.myAlgo.push('product');
                for(let i=0;i<this.value1.length;i++){
                  this.myAlgo.push(this.value1[i]);
                }
                for(let i=0;i<this.value2.length;i++){
                  this.myAlgo.push(this.value2[i]);
                }
                this.runtime.push(this.myAlgo);
                this.memory.push(this.myAlgo);
                this.PSFUI.push(this.myAlgo);
                this.searchSpace.push(this.myAlgo);
                this.runtime = resp.data.data.runtime;
                this.memory = resp.data.data.memory;
                this.PSFUI = resp.data.data.PSFUI;
                this.searchSpace = resp.data.data.searchSpace;
                //this.series = resp.data.data.series;
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
      let drawPSFUI = this.$echarts.init(document.getElementById('PSFUI'));
      let drawSearchCount = this.$echarts.init(document.getElementById('SearchCount'));
      let drawRuntime = this.$echarts.init(document.getElementById('Runtime'));
      let drawMemory = this.$echarts.init(document.getElementById('Memory'));
      let runtimeOption = {
        legend: {},
        tooltip: {},
        title: {
          text: '时间消耗:'
        },
        dataset: {
          // 提供一份数据。
          source: this.runtime
        },
        // 声明一个 X 轴，类目轴（category）。默认情况下，类目轴对应到 dataset 第一列。
        xAxis: {type: 'category'},
        // 声明一个 Y 轴，数值轴。
        yAxis: {},
        // 声明多个 bar 系列，默认情况下，每个系列会自动对应到 dataset 的每一列。
        series: this.mySeries
      };
      let memoryOption = {
        legend: {},
        tooltip: {},
        title: {
          text: '内存消耗:'
        },
        dataset: {
          // 提供一份数据。
          source: this.memory
        },
        // 声明一个 X 轴，类目轴（category）。默认情况下，类目轴对应到 dataset 第一列。
        xAxis: {type: 'category'},
        // 声明一个 Y 轴，数值轴。
        yAxis: {},
        // 声明多个 bar 系列，默认情况下，每个系列会自动对应到 dataset 的每一列。
        series: this.mySeries
      };
      let PSFUIOption = {
        legend: {},
        tooltip: {},
        title: {
          text: 'PSFUI数量:'
        },
        dataset: {
          // 提供一份数据。
          source: this.PSFUI
        },
        // 声明一个 X 轴，类目轴（category）。默认情况下，类目轴对应到 dataset 第一列。
        xAxis: {type: 'category'},
        // 声明一个 Y 轴，数值轴。
        yAxis: {},
        // 声明多个 bar 系列，默认情况下，每个系列会自动对应到 dataset 的每一列。
        series: this.mySeries
      };
      let searchSpaceOption = {
        legend: {},
        tooltip: {},
        title: {
          text: '搜索空间大小:'
        },
        dataset: {
          // 提供一份数据。
          source: this.searchSpace
        },
        // 声明一个 X 轴，类目轴（category）。默认情况下，类目轴对应到 dataset 第一列。
        xAxis: {type: 'category'},
        // 声明一个 Y 轴，数值轴。
        yAxis: {},
        // 声明多个 bar 系列，默认情况下，每个系列会自动对应到 dataset 的每一列。
        series: this.mySeries
      };
      let option = {
        legend: {},
        tooltip: {},
        dataset: {
          source: [
            ['product', '正常', '故障', '报警'],
            ['1月', 43.3, 85.8, 93.7],
            ['2月', 83.1, 73.4, 55.1],
            ['3月', 86.4, 65.2, 82.5],
            ['4月', 72.4, 53.9, 39.1]
          ]
        },
        color: ['#4EEE79', '#FFCD8B', '#FF4203'],
        xAxis: {
          type: 'category',
          // data: ['6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16'],
          //设置坐标轴字体颜色和宽度
          axisLine: {
            lineStyle: {
              color: "#fff",
            }
          }
        },
        yAxis: {
          type: 'value',
          //设置坐标轴字体颜色和宽度
          axisLine: {
            lineStyle: {
              color: "#fff",
            }
          }
        },
        // Declare several bar series, each will be mapped
        // to a column of dataset.source by default.
        series: [
          {type: 'bar', barWidth: 10},
          {type: 'bar', barWidth: 10},
          {type: 'bar', barWidth: 10}
        ]
      };

      drawPSFUI.setOption(runtimeOption);
      drawSearchCount.setOption(memoryOption);
      drawRuntime.setOption(PSFUIOption);
      drawMemory.setOption(searchSpaceOption);

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