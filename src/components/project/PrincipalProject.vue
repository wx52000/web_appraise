  <template>
    <div>
      <el-form :model="form">
        <el-row>
          <!-- 列表 -->
          <el-row style="background-color: #FFF; text-align: center">
            <el-row>
              <el-row style="margin:0 auto;text-align: center; align-content: center">
                <el-col :span="24" style="line-height: 50px;font-size: 16px;font-weight: bold;color: #666;text-align: center ">
                  卷册管理
                </el-col>
              </el-row>
              <el-table border :data="list" class="el-table"
                        :header-cell-style="{background:'#F5F5F5' } "
                        :row-class-name="tableRowClassName"
                        :row-key="getRowKeys"
                        :expand-row-keys="expands"
                        @row-click="clickRowHandle"
                        :default-sort = "{prop: 'date', order: 'descending'}">
                <el-table-column type="expand" >
                  <template  slot-scope="scope">
                    <el-form label-position="left" inline class="demo-table-expand">
                      <el-form-item label="互校人：">
                        <span>{{scope.row.checker}}</span>
                      </el-form-item>
                      <el-form-item label="计划出手日期：">
                        <span>{{timeConversion(scope.row.planned_shot_date)}}</span>
                      </el-form-item>
                      <el-form-item label="出手日期：">
                        <span>{{timeConversion(scope.row.shot_date)}}</span>
                      </el-form-item>
                      <el-form-item label="互校人完成时间：">
                        <span>{{timeConversion(scope.row.proofreading_date)}}</span>
                      </el-form-item>
                      <el-form-item label="计划出版时间：">
                        <span>{{timeConversion(scope.row.planned_publication_date)}}</span>
                      </el-form-item>
                      <el-form-item label="实际最终出版时间：">
                        <span>{{timeConversion(scope.row.actual_publication_date)}}</span>
                      </el-form-item>
                      <el-form-item label="完成日期">
                        <span>{{timeConversion(scope.row.complete_time)}}</span>
                      </el-form-item>
                      <el-form-item label="设计人本周完成比例：" >
                        <span>{{recordConversion(scope.row.designerList,0,0)}}%</span>
                      </el-form-item>
                      <el-form-item label="备注：" >
                        <span>{{recordConversion(scope.row.designerList,0,1)}}</span>
                      </el-form-item>
                      <el-form-item label="设计人上次完成比例：">
                        <span>{{recordConversion(scope.row.designerList,1,0)}}%</span>
                      </el-form-item>
                      <el-form-item label="备注：">
                        <span>{{recordConversion(scope.row.designerList,1,1)}}</span>
                      </el-form-item>
                      <el-form-item label="互校人本周完成比例：">
                        <span>{{recordConversion(scope.row.checkerList,0,0)}}%</span>
                      </el-form-item>
                      <el-form-item label="备注：">
                        <span>{{recordConversion(scope.row.checkerList,0,1)}}</span>
                      </el-form-item>
                      <el-form-item label="互校人上次完成比例：">
                        <span>{{recordConversion(scope.row.checkerList,1,0)}}%</span>
                      </el-form-item>
                      <el-form-item label="备注：">
                        <span>{{recordConversion(scope.row.checkerList,1,1)}}</span>
                      </el-form-item>
                    </el-form>
                  </template>
                </el-table-column>
                <el-table-column prop="number" min-width="13%" label="卷册号" sortable align="center"  >
                </el-table-column>
                <el-table-column prop="volumeName" min-width="24%" label="卷册名称" sortable align="center" style="word-break: break-all;">
                </el-table-column>
                <el-table-column prop="projectName" min-width="18%" label="项目名称" align="center"
                :filters="projectList" :filter-method="filterHandler">
                </el-table-column>
                <el-table-column prop="designer" label="设计人" min-width="6%" align="center"
                              :filters="designerList" :filter-method="filterHandler1">
                </el-table-column>
                <el-table-column prop="workday" label="工时" min-width="6%" align="center"
                                 sortable>
                </el-table-column>
                <el-table-column prop="state" min-width="9%"  label="状态" align="center"
                                 :filters="[{text:'尚未开展',value:'尚未开展'},{text:'正在设计',value:'正在设计'},
                            {text:'正在校审',value:'正在校审'},{text:'代送出版',value:'代送出版'},
                            {text:'正在出版',value:'正在出版'},{text:'代送业主',value:'代送业主'},
                            {text:'已完成交付设总',value:'已完成交付设总'},{text:'已完成交付业主',value:'已完成交付业主'}]"
                                 :filter-method="filterHandler1">
                </el-table-column>
                <el-table-column
                  align="center"  min-width="10%" style="text-align: center">
                  <template slot-scope="scope" style="text-align: center">
                    <el-button
                      size="mini"
                      @click="openVolume(formId = scope.row.rollId)">卷册详情页面</el-button>
                  </template>
                </el-table-column>
                <el-table-column
                  align="center"  min-width="9%" >
                  <template slot-scope="scope">
                    <el-button
                      size="mini"
                      @click="handleReport(scope.$index, scope.row)">每周汇报</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-row>
          </el-row>
        </el-row>
      </el-form>
      <el-dialog
        title="操作页面"
        :visible.sync="dialogVisible"
        width="60%">
        <el-container>
  <!--        <el-header style="background: #B3C0D1 ;color: #333; text-align: left;height:40px;padding-top: 10px" >-->
  <!--          <el-row>-->
  <!--            <el-col :span="8">卷册管理</el-col>-->
  <!--            <el-col :span="16" align="right">-->
  <!--              <el-button type="primary" size="mini"   @click="handleAdd" plain>新增卷册</el-button>-->
  <!--            </el-col>-->
  <!--          </el-row>-->
  <!--        </el-header>-->
          <el-form :model="volume">
            <el-main>
                  <el-form-item label="卷册号" style="width: 80%; ">
                    <el-input type="text"  v-model="volume.number" style="width: 80%;margin-left: 15px"></el-input>
                  </el-form-item>
                  <el-form-item label="卷册名称" style="width: 80%">
                    <el-input type="text"  v-model="volume.name" style="width: 80%"></el-input>
                  </el-form-item>
                  <el-row>
                    <el-col :span="12">
                      <el-form-item label="卷册等级" >
                        <el-input type="number" inline  v-model="volume.grade" style="width: 50%;margin-right: 26px"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="专业"  >
                        <el-select v-model="volume.tec" disabled placeholder="请选择"  style="width: 50%;margin-left: 15px">
                          <el-option
                            v-for="item in tecList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                          </el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="12">
                      <el-form-item label="设计人" >
                        <el-select v-model="volume.designer" filterable  placeholder="请选择"  style="width: 50%;margin-left: -15px">
                          <el-option
                            v-for="item in userList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                          </el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="互校人">
                        <el-select v-model="volume.checker"  filterable placeholder="请选择"  style="width: 50%">
                          <el-option
                            v-for="item in userList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                          </el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="12">
                      <el-form-item label="组长完成时间" prop="headman_date">
                        <el-date-picker
                          v-model="volume.headman_date"
                          type="date"
                          format="yyyy-MM-dd"
                          value-format="timestamp"
                          placeholder="选择日期" style="width: 50%;margin-left:  -60px">
                        </el-date-picker>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="互校人完成时间" prop="checker_date">
                        <el-date-picker
                          v-model="volume.checker_date"
                          type="date"
                          format="yyyy-MM-dd"
                          value-format="timestamp"
                          placeholder="选择日期" style="width: 50%;margin-left:  -60px">
                        </el-date-picker>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="12">
                      <el-form-item label="计划出版时间">
                        <el-date-picker
                          v-model="volume.planned_publication_date"
                          type="date"
                          format="yyyy-MM-dd"
                          value-format="timestamp"
                          placeholder="选择日期" style="width: 50%;margin-left:  -60px">
                        </el-date-picker>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="实际出版时间">
                        <el-date-picker
                          v-model="volume.actual_publication_date"
                          type="date"
                          format="yyyy-MM-dd"
                          value-format="timestamp"
                          placeholder="选择日期" style="width: 50%;margin-left:  -45px">
                        </el-date-picker>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="12">
                      <el-form-item label="接收对外专业资料时间" style="margin-left: -15px" >
                        <el-date-picker
                          v-model="volume.professional_date"
                          type="date"
                          format="yyyy-MM-dd"
                          value-format="timestamp"
                          placeholder="选择日期" style="width: 50%">
                        </el-date-picker>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="对外提资时间">
                        <el-date-picker
                          v-model="volume.withdrawal_date"
                          type="date"
                          format="yyyy-MM-dd"
                          value-format="timestamp"
                          placeholder="选择日期" style="width: 50%;margin-left:  -45px">
                        </el-date-picker>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="12">
                      <el-form-item label="出手日期" >
                        <el-date-picker
                          v-model="volume.shot_date"
                          type="date"
                          format="yyyy-MM-dd"
                          value-format="timestamp"
                          placeholder="选择日期" style="width: 50%;margin-left:  -30px">
                        </el-date-picker>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="完成日期">
                        <el-date-picker
                          v-model="volume.complete_time"
                          type="date"
                          format="yyyy-MM-dd"
                          value-format="timestamp"
                          placeholder="选择日期" style="width: 50%;margin-left:  -15px">
                        </el-date-picker>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-button type="primary" size="mini" @click="updVolume"  round style="margin-left: 80%">确 定</el-button>
            </el-main>
          </el-form>
        </el-container>
      </el-dialog>
      <el-dialog
        title="新增页面"
        :visible.sync="addVisible"
        width="60%" >
        <el-container>
          <el-header style="background: #B3C0D1 ;color: #333; text-align: left;height:40px;padding-top: 10px" >
            <el-row>
              <el-col :span="8">卷册新增</el-col>
            </el-row>
          </el-header>
          <el-form :model="newVolume" ref="newVolume">
            <el-main>
              <el-carousel height="500px" :autoplay=false>
                <el-carousel-item>
                  <el-form-item label="卷册号" style="width: 80%; " prop="number">
                    <el-input type="text"  v-model="newVolume.number" style="width: 80%;margin-left: 15px"></el-input>
                  </el-form-item>
                  <el-form-item label="卷册名称" style="width: 80%">
                    <el-input type="text"  v-model="newVolume.name" style="width: 80%"></el-input>
                  </el-form-item>
                  <el-row>
                    <el-col :span="12">
                      <el-form-item label="卷册等级" prop="grade">
                        <el-input type="number" inline  v-model="newVolume.grade" style="width: 50%;margin-right: 26px"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="专业" >
                        <el-select v-model="this.tid" disabled placeholder="请选择"  style="width: 50%;margin-left: 15px">
                          <el-option
                            v-for="item in tecList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                          </el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="12" >
                      <el-form-item label="设计人" prop="designer">
                        <el-select v-model="newVolume.designer" filterable  placeholder="请选择"  style="width: 50%;margin-left: -15px">
                          <el-option
                            v-for="item in userList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                          </el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="互校人" prop="checker">
                        <el-select v-model="newVolume.checker"  filterable placeholder="请选择"  style="width: 50%">
                          <el-option
                            v-for="item in userList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                          </el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="12" >
                      <el-form-item label="计划出版时间" prop="planned_publication_date">
                        <el-date-picker
                          v-model="newVolume.planned_publication_date"
                          type="date"
                          format="yyyy-MM-dd"
                          value-format="timestamp"
                          placeholder="选择日期" style="width: 50%;margin-left:  -60px">
                        </el-date-picker>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="对外提资时间" prop="withdrawal_date">
                        <el-date-picker
                          v-model="newVolume.withdrawal_date"
                          type="date"
                          format="yyyy-MM-dd"
                          value-format="timestamp"
                          placeholder="选择日期" style="width: 50%;margin-left:  -45px">
                        </el-date-picker>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="12">
                      <el-form-item label="接收对外专业资料时间" style="margin-left: -15px" prop="professional_date" >
                        <el-date-picker
                          v-model="newVolume.professional_date"
                          type="date"
                          format="yyyy-MM-dd"
                          value-format="timestamp"
                          placeholder="选择日期" style="width: 50%">
                        </el-date-picker>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-button type="primary" size="mini" @click="addVolume"  round style="margin-left: 80%">确 定</el-button>
                </el-carousel-item>
              </el-carousel>
            </el-main>
          </el-form>
        </el-container>
      </el-dialog>
      <el-dialog
        id="report"
        title="每周汇报"
        :visible.sync="visible"
        width="40%">
        <div style="width:100%;text-align:center">
          <el-form id="paw" :model="proportion" :rules="ruleValidate" label-width="100px" >
            <el-row>
              <el-col>
              <span >
                已完成比例:{{lastReport.proportion}}%
              </span>
              </el-col>
            </el-row>
            <el-row>
              <el-form-item prop="report" label="完成比例" >
                <el-input pro v-model="proportion.report" type="number"  autocomplete="off"
                          placeholder="本周完成比例" max="100">
                  <template slot="append">%</template>
                </el-input>
              </el-form-item>
            </el-row>
            <el-form-item prop="remark" label="备注" >
              <el-autocomplete
                class="inline-input"
                v-model="proportion.remarks"
                :fetch-suggestions="querySearch"
                placeholder="存在问题、延期原因等"
                autosize
                style="width: 100%"
              ></el-autocomplete>
            </el-form-item>
            <el-button type="primary" @click="reporting" v-if="lastReport.state === 0" >确定</el-button>
          </el-form>
        </div>
      </el-dialog>
      <news-dialog class="news" :is-show="isShow" @click.native="isShow = !isShow">
      </news-dialog>
    </div>
  </template>

  <script>
  export default {
    name: "PrincipalProject",
    data(){
      const report = async(rule, value, callback) => {
        var regPos = /^\d+(\.\d+)?$/;
        if (value === null || value === '') {
          this.paw1Check = 1
          return callback(new Error('完成比例不能为空'));
        } else if (!regPos.test(value) || value > 100 || value < 0) {
          this.paw1Check = 1
          return callback(new Error('完成比例必须为正数，且小于100大于0'));
        } else {
          this.paw1Check = 0
          callback()
        }
      }
      return{

        getRowKeys(row) {
          return row.vid;
        },
        // 要展开的行，数值的元素是row的key值
        expands: [],
        id: "",
        pid: "",
        tid: "",
        isShow : false,
        list: [],
        projectList :[],
        form: {},
        listIndex:0,
        meshRow:0,
        dialogVisible: false,
        addVisible : false,
        volume :{},
        tecList:[],
        userList:[],
        newVolume : {},
        new_pid: null,
        ruleValidate:{
          report: [
            { required: true, validator: report, trigger: 'blur' }
          ]
        },
        reportCheck : 0,
        lastReport : {},
        theMonth : new Date().getMonth() + 1,
        visible : false,
        proportion: {},
        designerList: [],
        reasons : [],
        nowWeek : "",
      }
    },
    mounted() {
      this.getLogIn();
      this.nowWeek = this.getWeek()
    },
    methods: {
      getLogIn() {
        let i = JSON.parse(sessionStorage.getItem("appraise"));
        this.id = i.id;
        this.pid = i.pid;
        this.tid = i.tid;
        this.getData();
        this.getOther()
      },
      tableRowClassName ({row, rowIndex}) {
        //把每一行的索引放进row
        row.index = rowIndex;
      },

      getData() {
        this.$axios
          .post(this.$baseUrl + 'project/queryByPrincipal', {
              "id": this.id
            }
          )
          .then(res => {
            this.list = res.data.data;
            this.list.forEach((item,index)=>{
              this.designerList.push2({value:item.designer,text:item.designer});
            })
          })
          .catch(res => (console.log(res)));
      },
      getOther() {
        let pro;
        this.$axios
          .post(this.$baseUrl + 'project/queryProByPrincipal', {
              "id": this.id
            }
          )
          .then(res => {
            pro = res.data.data;
            this.projectList = JSON.parse(JSON.stringify(pro).replace(/id/g,"value").replace(
              /name/g,"text"));
          })
          .catch(res => (console.log(res)));
      },
      clickRowHandle(row, column, event) {
        if (column.property !== undefined) {
          if (this.expands.includes(row.vid)) {
            this.expands = this.expands.filter(val => val !== row.vid);
          } else {
            this.expands.push(row.vid);
          }
        }
      },
      timeConversion(v){
        if (v !== undefined && v !== "") {
          if (!isNaN(v)) {
            let date = new Date(Number(v));
            let year = date.getFullYear();
            let month = date.getMonth() + 1;
            let day = date.getDate();
            return year + '-' + month + '-' + day;
          }else
            return v;
        } else
          return "";
      },
      recordConversion(v,i,n) {
        if (v != null && v!== "") {
          let recordOne = v.split("##")
          if ( recordOne.length !== 0) {
            if(i === 0 ){
              if (Number(recordOne[0].split("$")[2]) === Number(this.nowWeek)){
                return recordOne[i].split("$")[n]
              }else
                return null
            }else{
              if (Number(recordOne[0].split("$")[2]) === Number(this.nowWeek))
                if ( recordOne.length > 1)
                  return recordOne[i].split("$")[n]
                else return null
              else return recordOne[0].split("$")[n]
            }
          }else {
            return null
          }
      }
      },
      handleEdit(v, w){
        this.new_pid = w.pid;
        this.$axios
          .post(this.$baseUrl + 'volume/queryById',{},{"headers":{ 'id': w.vid}}
          )
          .then(res => {this.volume = res.data.data})
          .catch(res => (console.log(res)));
        this.dialogVisible = true;
        this.$axios
          .post(this.$baseUrl + 'projectTec/query',{},{"headers":{ 'id': w.pid}}
          )
          .then(res => {this.tecList = res.data.data})
          .catch(res => (console.log(res)));
        this.$axios
          .post(this.$baseUrl + 'user/queryByTec',{},{"headers":{ 'id': w.tid}}
          )
          .then(res => {this.userList = res.data.data})
          .catch(res => (console.log(res)));
      },
      updVolume(){
        let tec = this.volume.tec;
        if(typeof tec === "string"){
          tec = null
        }
        let designer = this.volume.designer;
        if(typeof designer === "string"){
          designer = null;
        }
        let checker = this.volume.checker;
        if(typeof checker === "string"){
          checker = null;
        }
        this.$axios
          .post(this.$baseUrl + 'volume/upd',{
            "id" : this.volume.id,
            "number" : this.volume.number,
            "name" : this.volume.name,
            "grade" : this.volume.grade,
            "tecId" : tec,
            "plannedPublicationDate" : this.volume.planned_publication_date,
            "actualPublicationDate" : this.volume.actual_publication_date,
            "professionalDate" : this.volume.professional_date,
            "withdrawalDate" : this.volume.withdrawal_date,
            "shotDate" : this.volume.shot_date,
            "completeDate" : this.volume.complete_time,
            "designer" : designer,
            "checker" : checker,
            "headmanDate" : this.volume.headman_date,
            "checkerDate" : this.volume.checker_date,
          })
          .then(res => {if(res.data.code === 0)
            this.$message("操作成功")
          else this.$message.error("操作失败，请重试")})
          .catch(res => (console.log(res)));
      },
      handleAdd(){
        this.newVolume = {}
        this.addVisible = true;
      },
      addVolume(){
        this.addVisible = true;
        this.$axios
          .post(this.$baseUrl + 'volume/add',{
            "pid" : this.new_pid,
            "number" : this.newVolume.number,
            "name" : this.newVolume.name,
            "grade" : this.newVolume.grade,
            "tecId" : this.tid,
            "plannedPublicationDate" : this.newVolume.planned_publication_date,
            "professionalDate" : this.newVolume.professional_date,
            "withdrawalDate" : this.newVolume.withdrawal_date,
            "designer" : this.newVolume.designer,
            "checker" : this.newVolume.checker,
            "creator" : this.id,
          })
          .then(res => {if(res.data.code ===0)
            this.$message("操作成功")
          else this.$message.error("操作失败，请重试")})
          .catch(res => (console.log(res)));
      },
      getMonthByLong(v){
        if (v !== undefined && v !== "") {
          let date = new Date(v);
          return  date.getMonth()+1;
        }
      },
      getWeekByLong(v) {
        if (v !== undefined && v !== "") {
          let date = new Date(v);
          return date.get + 1;
        }
      },
      handleReport(v,w){
        this.proportion = {};
        this.reportVid = w.vid;
        this.$axios
          .post(this.$baseUrl + 'proportion/queryLastTime',{
              "volumeId" : w.vid,
              "userId" : this.id,
              "type" : 2,
            }
          )
          .then(res => {this.lastReport = res.data.data
            if (this.lastReport.state === 1){
              this.proportion.report = this.lastReport.proportion;
              this.proportion.remarks = this.lastReport.remarks;
            }
          })
          .catch(res => (console.log(res)));
        this.$nextTick(() =>{
          this.$forceUpdate();
          this.visible = true;
        })
      },
      reporting(){
        if (this.reportCheck === 0){
          this.$axios
            .post(this.$baseUrl + 'proportion/add',{
                "volumeId" : this.reportVid,
                "userId" : this.id,
                "proportion" : this.proportion.report,
                "remarks" : this.proportion.remarks,
                "type" : 2,
              }
            )
            .then(res => {
              if (res.data.code === 0){
                this.$message("操作成功")
                this.visible = false;
              }
            })
            .catch(res => (console.log(res)));
        }
      },
      filterHandler(value, row, column) {
        // console.log(column)
        // const property = column['property'];
        return row['pid'] === value;
      },
      filterHandler1(value, row, column){
        const property = column['property'];
        return row[property] === value;
      },
      openVolume(f){
        // window.open('http://zmis.zepdi.com.cn/Portal/Sys/Workflow/FormDetail.aspx?actionType=1&formId=' + f +
        window.open('http://zmis.zepdi.com.cn/Portal/EPMS/List/RollInfo/ContentMange.aspx?actionType=1&RollID=' + f)
      },
      querySearch(queryString, cb) {
        if (this.reasons.length === 0) {
          this.$axios
            .post(this.$baseUrl + 'reason/queryByType',{},{headers:{"type":0}}
            )
            .then(res => {
              this.reasons = res.data.data
              cb(this.reasons)
            })
            .catch(res => (console.log(res)));
        }else
          cb(this.reasons)
      },
      getWeek(){
        // date = formatTimebytype(date, 'yyyy-MM-dd');//将日期转换成yyyy-mm-dd格式
        // let YY = date.getFullYear() + '-';
        // let MM = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
        // let DD = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate());
        let date = new Date()

        let date2 = new Date(date.getFullYear(), 0, 1);
        let day1 = date.getDay();
        if (day1 === 0) day1 = 7;
        let day2 = date2.getDay();
        if (day2 === 0) day2 = 7;
        let d = Math.round((date.getTime() - date2.getTime() + (day2 - day1) * (24 * 60 * 60 * 1000)) / 86400000);
        //当周数大于52则为下一年的第一周
        if((Math.floor(d / 7)) === 52){
          return 52
        }
        else return (Math.floor(d / 7))
      },
    }
  }
  </script>

  <style scoped>
  .demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 130px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
  .el-table {
    margin-top:20px;
    width: 90% ;
    horiz-align: center;
    left: 5%;
    font-size: 12px;
    word-wrap: break-word;
  }
  </style>
