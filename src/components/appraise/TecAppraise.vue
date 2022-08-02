<template>
  <div v-if="show">
    <el-form :model="form">
      <el-row>
        <!-- 列表 -->
        <el-row style="background-color: #FFF; text-align: center">
          <el-row>
            <el-row style="margin:0 auto;text-align: center; align-content: center">
              <el-col :span="24" style="line-height: 50px;font-size: 16px;font-weight: bold;color: #666;text-align: center ">
                {{month}}月专业评分表
              </el-col>
            </el-row>
            <el-row style="margin:0 auto;text-align: center; align-content: center">
              <el-col :span="24" style="line-height: 10px;font-size: 12px;font-weight: bold;color: #666;text-align: center ">
                本月取值范围为{{min}}~{{max}}
              </el-col>
            </el-row>
            <u-table use-virtual :row-height="50" border :data="list" style="margin-top:20px;width: 80% ;horiz-align: center; left: 10%"
                      :header-cell-style="this.CellStyleOne" :cell-style="this.CellStyleOne">
              <u-table-column prop="department" label="部门" min-width="30%">
              </u-table-column>
              <u-table-column prop="technology" label="专业" min-width="15%">
              </u-table-column>
              <u-table-column prop="scope" label="质量得分" min-width="15%">
                <template slot-scope="scope">
                  <el-input
                            type="text" :ref = "'designer' + scope.$index"
                            v-model="scope.row.designer"
                            oninput="value=value.replace(/[^\d.]/g,'')"
                            @blur="judge(scope.row.designer,'designer',scope.$index)"
                            @select="appraise(scope.row)"
                            @change="appraise(scope.row)"
                            ></el-input>
                </template>
              </u-table-column>
              <u-table-column prop="scope" label="进度得分" min-width="15%">
                <template slot-scope="scope">
                  <el-input
                            type="text" :ref = "'personal' + scope.$index"
                            v-model="scope.row.personal"
                            oninput="value=value.replace(/[^\d.]/g,'')"
                            @blur="judge(scope.row.personal,'personal',scope.$index)"
                            @select="appraise(scope.row)"
                            @change="appraise(scope.row)"
                            ></el-input>
                </template>
              </u-table-column>
              <u-table-column prop="scope" label="配合得分" min-width="15%">
                <template slot-scope="scope">
                  <el-input
                            type="text" :ref = "'coordinate' + scope.$index"
                            v-model="scope.row.coordinate"
                            oninput="value=value.replace(/[^\d.]/g,'')"
                            @blur="judge(scope.row.coordinate,'coordinate',scope.$index)"
                            @select="appraise(scope.row)"
                            @change="appraise(scope.row)"
                            ></el-input>
                </template>
              </u-table-column>

            </u-table>
          </el-row>
        </el-row>
      </el-row>
    </el-form>
  </div>
  <div v-else>
    <el-card class="box-card" shadow="hover"
             style="position:absolute;top:45%;
    width: 25%;height: 15.28%;margin-left: 37.64%;background-color:#acb2b9">
      <div>
        系统暂时不可打分，请在每年3，6，9，12月份的{{startDay}}日到次月{{endDay}}日进行打分。
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
name: "TecAppraise",
  data() {
    return {
      id: "",
      nowDay: new Date().getDate(),
      month: new Date().getMonth() + 1,
      min: "",
      max: "",
      startDay : 25,
      endDay : 10,
      list: [],
      form: {},
      show : false,
      isRouterAlive : true,
      appraiseData: {}
    }
  },
  provide(){
    return{
      reload:this.reload
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    update(e) {
      this.$forceUpdate(e);
    },
    getData() {
      this.$axios
        .post(this.$baseUrl + 'range/queryDate')
        .then(res => {
          this.endDay = res.data.data.end;
          this.startDay = res.data.data.start;
          if (this.month%3 === 0){
            if (this.nowDay>= Number(this.startDay)){
              this.show=true
            }
          }else if(this.month%3 === 1){
            if (this.nowDay <= Number(this.endDay)) {
              this.show=true
            }
          }
        })
        .catch(res => (console.log(res)));
      this.$axios
        .post(this.$baseUrl + 'technology/evaluate')
        .then(res => (
          res.data.data.forEach((item,index)=>{
          this.list.push(item);
        })
        ))
        .catch(res => (console.log(res)));
      this.$axios
        .post(this.$baseUrl + 'range/query',{},{headers: {'id': this.id}})
        .then(res => {this.max = res.data.data.max ; this.min = res.data.data.min})
        .catch(res => (console.log(res)));
    },
    appraise(row) {
        this.$axios
          .post(this.$baseUrl + 'tecScore/appraise',{
            tecId : row.id,
            designer : row.designer,
            personal : row.personal,
            coordinate : row.coordinate,
            role : row.role
          })
          .then(res => {
            if (0 === res.data.code) {
              alert("操作成功")
            } else {
              alert(("操作失败，请重试"))
            }
            this.getData()
          })
          .catch(res => (console.log(res)));
    },
    judge(v,w,n) {
      console.log(v)
      if (v !== null && v !== "") {
      if (v < this.min || v > this.max) {

        // this.$nextTick(() => {
        // })
        this.$refs[w + n].focus();
        this.$message.error("输入的值不在范围内，请重新输入");
      }
    }
    },
    reload(){
      this.isRouterAlive = false
      this.$nextTick(function () {
        this.isRouterAlive = true
      })
    },
    changeState(v){
      this.list[v].state = false;
    }

  }

}
</script>

<style scoped>

</style>
