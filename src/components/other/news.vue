<template>
  <div>
    <el-badge :value="list.length" :max="99"  >
      <el-button circle icon="el-icon-chat-square" class="item" @click.native="isShow = !isShow"></el-button>
    </el-badge>
  <el-dialog
      v-el-drag-dialog
    :visible.sync="isShow"
    width= "60%"
    :close-on-click-modal="false"
    :append-to-body="true"
    z-index="1000"
    style="text-align:center"
    @open="getNews"
    center>
    <template>
      <el-row align="center" slot="title" style="margin-left: 125px">
                    <el-date-picker
                      v-model="nowMoth"
                      field="month"
                      size="mini"
                      type="month"
                      format="yyyy-MM"
                      value-format="yyyy-MM"
                      placeholder="选择月">
          </el-date-picker>
        <el-button size="mini" @click="getNewsLog">确认</el-button>
        <el-button size="mini" @click="getNews">重置</el-button>
      </el-row>
      <u-table
        key="list" use-virtual :row-height="30"
        :data="list"
        height="400px"
        :row-style="tableRowClassName"
        @selection-change="handleSelectionChange"
        :close-on-click-model="false">
        <u-table-column
          type="expand" width="30">
          <template slot-scope="scope" style="margin-left: 60px">
            <div v-if="scope.row.type === 0 || scope.row.type === 1">
              <el-form label-position="left" size="mini">
                <el-row v-for="(item,index) in scope.row.list" :key="index">
                    <el-form-item>
                      <span>{{ item.tec }} : {{ item.workday }}</span>
                    </el-form-item>
                </el-row>
              </el-form>
            </div>
            <div v-if="scope.row.type === 2">
              <el-form label-position="left" size="mini">
                <el-row>
                  <el-col :span="10">
                <el-form-item label="任务:">
                  <span>{{ scope.row.tnumber  }} - {{ scope.row.tname }}</span>
                </el-form-item>
                  </el-col>
                <el-form-item label="专业:" size="mini">
                  <span>{{ scope.row.tec }}</span>
                </el-form-item>
                </el-row>
                <el-row>
                  <el-col :span="10">
                <el-form-item label="申请工时:" size="mini">
                  <span>{{ scope.row.apply }}</span>
                </el-form-item>
                  </el-col>
                  <el-col :span="10">
                <el-form-item label="确认工时:" size="mini">
                  <input v-model="scope.row.workday" size="mini" style="width: 100px"></input>
                </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
            </div>
            <div v-if="scope.row.type === 3">
              <el-form label-position="left" size="mini">
                <el-row>
                  <el-col :span="10">
                <el-form-item label="专业名称">
                  <span>{{ scope.row.tec }}</span>
                </el-form-item>
                  </el-col>
                  <el-col :span="10">
                <el-form-item label="管理工时">
                  <span>{{ scope.row.manage }}</span>
                </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="10">
                <el-form-item label="备用工时">
                  <span>{{ scope.row.backup }}</span>
                </el-form-item>
                  </el-col>
                  <el-col :span="10">
                <el-form-item label="卷册工时">
                  <span>{{ scope.row.volume }}</span>
                </el-form-item>
                  </el-col>
                </el-row>
                    <el-row>
                      <el-col :span="10">
                <el-form-item label="设计比例">
                  <span>{{ scope.row.designer }}</span>
                </el-form-item>
                      </el-col>
                      <el-col :span="10">
                <el-form-item label="校核比例">
                  <span>{{ scope.row.checker }}</span>
                </el-form-item>
                      </el-col>
                    </el-row>
                        <el-row>
                          <el-col :span="10">
                <el-form-item label="主设比例">
                  <span>{{ scope.row.principal }}</span>
                </el-form-item>
                          </el-col>
                          <el-col :span="10">
                <el-form-item label="组长比例">
                  <span>{{ scope.row.headman }}</span>
                </el-form-item>
                          </el-col>
                        </el-row>
              </el-form>
            </div>
            <div v-if="scope.row.type === 4">
              <el-form label-position="left" size="mini">
                <el-row v-for="(item,index) in scope.row.list" :key="index+'4'">
                  <el-form-item >
                    <span>{{ item.number }} - {{ item.name }} : 总工时{{ item.workday }}
                    设计：{{ item.designer }}， 校核：{{ item.checker }}，
                      主设：{{ item.principal }}， 组长：{{ item.headman }}</span>
                  </el-form-item>
                </el-row>
              </el-form>
            </div>
            <div v-if="scope.row.type === 5">
              <el-form label-position="left" size="mini">
                <el-row v-for="(item,index) in scope.row.list" :key="index + '5'">
                  <el-form-item >
                    <span>{{ item.number }} - {{ item.name }} :
                    {{ item.workday }}</span>
                  </el-form-item>
                </el-row>
              </el-form>
            </div>
          </template>
        </u-table-column>
        <u-table-column
          label="审核类型"
          width="100px"
          prop="type">
          <template slot-scope="scope">
            <span>
            {{scope.row.type | typeFilter}}
            </span>
          </template>
        </u-table-column>
        <u-table-column
          label="发起人"
          width="100px"
          prop="handler">
        </u-table-column>
        <u-table-column
          label="专业"
          width="100px"
          prop="tec">
        </u-table-column>
        <u-table-column
          label="项目编号"
          width="100"
          prop="number" show-overflow-tooltip>
        </u-table-column>
          <u-table-column
          label="项目名称"
          width="500"
          prop="name" show-overflow-tooltip>
        </u-table-column>
        <el-table-column
          fixed="right"
          type="selection"
          :selectable="selectable"
          width="30"
        v-if="logSelection"/>
      </u-table>
    </template>
        <span slot="footer" v-if="logSelection">
          <el-button @click="CheckerCancel">回退</el-button>
          <el-button @click="CheckerConfirm" type ="primary">通过</el-button>
        </span>
  </el-dialog>
  </div>
</template>

<script>
const typeList = [{id : 0, name : "项目工时"},
{id : 1, name : "工时申请"},
{id : 2, name : "设总备用"},
{id : 3, name : "专业工时"},
  {id : 4, name : "卷册工时"},
  {id : 5, name : "工时报审"},]

export default {
name: "news",
  props: {
  },
  data(){
    return{
      getRowKeys(row) {
        return row.id;
      },
      expands : [],
      id : "",
      name : "",
      nowMoth : null,
      isShow: false,
      count : 0,
      list: [],
      multipleSelection : [],
      logSelection : true,
    }
  },
  watch:{
  },
  filters:{
    typeFilter(val){
      const s = typeList.find(obj => obj.id === val)
      return s.name
    }
  },
  mounted() {
    this.getNews()
    },
  methods:{
    // getCount(){
    //   this.$axios
    //     .post(this.$baseUrl + "news/count",{},{headers:{id:this.id}})
    //     .then(res => {
    //       this.count  = res.data.data
    //       this.$forceUpdate
    //     })
    //     .catch( res => console.log(res))
    // },
    getNews(){
      this.$axios
        .post(this.$baseUrl + "news/query",{})
        .then(res => {
          this.list = res.data.data
          this.logSelection = true;
        })
        .catch( res => console.log(res))
    },
    getNewsLog(){
      this.$axios
        .post(this.$baseUrl + "news/queryLog",{},{headers:{queryDate : this.nowMoth}})
        .then(res => {
          this.list = res.data.data
          this.logSelection = false
        })
        .catch( res => console.log(res))
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    CheckerConfirm(row) {
      if (this.multipleSelection.length === 0){
        this.$message.warning("未选审核项")
      }
        this.$axios
          .post(this.$baseUrl + "news/check",this.multipleSelection,{headers :{ check :1}})
          .then(res => {
            if(res.data.code === 0){
              this.getNews();
            this.$message.success("审核通过成功")
            this.isShow = false;
            }
                        })
          .catch( res => console.log(res))
    },
    CheckerCancel(row){
      if (this.multipleSelection.length === 0){
        this.$message.warning("未选审核项")
      }
        this.$axios
          .post(this.$baseUrl + "news/check",this.multipleSelection,{headers : {check : 2}})
          .then(res => {
            if(res.data.code === 0){
            this.getNews();
            this.$message.success("审核回退成功")
            this.isShow = false;
            }
                        })
          .catch( res => console.log(res))
    },
    clickRowHandle(row, column, event) {
      if (column.property !== undefined) {
        this.expands.push(row);
      }
    },
    tableRowClassName({row, rowIndex}){
      if (row.result) {
        return  { backgroundColor: "#F0E68C" };
      }
      return '';
    },
    selectable(row,index){
      return !row.result
    }
  }
}
</script>

<style>
.mZIndex{
  z-index:3000 !important;
}
</style>
