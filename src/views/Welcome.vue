<template>
  <div>
    <el-row style="height: 50%">
      <div>
        <el-carousel trigger="click" type="card" height="280px" :interval="3000"
                     arrow="always" style="width:1000px;margin: auto">
          <el-carousel-item v-for="item in imgList" :key="item.name">
            <img :src="item.src" style="height:100%;width:100%;" alt="图片丢失了" :title="item.title"/>
          </el-carousel-item>
        </el-carousel>
      </div>
    </el-row>

    <el-row style="height: 50%">
      <el-col :span="12">
        <div id="hot" style="float:left;width:100%;height: 300px"></div>
      </el-col>
      <el-col :span="12">
        <div id="visit" style="float:left;width:100%;height: 300px"></div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import * as echarts from "echarts";

export default {
  name: "Welcome",
  created() {

  },
  mounted() {
    this.getFuncLog();
    this.getHotLog();
  },
  data() {
    return {
      imgList: [
        {
          name: "ncut1",
          src: require("/public/Image/NCUT/ncut1.png"),
          title: "这是ncut.png"
        },
        {
          name: "ncut2",
          src: require("/public/Image/NCUT/ncut2.png"),
          title: "这是ncut.png"
        },
        {
          name: "ncut3",
          src: require("/public/Image/NCUT/ncut3.png"),
          title: "这是ncut.png"
        },
        {
          name: "ncut4",
          src: require("/public/Image/NCUT/ncut4.png"),
          title: "这是ncut.png"
        },
        {
          name: "ncut5",
          src: require("/public/Image/NCUT/ncut5.jpg"),
          title: "这是ncut.png"
        }
      ],
      funcData:[],
      hotDate:[],
      hotData:[]
    }
  },
  methods: {
    getFuncLog(){
      this.getRequest("/skyline/getFuncLog",null).then(resp=>{
        if(resp.data.data){
          this.funcData.push({value:resp.data.data.algoRuntime,name:'实时运行'});
          this.funcData.push({value:resp.data.data.algoOffline,name:'离线运行'});
          this.funcData.push({value:resp.data.data.editUser,name:'编辑用户'});
          this.funcData.push({value:resp.data.data.readPaper,name:'查看论文'});
          this.funcData.push({value:resp.data.data.editData,name:'编辑数据'});
          this.funcData.push({value:resp.data.data.userInfo,name:'个人信息'});
          this.funcData.push({value:resp.data.data.updatePwd,name:'修改密码'});
          this.initData();
        }
      })
    },
    getHotLog(){
      this.getRequest("/skyline/getHotLog",null).then(resp=>{
        this.hotDate=resp.data.data.date;
        this.hotData=resp.data.data.times;
        console.log(this.hotData);
        this.initData2();
      });

    },
    //初始化数据
    initData2(){
      let visitSystem = echarts.init(document.getElementById('visit'));
      visitSystem.setOption({
        tooltip: {
          trigger: 'axis',
          position: function (pt) {
            return [pt[0], '10%'];
          }
        },
        title: {
          left: 'center',
          text: '系统访问热点图'
        },
        toolbox: {
          feature: {
            dataZoom: {
              yAxisIndex: 'none'
            },
            restore: {},
            saveAsImage: {}
          }
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: this.hotDate
        },
        yAxis: {
          type: 'value',
          boundaryGap: [0, '100%']
        },
        dataZoom: [
          {
            type: 'inside',
            start: 0,
            end: 100
          },
          {
            start: 0,
            end: 10
          }
        ],
        series: [
          {
            name: '访问次数',
            type: 'line',
            symbol: 'none',
            sampling: 'lttb',
            itemStyle: {
              color: 'rgb(255, 70, 131)'
            },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: 'rgb(255, 158, 68)'
                },
                {
                  offset: 1,
                  color: 'rgb(255, 70, 131)'
                }
              ])
            },
            data: this.hotData
          }
        ]
      });
    },
    initData() {
      let base = +new Date(2022, 1, 1);
      let oneDay = 24 * 3600 * 1000;
      let date = [];
      let data = [100];
      for (let i = 1; i < 100; i++) {
        let now = new Date((base += oneDay));
        date.push("2012/2/3");
        data.push(5);
      }
      // 基于准备好的dom，初始化echarts实例
      let myChart = echarts.init(document.getElementById('hot'));


      // 绘制热门图表
      myChart.setOption({
        title: {
          text: '系统热门功能使用情况',//主标题
          x: 'center',//x轴方向对齐方式
        },
        tooltip: {
          trigger: 'item',
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
          orient: 'vertical',
          bottom: 'bottom',
          data: ['实时运行', '离线运行', '编辑用户', '查看论文', '编辑数据', '个人信息', '修改密码']
        },
        series: [
          {
            name: '使用功能',
            type: 'pie',
            radius: '55%',
            center: ['50%', '55%'],
            data: this.funcData,
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      });
    },
  }
}
</script>

<style scoped lang="scss">
.el-carousel__item h3 {
  color: #475669;
  font-size: 14px;
  opacity: 0.75;
  line-height: 200px;
  margin: 0;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n+1) {
  background-color: #d3dce6;
}
</style>