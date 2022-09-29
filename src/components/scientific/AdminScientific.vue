<template>
  <div>
    <el-form >
      <el-row>
        <!-- 列表 -->
        <el-row style="background-color: #FFF; text-align: center">
          <el-row>
            <el-row style="margin-left:-10px;text-align: center; align-content: center;">
              <el-col :span="24" style="line-height: 50px;font-size: 16px;font-weight: bold;color: #666;text-align: center ">
                科技项目管理
              </el-col>
            </el-row>
            <el-row style="margin-left:-10px; align-content: center;">

              <el-col align="right">
                <el-button style="margin-right: 20px" size="mini" type="primary" @click="openNewScientific">新增科技项目</el-button>
              </el-col>
            </el-row>
            <div>
              <u-table use-virtual :row-height="28" border size="mini" :data="list.filter(data =>{
            return  !search || (data.number.toLowerCase().includes(search.toLowerCase())
            || data.name.toLowerCase().includes(search.toLowerCase())
             || data.general.toLowerCase().includes(search.toLowerCase())) })"
                       class="u-table"
                       :height="pageHeight"
                       showBodyOverflow="title"
                       showHeaderOverflow="title"
                       :data-changes-scroll-top="false"
                       :header-cell-style="{background:'#F5F5F5'}" :cell-style="this.CellStyleOne">
                <u-table-column
                  type="index"
                  align="center"
                  width="50">
                </u-table-column>
                <u-table-column prop="number" sortable min-width="120px" show-overflow-tooltip label="项目编号" align="center"  >
                </u-table-column>
                <u-table-column prop="name" sortable min-width="210px" show-overflow-tooltip label="项目名称" align="center">
                </u-table-column>
                <u-table-column prop="workday" sortable width="70px" label="总工时"  align="center">
                </u-table-column>
                <u-table-column prop="used" sortable width="80px" label="已用工时"  align="center">
                </u-table-column>
                <u-table-column prop="have" sortable width="80px" label="可用工时"  align="center">
                </u-table-column>
                <u-table-column prop="general" sortable width="80px" label="设总" align="center" style="word-break: break-all;">
                </u-table-column>
                <u-table-column  width="180px" align="center" fixed="right">
                  <template slot-scope="scope" slot="header">
                    <el-input  size="mini" v-model="search"
                               placeholder="请输入需要查询的项目编号或项目名称" />
                  </template>
                  <template slot-scope="scope">
                    <el-row>
                      <el-col :span="12">
                        <el-button
                          size="mini"
                          @click="openScientificMain(scope.row)">项目主页</el-button>
                      </el-col>
                      <el-col :span="12">
                        <el-button
                          size="mini"
                          @click="openScientific(scope.row)">修改</el-button>
                      </el-col>
                    </el-row>
                  </template>
                </u-table-column>
              </u-table>
            </div>
          </el-row>
        </el-row>
      </el-row>
    </el-form>
    <el-dialog
      v-el-drag-dialog
      :title="scientific.title"
      :visible.sync="newVisible"
      width="60%" style="text-align: center">
      <el-form size="mini">
        <el-row>
          <el-row style="margin-right: 50px">
            <el-col :span="12">
              <el-form-item label-width="120px" label="项目编号" >
                <el-input size="mini" v-model="scientific.number"
                          :disabled="scientific.disable" style="width: 100%">
                </el-input>
              </el-form-item >
            </el-col>
            <el-col :span="12">
              <el-form-item label-width="120px" label="项目名称">
                <el-input size="mini" v-model="scientific.name">
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row style="margin-right: 50px">
            <el-col :span="12">
              <el-form-item label-width="120px" label="设总">
                <el-select v-model="scientific.general" size="mini"
                           :filterable="true"  :remote="true"
                           :remote-method="(e) => remoteMethod(e)"
                           value-key="id"
                           style="width: 100%"
                           :loading="loading"
                           placeholder="请输入人员姓名或工号">
                  <el-option
                    v-for="(item,index) in generalList"
                    :key="item.id"
                    :label="item.name"
                    :value="item">
                    <span style="float: left">{{ item.name }}</span>
                    <span style="float: right; color: #8492a6; font-size: 13px">{{ item.username }}</span>
                  </el-option></el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label-width="120px" label="工时总数" >
                <el-input  size="mini" v-model="scientific.workday" oninput="value=value.replace(/[^\d.]/g,'')">
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row style="text-align: right">
            <el-col :span="12">
              <el-form-item style="margin-left: -50px;text-align: center">
                <el-button size="">取消</el-button>
                <el-button @click="ScientificSubmit" size="mini" type="primary">确认</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-row>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
export default {
name: "AdminScientific",
  data(){
    return{
      pageHeight : document.body.clientHeight,
      list : [],
      search: "",
      newVisible : false,
      scientific : {
        number : "",
        disable : false,
        name : "",
        general : "",
        workday : 0
      },
      generalList : [],
      loading : false,
    }
  },
  mounted() {
  this.getData();
  },
  methods : {
    getData() {
      this.$axios
        .post(this.$baseUrl + 'scientific/query',
        )
        .then(res => {
          this.list = res.data.data
        })
        .catch(res => (console.log(res)));
    },
    openNewScientific(){
      this.scientific = {
        title : "新增科技项目",
        number : "",
        name : "",
        general : "",
        workday : 0
      }
      this.newVisible = true
    },
    openScientific(row){
      this.scientific = {
        id : row.id,
        title : "科技项目修改",
        disable : true,
        number : row.number,
        name : row.name,
        general : row.general,
        workday : row.workday
      }
      this.newVisible = true
    },
    ScientificSubmit(){
      this.$axios
        .post(this.$baseUrl + 'scientific/addScientific',this.scientific
        )
        .then(res => {
          this.newVisible = false
          this.getData()
          this.$message.success("操作成功")
        })
        .catch(res => (console.log(res)));
    },
    remoteMethod(query) {
      if (query !== '') {
        this.loading = true;
        setTimeout(() => {
          this.$axios
            .post(this.$baseUrl + 'user/queryByName', {
                "name" : query
              }
            )
            .then(res => {
                this.generalList = res.data.data
            });
          this.loading = false;
        }, 200);
      } else {
        this.generalList = [];
      }
    },
    openScientificMain(row){
      const href = this.$router.resolve(
        {
          path: "/scientificMain",
          name: "scientificMain",
          query:{
            "scientific_id" : row.id
          }
        }
      )
      window.open( href.href,row.id)
    }
  }
}
</script>

<style scoped>

</style>
