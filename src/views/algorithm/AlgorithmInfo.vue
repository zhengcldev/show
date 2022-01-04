<template>
  <div>
    <el-form :inline="true" ref="form" :model="form"  class="login-box">
      <el-form-item label="算法展示:" prop="option">
        <el-select
            v-model="value1"
            filterable
            placeholder="请选择展示算法"
            @change="changTarget1(value1)">
          <el-option
              v-for="item in option"
              :key="item.id"
              :label="item.algoName"
              :value="item.algoName">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="runAlgo">查看</el-button>
      </el-form-item>
    </el-form>
    <pdf
        ref="pdf"
        v-for="i in numPages"
        :key="i"
        :src="url"
        :page="i"
    ></pdf>
  </div>
</template>

<script>
import pdf from 'vue-pdf'

export default {
  components: {
    pdf
  },
  data() {
    return {
      value1:'',
      form:[],
      dataUrl:'',
      option:[],
      algoUrl:'',
      id:'',
      algorithm:'',
      url: "",
      numPages: null, // pdf 总页数
    }
  },
created() {
  this.getAlgoName1();
},
  mounted() {

  },
  methods: {
    getNumPages() {
      let loadingTask = pdf.createLoadingTask(this.url)
      loadingTask.promise.then(pdf => {
        this.numPages = pdf.numPages
      }).catch(err => {
        console.error('pdf 加载失败', err);
      })
    },
    getAlgoName1() {
      this.getRequest("/skyline/getAlgorithm", null).then(resp => {
        this.option = resp.data.data;
      })
    },
    changTarget1(value) {
      this.value1 = value;
    },
    runAlgo() {
      let algoName=this.value1;
      this.getRequest("/skyline/getAlgorithm",{algoName:algoName}).then(resp=>{
        if(resp.data.data){
          this.url=resp.data.data[0].algoUrl;
        }
        this.getNumPages();
      })
    }
  }
}
</script>

<style scoped>
.pdf-set {
  display: inline-block;
  height: 800px;
  width: 500px;
}
</style>