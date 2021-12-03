<template>
<div style="box-sizing: border-box">
  <div style="width: 100%;height: 300px;box-sizing: border-box;"
       align="center">
    <div style="float:left;width: 30%;height: 300px;box-sizing: border-box;"
         align="center">
      <el-button @click="downExcel" style="margin-top: 70px">专业工时使用情况汇总下载</el-button>
      <el-button @click="downExcel1" style="margin-top: 20px">个人卷册完成情况汇总下载</el-button>
      <el-button @click="downExcel2" style="margin-top: 20px">卷册详情汇总下载</el-button>
<!--      <el-upload-->
<!--        class="upload-demo"-->
<!--        ref="upload"-->
<!--        action=""-->
<!--        :show-file-list="false"-->
<!--        :on-change="handleSuccess"-->
<!--        :auto-upload="false"-->
<!--        accept=".xls,.xlsx">-->
<!--        <el-button slot="trigger" size="small" type="primary">选取文件</el-button>-->
<!--      </el-upload>-->
    </div>
    <div style="float:right;width: 70%;height: 300px;box-sizing: border-box;"
         align="center">
    <span>各专业工时使用情况</span>
    <div ref="myChart2" id="myChart2" align="center" style="width: 500px;height: 300px;"></div>
    </div>
  </div>
  <div style="float:left;width: 50%;height: 300px;border: 1px solid #3B6273;box-sizing: border-box;"
       align="center">
    <span>工时分配</span>
  <div ref="myChart" id="myChart" align="center" style="width: 500px;height: 300px;"></div>
  </div>
  <div style="float:right;width: 50%;height: 300px;;border: 1px solid #3B6273;box-sizing: border-box;"
       align="center;">
    <span>项目进度</span>
    <div ref="myChart1" id="myChart1" align="center" style="width: 500px;height: 300px;margin-left: 10%"></div>
  </div>
</div>
</template>

<script>

import * as Echarts from 'echarts';
export default {
name: "Project",
  data(){
  return{
    isShow : false,
    project:null,
  }
  },
  mounted() {
    this.projectId = this.$route.query.project_id;
    this.$nextTick(() => {
      //  执行echarts方法
      this.drawLine();
      this.drawLine1();
      this.drawLine2();
    })
    // this.$nextTick(() => {
    //   //  执行echarts方法
    //   this.getDrawDate();
    // },3000)
  },
  watch: {
    //观察option的变化
  },
  methods: {
    drawLine() {
      let proWorkDay = [];
      let tecWorkDay = [];
      let sum = 0;
      this.$axios.post(this.$baseUrl + 'projectWorkDay/drawLine', {},
        {headers: {"id": this.projectId}})
        .then(res => {
          proWorkDay.push({name :"设总管理工时",value : res.data.data.proWorkDay.manage})
          proWorkDay.push({name :"专业工时",value : res.data.data.proWorkDay.tec})
          proWorkDay.push({name :"备用工时",value : res.data.data.proWorkDay.backup})
          tecWorkDay = res.data.data.tecWorkDay;
          sum = res.data.data.proWorkDay.manage +
            res.data.data.proWorkDay.tec + res.data.data.proWorkDay.backup;
          // let myChart = this.$echarts.init(document.getElementById('myChart'))
          let myChart = this.$refs.myChart
          if (myChart) {
            const thisChart = this.$echarts.init(myChart)
            const option = {
              tooltip: {
                trigger: 'item',
                formatter: '{a} <br/>{b}: {c} ({d}%)'
              },
              // legend: {
              //   data: []
              // },
              series: [
                {
                  name: '总工时分配',
                  type: 'pie',
                  selectedMode: 'single',
                  radius: [0, '30%'],
                  label: {
                    position: 'inner',
                    fontSize: 8,
                    width: 30,
                  },
                  labelLine: {
                    show: false
                  },
                  data: proWorkDay
                },
                {
                  name: '设计工时分配',
                  type: 'pie',
                  radius: ['45%', '60%'],
                  labelLine: {
                    length: 30,
                  },
                  label: {
                    formatter: '{a|{a}}{abg|}\n{hr|}\n  {b|{b}：}{c}  {per|{d}%}  ',
                    backgroundColor: '#F6F8FC',
                    borderColor: '#8C8D8E',
                    borderWidth: 1,
                    borderRadius: 4,

                    rich: {
                      a: {
                        color: '#6E7079',
                        lineHeight: 22,
                        align: 'center'
                      },
                      hr: {
                        borderColor: '#8C8D8E',
                        width: '100%',
                        borderWidth: 1,
                        height: 0
                      },
                      b: {
                        color: '#4C5058',
                        fontSize: 14,
                        fontWeight: 'bold',
                        lineHeight: 33
                      },
                      per: {
                        color: '#fff',
                        backgroundColor: '#4C5058',
                        padding: [3, 4],
                        borderRadius: 4
                      }
                    }
                  },
                  data: tecWorkDay
                },
              ],
            };
            thisChart.setOption(option)
            window.addEventListener("resize", function () {
              thisChart.resize();  //页面大小变化后Echarts也更改大小
            });
          }
        })
        .catch(res => (console.log(res.data)))
    },
    drawLine1() {
      let data = [];
      this.$axios.post(this.$baseUrl + 'project/drawLine',{},
        {headers : { "id" : this.projectId }})
        .then( res => { data = res.data.data;
      // let myChart = this.$echarts.init(document.getElementById('myChart'))
      let myChart = this.$refs.myChart1
      if (myChart) {
        const thisChart = this.$echarts.init(myChart)
        const option = {
          // title: {
          //   text: '某站点用户访问来源',
          //   subtext: '纯属虚构',
          //   left: 'center'
          // },
          tooltip: {
            trigger: 'item'
          },
          // legend: {
          //   orient: 'vertical',
          //   left: 'left',
          // },
          series: [
            {
              name: '访问来源',
              type: 'pie',
              radius: '65%',
              data: data,
              emphasis: {
                itemStyle: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              }
            }
          ]
        };
        thisChart.setOption(option)
        window.addEventListener("resize", function () {
          thisChart.resize();  //页面大小变化后Echarts也更改大小
        });
      }
      })
      .catch( res => (console.log(res.data)))
    },
    drawLine2() {
      let xAxisData= [];
      let data = [];
      let data1 = [];
      let data2 = [];
      this.$axios.post(this.$baseUrl + 'projectWorkDay/queryUsedTecWorkDay',{},
        {headers : { "id" : this.projectId, type : 3}})
        .then( res => { data = res.data.data;
        data.forEach((item,index) => {
          xAxisData.push(item.tec)
          data1.push(item.have)
          data2.push(item.used)
        })
          // let myChart = this.$echarts.init(document.getElementById('myChart'))
          let myChart = this.$refs.myChart2
          if (myChart) {
            const thisChart = this.$echarts.init(myChart)
            const emphasisStyle = {
              itemStyle: {
                shadowBlur: 10,
                shadowColor: 'rgba(0,0,0,0.3)'
              }
            };

            const option = {
              // legend: {
              //   data: ['bar', 'bar2'],
              //   left: '10%'
              // },
              brush: {
                toolbox: ['rect', 'polygon', 'lineX', 'lineY', 'keep', 'clear'],
                xAxisIndex: 0
              },
              toolbox: {
                feature: {
                  magicType: {
                    type: ['tiled','stack']
                  },
                  dataView: {}
                }
              },
              tooltip: {
              },
              xAxis: {
                data: xAxisData,
                name: '专业',
                axisLine: {onZero: true},
                splitLine: {show: false},
                splitArea: {show: false},
                axisLabel: {
                  interval:0,
                  rotate:40
                }
              },
              yAxis: {},
              grid: {
                bottom: 100
              },
              series: [
                {
                  name: '分配',
                  type: 'bar',
                  tiled: 'one',
                  emphasis: emphasisStyle,
                  data: data1
                },
                {
                  barGap: "-100%",
                  name: '已用',
                  type: 'bar',
                  tiled: 'one',
                  emphasis: emphasisStyle,
                  data: data2
                },
              ]
            };

            thisChart.on('brushSelected', renderBrushed);

            function renderBrushed(params) {
              var brushed = [];
              var brushComponent = params.batch[0];

              for (var sIdx = 0; sIdx < brushComponent.selected.length; sIdx++) {
                var rawIndices = brushComponent.selected[sIdx].dataIndex;
                brushed.push('[Series ' + sIdx + '] ' + rawIndices.join(', '));
              }

              thisChart.setOption({
                title: {
                  backgroundColor: '#333',
                  text: 'SELECTED DATA INDICES: \n' + brushed.join('\n'),
                  bottom: 0,
                  right:'10%',
                  width: 100,
                  textStyle: {
                    fontSize: 12,
                    color: '#fff'
                  }
                }
              });
            }
            thisChart.setOption(option)
            window.addEventListener("resize", function () {
              thisChart.resize();  //页面大小变化后Echarts也更改大小
            });
          }
        })
        .catch( res => (console.log(res.data)))
    },
    downExcel(){
      let that = this;
      this.$message.success("即将开始下载");
      let xhr = new XMLHttpRequest();
      let u =  this.$baseUrl + 'projectExcel/statistic?id=' + this.projectId;
      xhr.open("get", u, true); // get、post都可
      xhr.responseType = "blob";  // 转换流
      xhr.setRequestHeader("Authorization", this.$storage.get("Authorization")); // token键值对
      xhr.onload = function() {
        if (this.status === 200) {
          let blob = this.response;
          let a = document.createElement("a")
          let url = window.URL.createObjectURL(blob)
          a.href = url
          a.download =  that.$parent.project.name + "专业工时使用情况.xlsx"  // 文件名
          a.click()
          window.URL.revokeObjectURL(url)
        }
      }
      xhr.send();
    },
    downExcel1(){
      let that = this;
      this.$message.success("即将开始下载");
      let xhr = new XMLHttpRequest();
      let u =  this.$baseUrl + 'projectExcel/everyone?id=' + this.projectId;
      xhr.open("get", u, true); // get、post都可
      xhr.responseType = "blob";  // 转换流
      xhr.setRequestHeader("Authorization", this.$storage.get("Authorization")); // token键值对
      xhr.onload = function() {
        if (this.status === 200) {
          let blob = this.response;
          let a = document.createElement("a")
          let url = window.URL.createObjectURL(blob)
          a.href = url
          a.download =  that.$parent.project.name + "个人卷册完成情况.xlsx"  // 文件名
          a.click()
          window.URL.revokeObjectURL(url)
        }
      }
      xhr.send();
    },
    downExcel2(){
      let that = this;
      this.$message.success("即将开始下载");
      let xhr = new XMLHttpRequest();
      let u =  this.$baseUrl + 'projectExcel/volume?id=' + this.projectId;
      xhr.open("get", u, true); // get、post都可
      xhr.responseType = "blob";  // 转换流
      xhr.setRequestHeader("Authorization", this.$storage.get("Authorization")); // token键值对
      xhr.onload = function() {
        if (this.status === 200) {
          let blob = this.response;
          let a = document.createElement("a")
          let url = window.URL.createObjectURL(blob)
          a.href = url
          a.download =  that.$parent.project.name + "卷册详情.xlsx"  // 文件名
          a.click()
          window.URL.revokeObjectURL(url)
        }
      }
      xhr.send();
    },
    handleSuccess(file) {
      console.log('+++++++++++++')
      console.log(file)
      let formData = new FormData();
      formData.append("id",this.projectId)
      formData.append("file",file.raw)
      console.log(formData)
      this.$axios({
        url : this.$baseUrl + 'projectExcel/workdayByProject',
        method : 'post',
        data : formData,
        processData: false,// 告诉axios不要去处理发送的数据(重要参数)
        contentType : false,

      })
        .then((response) => {
          if(response.data.info=="success"){this.$message({
            type: 'success',
            message: '附件上传成功!'
          });
          }
        })
    },
  },

}
</script>

<style scoped>

</style>
