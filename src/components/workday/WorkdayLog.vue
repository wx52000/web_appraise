<template>
  <u-table use-virtual :row-height="28" border :data="list" class="u-table"
           :header-cell-style="{background:'#F5F5F5' } "
           :default-sort = "{prop: 'date', order: 'descending'}"
           v-loading="loading" size = "mini">
    <u-table-column prop="number" min-width="13  %" label="卷册号" sortable align="center"  >
    </u-table-column>
    <u-table-column prop="volume" min-width="20" label="卷册名称" sortable align="center" style="word-break: break-all;">
    </u-table-column>
    <u-table-column prop="name" label="发放人" min-width="6%" align="center"
                    >
    </u-table-column>
    <u-table-column prop="type" label="发放类型" min-width="6%" align="center"
                    >
    </u-table-column>
    <u-table-column prop="workday" label="工时" min-width="6%" align="center"
                    sortable>
    </u-table-column>
    <u-table-column prop="this_grant" label="本次发放工时" width="140" align="center"
                    sortable>
    </u-table-column>
    <u-table-column prop="date" label="发放时间" min-width="6%" align="center" sortable>
    </u-table-column>
    <u-table-column prop="old" min-width="9%"  label="原工时" align="center" sortable>
    </u-table-column>
  </u-table>
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
    }
  },

  mounted() {
    this.projectId = this.$route.query.project_id;
  this.getData()
  },
  methods : {
  getData(){
    this.$axios
      .post(this.$baseUrl + 'volume/queryVolumeWorkdayLog', {
        id : this.projectId,
        min : "2021-10-01",
        max : "2021-12-01"
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
