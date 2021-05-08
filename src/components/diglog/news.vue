<template>
  <div>
    <el-badge :value="count" :max="99" class="item" @click.native="isShow = !isShow">
      <el-button circle icon="el-icon-chat-square"></el-button>
    </el-badge>
  <el-dialog
    :visible.sync="isShow"
    width= "60%"
    :close-on-click-modal="false"
    :append-to-body="true"
    z-index="1000"
    @open="getNews"
    @close="close"
    center>
    <template>
      <el-table
        :data="list"
        style="width: 100%"
        :row-key="getRowKeys"
        :expand-row-keys="expands"
        :close-on-click-model="false"
        @row-click="clickRowHandle">
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="申请名称">
                <span>{{ props.row.name }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column
          label="申请名称"
          min-width="20%"
          prop="name">
        </el-table-column>
        <el-table-column
          label="创建人"
          min-width="10%"
          prop="create_user">
        </el-table-column>
        <el-table-column
          label="创建时间"
          min-width="15%"
          prop="create_date">
        </el-table-column>
        <el-table-column  align="center" min-width="20%">
          <template slot-scope="scope">
            <el-row>
              <el-col :span="24">
                <template>
                  <el-popconfirm
                    title="确认审核通过吗？"
                    confirm-button-text='确认'
                    cancel-button-text='不通过'
                    @onConfirm="CheckerConfirm(scope.row)"
                    @onCancel="CheckerCancel(scope.row)"
                  >
                <el-button
                  size="mini"
                  slot="reference">审核</el-button>
                  </el-popconfirm>
                </template>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
      </el-table>
    </template>
  </el-dialog>
  </div>
</template>

<script>
export default {
name: "newsDialog",
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
      isShow: false,
      count : 0,
      list: []
    }
  },
  watch:{
    // isShow(value){
    //   console.log(value)
    // }
  },
  mounted() {
    let i = JSON.parse(sessionStorage.getItem("appraise"));
    if (i != null) {
      this.logIn = true;
      this.id = i.id;
      this.name = i.name;
      this.getCount();
      }
    },
  methods:{
    getCount(){
      this.$axios
        .post(this.$baseUrl + "news/count",{},{headers:{id:this.id}})
        .then(res => {
          this.count  = res.data.data
        })
        .catch( res => console.log(res))
    },
    getNews(){
      this.$axios
        .post(this.$baseUrl + "news/query",{},{headers:{id:this.id}})
        .then(res => {
          this.list = res.data.data
        })
        .catch( res => console.log(res))
    },
    close(){
    },
    CheckerConfirm(row) {
        this.$axios
          .post(this.$baseUrl + "activity/state",{
            id : row.id,
            checker : this.id,
            state : 1
          })
          .then(res => {
            if (res.data.code === 0) {
              this.$message({
                type: 'success',
                message: '审核!'
              });
            }else if(res.data.code === 56){
              this.$message({
                type: 'error',
                message: '暂无此权限!'
              });
            }
          })
          .catch( res => console.log(res))
    },
    CheckerCancel(row){
      this.$axios
        .post(this.$baseUrl + "activity/state",{
          id : row.id,
          checker : this.id,
          state : 2
        })
        .then(res => {
          if (res.data.code === 0) {
            this.$message({
              type: 'success',
              message: '审核!'
            });
          }else if(res.data.code === 56){
            this.$message({
              type: 'error',
              message: '暂无此权限!'
            });
          }
        })
        .catch( res => console.log(res))
    },
    clickRowHandle(row, column, event) {
      if (column.property !== undefined) {
        if (this.expands.includes(row.id)) {
          this.expands = this.expands.filter(val => val !== row.id);
        } else {
          this.expands.push(row.id);
        }
      }
    },
  }
}
</script>

<style>
.mZIndex{
  z-index:3000 !important;
}
</style>
