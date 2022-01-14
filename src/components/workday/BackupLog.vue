<template>
  <u-table use-virtual :row-height="28" border :data="list" class="u-table"
           :header-cell-style="{background:'#F5F5F5' } "
           :default-sort = "{prop: 'date', order: 'descending'}"
           v-loading="loading" size = "mini">
    <u-table-column prop="issuer" label="发放人" min-width="6%" align="center"
    >
    </u-table-column>
    <u-table-column prop="user" label="发放人" min-width="6%" align="center"
    >
    </u-table-column>
    <u-table-column prop="workday" label="工时" min-width="6%" align="center"
                    sortable>
    </u-table-column>
    <u-table-column prop="date" label="发放时间" min-width="6%" align="center" sortable>
    </u-table-column>
    <u-table-column prop="old" min-width="9%"  label="原工时" align="center" sortable>
    </u-table-column>
    <u-table-column prop="time" min-width="9%"  label="操作时间" align="center" sortable>
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
        .post(this.$baseUrl + 'volume/queryBackupWorkdayLog', {
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
