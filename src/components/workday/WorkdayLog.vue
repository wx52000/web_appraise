<template>
  <div>
    <el-row>
      <span class="demonstration">日志范围</span>
      <el-date-picker
        v-model="date"
        size="mini"
        type="daterange"
        value-format="yyyy-MM-dd"
        range-separator="至"
        @change="getData"
        start-placeholder="开始月份"
        end-placeholder="结束月份">
      </el-date-picker>
    </el-row>
  <u-table use-virtual :row-height="28" border :data="list" class="u-table"
           :header-cell-style="{background:'#F5F5F5' } "
           showBodyOverflow="title"
           showHeaderOverflow="title"
           :data-changes-scroll-top="false"
           :default-sort = "{prop: 'date', order: 'descending'}"
           v-loading="loading" size = "mini">
    <u-table-column prop="number" min-width="13  %" label="卷册号" sortable align="center"  >
    </u-table-column>
    <u-table-column prop="volume" min-width="20" label="卷册名称" sortable align="center" style="word-break: break-all;">
    </u-table-column>
    <u-table-column prop="name" label="操作人" min-width="6%" align="center"
                    >
    </u-table-column>
    <u-table-column prop="type" label="操作类型" min-width="6%" align="center"
                    >
    </u-table-column>
    <u-table-column prop="workday" label="工时" min-width="6%" align="center"
                    sortable>
    </u-table-column>
    <u-table-column prop="date" label="操作时间" min-width="6%" align="center" sortable>
    </u-table-column>
    <u-table-column prop="old" min-width="9%"  label="原工时" align="center" sortable>
    </u-table-column>
  </u-table>
  </div>
</template>

<script>
export default {
name: "WorkdayLog",
  data(){
  return {
    loading : false,
    list : [],
    typeList : [],
    users : [],
    projectId : "",
    date : '',
    }
  },

  mounted() {
    const a = new Date();
    const  end = a.getFullYear() + "-" + (Number(a.getMonth())+1).toString().padStart(2,0) + "-" + a.getDate().toString().padStart(2,0)
    const b = new Date(new Date().getTime()-3600*24*30*1000)
    const start =  b.getFullYear() + "-" + (Number(b.getMonth())+1).toString().padStart(2,0) + "-" + b.getDate().toString().padStart(2,0)
    this.date = [start,end]
    this.projectId = this.$route.query.project_id;
  this.getData()
  },
  methods : {
  getData(){
    this.$axios
      .post(this.$baseUrl + 'volume/queryVolumeWorkdayLog', {
        id : this.projectId,
        min : this.date[0],
        max : this.date[1]
      })
      .then(res => {
        this.list = res.data.data
      })
      .catch(res => (console.log(res)));
  }
  },
}
</script>

<style scoped>

</style>
