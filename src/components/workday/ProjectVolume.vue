<template>
  <div>
    <el-row style="margin: 10px 0 10px 0">
      <el-col :span="8">
      <span style="font-size: 14px">条件模糊查询</span><el-input v-model="search"
                size="mini" style="width: 50%;" placeholder="卷册号\卷册名\设计\校核\工时发放月份"></el-input>
      </el-col>
      <el-col :span="16">
        <el-button size="mini" v-if="$parent.user.principal" @click="newTask">新增任务</el-button>
        <el-button size="mini" v-if="$parent.user.principal" @click="openDeclare">工时申报</el-button>
        <el-button size="mini" v-if="$parent.user.principal" @click="tecByPrincipal">工时统计</el-button>
      </el-col>
    </el-row>
  <u-table  use-virtual :row-height="28" borde
            :data="volumeList.filter((data) =>{
              return !search || (data.number.toLowerCase().includes(search.toLowerCase()))
              || (data.name !== undefined && data.name.toLowerCase().includes(search.toLowerCase()))
              || (data.designer !== undefined && data.designer.toLowerCase().includes(search.toLowerCase()))
              || (data.checker !== undefined && data.checker.toLowerCase().includes(search.toLowerCase()))
              || (data.submit_date !== undefined && data.submit_date.toLowerCase().includes(search.toLowerCase()))
            })"
            class="u-table"  :height="pageHeight" size="mini"
            :header-cell-style="{background:'#F5F5F5' } "
            :row-class-name="tableRowClassName"
            :row-key="getRowKeys"
           showBodyOverflow="title"
           showHeaderOverflow="title"
           :data-changes-scroll-top="false"
            :expand-row-keys="expands"
            @row-click="clickRowHandle"
            :default-sort = "{prop: 'date', order: 'descending'}"
            v-loading="volumeLoading">
    <u-table-column type="expand" >
      <template  slot-scope="scope">
        <el-form label-position="left" inline class="demo-table-expand">
          <el-form-item label="设计：" v-if="scope.row.type !== '设总管理'">
            <span v-if="scope.row.spider === 1 || !updateRole(scope.row)">{{scope.row.designer}}</span>
            <el-select v-model="scope.row.designer" style="width: 60%;" size="mini"
                       v-if="scope.row.spider === 0 && updateRole(scope.row)"
                       :filterable="true"  :remote="true"
                       :remote-method="remoteMethod"
                       value-key="id"
                       @change="taskUpdate('designer', scope.row)"
                       :loading="nameLoading"
                       placeholder="请输入人员姓名或工号">
              <el-option
              v-for="(item,index) in nameList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
              <span style="float: left">{{ item.name }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.username }}</span>
            </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="设计工时：" >
            <span v-if="scope.row.spider === 1 || !updateRole(scope.row)">{{scope.row.designer_workday}}</span>
            <el-input size="mini" v-model="scope.row.designer_workday" style="width: 60%;"
                      v-if="scope.row.spider === 0 && updateRole(scope.row)"
                      oninput="value=value.replace(/[^\d.]/g,'')"
            @change="changeWorkday(scope.row)"></el-input>
          </el-form-item>
          <el-form-item label="校核：" v-if="scope.row.type !== '设总管理'">
            <span v-if="scope.row.spider === 1 || !updateRole(scope.row)">{{scope.row.checker}}</span>
            <el-select v-model="scope.row.checker" style="width: 60%;" size="mini"
                       v-if="scope.row.spider === 0 && updateRole(scope.row)"
                       :filterable="true"  :remote="true"
                       :remote-method="remoteMethod"
                       value-key="id"
                       @change="taskUpdate('checker',scope.row)"
                       :loading="nameLoading"
                       placeholder="请输入人员姓名或工号">
              <el-option
              v-for="(item,index) in nameList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
              <span style="float: left">{{ item.name }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.username }}</span>
            </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="校核工时：" >
            <span v-if="scope.row.spider === 1 || !updateRole(scope.row)">{{scope.row.checker_workday}}</span>
            <el-input size="mini" v-model="scope.row.checker_workday" style="width: 60%;"
                      v-if="scope.row.spider === 0 && updateRole(scope.row)"
                      oninput="value=value.replace(/[^\d.]/g,'')"
                      @change="changeWorkday(scope.row)"></el-input>
          </el-form-item>
          <el-form-item label="主设：" v-if="scope.row.type !== '设总管理'">
            <span v-if="scope.row.spider === 1 || !updateRole(scope.row)">{{scope.row.principal}}</span>
            <el-select v-model="scope.row.principal" style="width: 60%;" size="mini"
                       v-if="scope.row.spider === 0 && updateRole(scope.row)"
                       :filterable="true"  :remote="true"
                       :remote-method="remoteMethod"
                       value-key="id"
                       @change="taskUpdate('principal',scope.row)"
                       :loading="nameLoading"
                       placeholder="请输入人员姓名或工号">
              <el-option
              v-for="(item,index) in nameList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
              <span style="float: left">{{ item.name }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.username }}</span>
            </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="主设工时：" >
            <span v-if="scope.row.spider === 1 || !updateRole(scope.row)">{{scope.row.principal_workday}}</span>
            <el-input size="mini" v-model="scope.row.principal_workday" style="width: 60%;"
                      v-if="scope.row.spider === 0 && updateRole(scope.row)"
                      oninput="value=value.replace(/[^\d.]/g,'')"
                      @change="changeWorkday(scope.row)"></el-input>
          </el-form-item>
          <el-form-item label="组长：" v-if="scope.row.type !== '设总管理'">
            <span v-if="scope.row.spider === 1 || !updateRole(scope.row)">{{scope.row.headman}}</span>
            <el-select v-model="scope.row.headman" style="width: 60%;" size="mini"
                       v-if="scope.row.spider === 0 && updateRole(scope.row)"
                       :filterable="true"  :remote="true"
                       :remote-method="remoteMethod"
                       value-key="id"
                       @change="taskUpdate('headman',scope.row)"
                       :loading="nameLoading"
                       placeholder="请输入人员姓名或工号">
              <el-option
              v-for="(item,index) in nameList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
              <span style="float: left">{{ item.name }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.username }}</span>
            </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="组长工时：" >
            <span v-if="scope.row.spider === 1 || !updateRole(scope.row)">{{scope.row.headman_workday}}</span>
            <el-input size="mini" v-model="scope.row.headman_workday" style="width: 60%;"
                      v-if="scope.row.spider === 0 && updateRole(scope.row)"
                      oninput="value=value.replace(/[^\d.]/g,'')"
                      @change="changeWorkday(scope.row)"></el-input>
          </el-form-item>
          <el-form-item label="计划出手日期："  v-if="scope.row.spider === 1">
            <span>{{scope.row.planned_shot_date}}</span>
          </el-form-item>
          <el-form-item label="出手日期："  v-if="scope.row.spider === 1">
            <span>{{scope.row.shot_date}}</span>
          </el-form-item>
          <el-form-item label="校核完成时间："  v-if="scope.row.spider === 1">
            <span>{{scope.row.proofreading_date}}</span>
          </el-form-item>
          <el-form-item label="计划出版时间："  v-if="scope.row.spider === 1">
            <el-date-picker style="width: 60%;"
                            v-if="scope.row.actual_publication_date === undefined && $parent.user.general"
                            v-model="scope.row.planned_publication_date"
                            type="date"
                            @change="(e) =>changeVolumePlanDate(e,scope.row)"
                            size = mini
                            value-format="yyyy-MM-dd"
                            placeholder="选择日期">
            </el-date-picker>
            <span v-else>
              {{scope.row.planned_publication_date}}</span>
          </el-form-item>
          <el-form-item label="实际出版时间："  v-if="scope.row.spider === 1">
            <span>{{scope.row.actual_publication_date}}</span>
          </el-form-item>
          <el-form-item label="计划完成日期：" v-if="scope.row.type !== '卷册'">
            <span>{{scope.row.planned_shot_date}}</span>
          </el-form-item>
          <el-form-item label="完成日期：" style="white-space:nowrap;">
            <span v-if="scope.row.spider === 1 || !updateRole(scope.row)">{{scope.row.complete_time}}</span>
            <el-date-picker style="width: 60%;"
                            v-if="scope.row.spider === 0 && updateRole(scope.row)"
                            v-model="scope.row.complete_time"
                            type="date"
                            @change="taskUpdate('end',scope.row)"
                            size = mini
                            value-format="yyyy-MM-dd"
                            placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="卷册工时：" v-if="scope.row.spider === 1&& updateRole(scope.row)">
            <el-input v-model="scope.row.workday" style="width: 60%;"
                      oninput="value=value.replace(/[^\d.]/g,'')"
                      size="mini" @change="changeWorkday(scope.row)"></el-input>
          </el-form-item>
          <el-form-item v-if="scope.row.spider === 1&& updateRole(scope.row)">
            <el-tooltip class="item" effect="dark" content="此按钮为对单个卷册的发放比例调整，不会改动其他卷册" placement="top">
            <el-button size="mini" @click="openVolumeWorkday(scope.row)"
                       v-if="scope.row.spider === 1 && updateRole(scope.row)">比例调整</el-button>
            </el-tooltip>
          </el-form-item>
          <el-form-item label="工时发放月份：" v-if="!updateRole(scope.row)">
            <span>{{scope.row.submit_date}}</span>
          </el-form-item>
        </el-form>
      </template>
    </u-table-column>
    <u-table-column prop="type" width="100px"
                    :filters="[{text:'卷册',value:'卷册'},{text:'管理',value:'管理'},
                            {text:'备用',value:'备用'},{text:'设总管理',value:'设总管理'}]"
                    :filter-method="filterHandler"
                    label="类型" align="center"  >
    </u-table-column>
    <u-table-column prop="number" min-width="100px" label="卷册号" sortable align="center"  >
    </u-table-column>
    <u-table-column prop="name" min-width="200px" label="卷册名称" sortable align="center" style="word-break: break-all;">
    </u-table-column>
    <u-table-column prop="tec" label="专业" min-width="80px" align="center"
                     :filters="tecList" :filter-method="filterHandler">
    </u-table-column>
    <u-table-column prop="state" width="100px"  label="状态" align="center"
                    :filters="[{text:'尚未开展',value:'尚未开展'},{text:'正在设计',value:'正在设计'},
                          {text:'正在校审',value:'正在校审'},{text:'待送出版',value:'待送出版'},
                          {text:'正在出版',value:'正在出版'},{text:'待送业主',value:'待送业主'},
                          {text:'已完成',value:'已完成'},{text:'院交出',value:'院交出'}]"
                    :filter-method="filterHandler">
    </u-table-column>
    <u-table-column prop="workday" label="工时" width="100px" align="center"
                     sortable>
    </u-table-column>
    <u-table-column prop="workday_state" label="工时状态" width="120px" align="center"
                    :filters="[{text:'未发放',value:0},{text:'已发放',value:1},
                          {text:'部分发放',value:2}]"
                    :filter-method="filterHandler">
    </u-table-column>
    <u-table-column  width="100px" label="操作" align="center">
      <template slot-scope="scope">
        <el-button size="mini" @click="openVolumeWorkdayAdvance(scope.row)"
                   v-if="scope.row.spider === 1 && updateRole(scope.row)">预发</el-button>
        <el-button size="mini" @click="delTask(scope.row)"
                   v-if="scope.row.spider === 0 && updateRole(scope.row)">删除</el-button>
      </template>
    </u-table-column>
  </u-table>
    <el-dialog
      v-el-drag-dialog
      title="预发"
      :visible.sync="volumeWorkdayVisible"
      width="60%" style="text-align: center">
      <el-form :model="volumeWorkdayHigh" size="mini" :inline="true">
        <el-row>
          <template>
            <el-radio-group v-model="volumeWorkdayHigh.ratio" @change="setWorkdayAdvance"
                            :disabled="volumeWorkdayHigh.workday_state === '已发放' || volumeWorkdayHigh.workday_state === '已申报'">
              <el-radio :label="0.2" :disabled="volumeWorkdayHigh.max>=0.2">提资完成(20%)</el-radio>
              <el-radio :label="0.5" :disabled="volumeWorkdayHigh.max>=0.5">个人出手(50%)</el-radio>
              <el-radio :label="0">不预发</el-radio>
            </el-radio-group>
            <el-tooltip class="item" effect="dark" content="预发工时只发放设计人；计算方式为:卷册工时 * 卷册设计人比例 * 预发比例" cement="top">
              <i class="el-icon-question"></i>
            </el-tooltip>
          </template>
        </el-row>
      </el-form>
    </el-dialog>
    <el-dialog
      v-el-drag-dialog
      title="卷册比例修改"
      :close-on-click-modal="false"
      :visible.sync="ratioVisible"
      width="60%" style="text-align: center">
      <el-form :model="volumeWorkday" size="mini">
        <el-row>
          <el-col :span="10">
            <el-form-item label-width="160px"
                          style="margin-left: -50px" label="卷册工时:"
            >
              <el-input v-model="volumeWorkday.workday" disabled style="width: 50%" oninput="value=value.replace(/[^\d.]/g,'')">
              </el-input>
            </el-form-item >
          </el-col>
          <el-col :span="10">
            <el-form-item label-width="160px"
                          style="margin-left: -50px" label="当前工时:">
              <el-input v-model="volumeWorkday.nowWorkday" disabled style="width: 50%" oninput="value=value.replace(/[^\d.]/g,'')">
              </el-input>
            </el-form-item >
          </el-col>
        </el-row>
        <el-row >
          <el-col :span="12">
            <el-form-item label-width="160px"
                          style="margin-left: -50px" label="设计人所得比例:"
            >
              <el-input v-model="volumeWorkday.designer" style="width: 50%" oninput="value=value.replace(/[^\d.]/g,'')">
                <template slot="append">
                  %</template>
              </el-input>
              <el-input v-model="volumeWorkday.designer_workday"
                        @change="changeVolumeWorkday" type="text"  style="width: 30%" oninput="value=value.replace(/[^\d.]/g,'')">
              </el-input>
            </el-form-item >
          </el-col>
          <el-col :span="12">
            <el-form-item label-width="160px"
                          style="margin-left: -50px" label="校核人所得比例:"
            >
              <el-input v-model="volumeWorkday.checker"  style="width: 50%" oninput="value=value.replace(/[^\d.]/g,'')">
                <template slot="append">
                  %</template>
              </el-input>
              <el-input v-model="volumeWorkday.checker_workday"
                        @change="changeVolumeWorkday"  style="width: 30%" oninput="value=value.replace(/[^\d.]/g,'')">
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label-width="160px"
                          style="margin-left: -50px" label="主设人所得比例:"
            >
              <el-input v-model="volumeWorkday.principal"
                         style="width: 50%" oninput="value=value.replace(/[^\d.]/g,'')">
                <template slot="append">
                  %</template>
              </el-input>
              <el-input v-model="volumeWorkday.principal_workday"
                        @change="changeVolumeWorkday"  style="width: 30%" oninput="value=value.replace(/[^\d.]/g,'')">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label-width="160px"
                          style="margin-left: -50px" label="组长所得比例:"
            >
              <el-input v-model="volumeWorkday.headman"  style="width: 50%" oninput="value=value.replace(/[^\d.]/g,'')">
                <template slot="append">
                  %</template>
              </el-input>
              <el-input v-model="volumeWorkday.headman_workday"
                        @change="changeVolumeWorkday" style="width: 30%" oninput="value=value.replace(/[^\d.]/g,'')">
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item style="margin-left: -50px;text-align: center;margin-top: 20px">
          <el-button @click="">取消</el-button>
          <el-button @click="volumeWorkdaySubmit" type="primary">确认</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog
      v-el-drag-dialog
      :visible.sync="userVisible"
      :close-on-click-modal="false"
      width="80%" style="text-align: center">
      <el-row align="center" slot="title">
        工时统计
        <i class="el-icon-document-copy"></i>
        <el-select v-model="user.tec" placeholder="请选择" style="width: 100px" value-key="tec" size="mini"
                   @change="workdayByPrincipal">
          <el-option
            v-for="item in user.tecList"
            :key="item.volume_tec"
            :label="item.volume_tec"
            :value="item.volume_tec">
          </el-option>
        </el-select>
      </el-row>
      <ux-grid use-virtual border :data="user.list" class="ux-table"
               :max-height=pageHeight
               show-summary
               :summary-method="arraySpanMethod"
               size = "mini" :cell-style="this.CellStyleOne">
        <ux-table-column field="username" width="10%" fixed sortable title="工号" align="center"  >
        </ux-table-column>
        <ux-table-column field="name" width="10%" fixed sortable title="姓名" align="center"  >
        </ux-table-column>
        <ux-table-column field="workday"  min-width="10%" sortable title="总工时" align="center">
        </ux-table-column>
        <ux-table-column field="volume_workday"  min-width="10%" sortable title="卷册工时" align="center"  >
        </ux-table-column>
        <ux-table-column field="task_workday" min-width="10%" sortable title="非卷册工时" align="center" style="word-break: break-all;">
        </ux-table-column>
        <ux-table-column field="advance_workday" min-width="10%" sortable title="预发工时" align="center">
        </ux-table-column>
        <ux-table-column  width="200px" align="center"  fixed="right">
          <template slot="header" slot-scope="scope">
            <el-date-picker
              v-model="showMonth"
              field="month"
              style="width: 160px"
              size="mini"
              type="month"
              @change="workdayByPrincipal()"
              format="yyyy-MM"
              value-format="yyyy-MM"
              placeholder="选择月">
            </el-date-picker>
          </template>
          <template slot-scope="scope">
            <el-row>
              <el-button
                size="mini"
                @click="openLog(scope.row)">工时详情 </el-button>
            </el-row>
          </template>
        </ux-table-column>
      </ux-grid>
    </el-dialog>
    <el-dialog
      v-el-drag-dialog
      :visible.sync="logVisible"
      width="80%" style="text-align: center">
      <ux-grid use-virtual border :data="user.log" class="ux-table"
               :max-height=pageHeight
               size = "mini" :cell-style="this.CellStyleOne">
        <ux-table-column field="number" min-width="10%" fixed show-overflow="tooltip" sortable title="任务编号" align="center"  >
        </ux-table-column>
        <ux-table-column field="name" min-width="10%" fixed show-overflow="tooltip" sortable title="任务名称" align="center"  >
        </ux-table-column>
        <ux-table-column field="workday"  min-width="10%" sortable title="工时" align="center">
        </ux-table-column>
        <ux-table-column field="tec"  min-width="10%" sortable title="专业" align="center"  >
        </ux-table-column>
        <ux-table-column field="type" min-width="15%" title="类型" align="center"  >
          <template slot-scope="scope">
            <span>{{scope.row.type|typeFilter}}</span>
          </template>
        </ux-table-column>
        <ux-table-column field="role" min-width="15%" title="角色" align="center"  >
          <template slot-scope="scope">
            <span>{{scope.row.role|roleFilter}}</span>
          </template>
        </ux-table-column>
      </ux-grid>
    </el-dialog>
    <el-dialog
      v-el-drag-dialog
      :close-on-click-modal="false"
      :visible.sync="taskVisible"
      title="新增任务"
      width="60%" style="text-align: center">
      <el-form :model="task" size="mini" label-width="140px" label-position="right">
        <el-row style="margin-left: -50px">
          <el-col :span="12">
            <el-form-item label="项目名称:">
              <el-input disabled v-model="task.project" class="input" style="width: 100%;">
              </el-input>
            </el-form-item >
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="任务类型:">
              <el-radio-group v-model="task.type" @change="getUasble()">
                <el-radio :label=1>备用</el-radio>
                <el-radio :label=0>管理</el-radio>
              </el-radio-group>
            </el-form-item >
          </el-col>
        </el-row>
        <el-row  style="margin-left: -50px">
          <el-col :span="12">
            <el-form-item label="部门:">
              <el-select v-model="task.dep" placeholder="请选择" @change="selectDep" style="width: 100%;">
                <el-option
                  v-for="item in taskDep"
                  :key="item.dep"
                  :label="item.dep"
                  :value="item">
                </el-option>
              </el-select>
            </el-form-item >
          </el-col>
          <el-col :span="12">
            <el-form-item label="专业:">
              <el-select v-model="task.tec" placeholder="请选择" @change="getUasble" style="width: 100%;">
                <el-option
                  v-for="item in taskTec"
                  :key="item.tec"
                  :label="item.tec"
                  :value="item.tec">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row style="margin-left: -50px">
          <el-col :span="12">
            <el-form-item label="任务编号:">
              <el-input disabled v-model="task.number" class="input" style="width: 100%;">
              </el-input>
            </el-form-item >
          </el-col>
          <el-col :span="12">
            <el-form-item label="任务名称:">
              <el-input v-model="task.name" class="input" style="width: 100%;">
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row style="margin-left: -50px">
          <el-col :span="12">
            <el-form-item label="可用工时:">
              <el-input v-model="task.usable" class="input" disabled style="width: 100%;">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="任务工时:">
              <el-input :value.trim="taskWorkday" disabled class="input" oninput="value=value.replace(/[^\d.]/g,'')" style="width: 100%;">
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row style="margin-left: -50px">
          <el-col :span="8">
            <el-form-item
              label="主设人:"
              >
              <el-input v-model="$parent.user.name" disabled size="mini" ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item
              label="工时:"
               label-width="60px">
              <el-input v-model="task.principal_workday" :disabled="task.check !== 1" size="mini" ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item
              label="执行人:"
            >
              <el-select v-model="task.designer" style="width: 100%;"
                         :filterable="true"  :remote="true"
                         :remote-method="remoteMethod"
                         value-key="id"
                         :loading="nameLoading"
                         placeholder="请输入人员姓名或工号"
              >
                <el-option
                  v-for="(item,index) in nameList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                  <span style="float: left">{{ item.name }}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">{{ item.username }}</span>
                </el-option></el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item
              label="工时:"
               label-width="60px">
              <el-input v-model="task.designer_workday" :disabled="task.check !== 1 || task.designer === null" size="mini" ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row style="margin-left: -50px">
          <el-col :span="8">
            <el-form-item
              label="校核人:"
              >
              <el-select v-model="task.checker" style="width: 100%;"
                         :filterable="true"  :remote="true"
                         :remote-method="remoteMethod"
                         value-key="id"
                         :loading="nameLoading"
                         placeholder="请输入人员姓名或工号">
                <el-option
                  v-for="(item,index) in nameList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                  <span style="float: left">{{ item.name }}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">{{ item.username }}</span>
                </el-option></el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item
              label="工时:"
               label-width="60px">
              <el-input v-model="task.checker_workday" :disabled="task.check !== 1 || task.checker === null" size="mini" ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item
              label="组长工程师:"
            >
              <el-select v-model="task.headman" style="width: 100%;"
                         :filterable="true"  :remote="true"
                         :remote-method="remoteMethod"
                         value-key="id"
                         :loading="nameLoading"
                         placeholder="请输入人员姓名或工号">
                <el-option
                  v-for="(item,index) in nameList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                  <span style="float: left">{{ item.name }}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">{{ item.username }}</span>
                </el-option></el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item
              label="工时:"
               label-width="60px">
              <el-input v-model="task.headman_workday" :disabled="task.check !== 1 || task.headman === null"  size="mini" ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row style="margin-left: -50px">
          <el-col :span="12">
            <el-form-item
              label="计划结束时间:"
              prop="principal" >
              <el-date-picker style="width: 100%;"
                              v-model="task.planned_end"
                              type="date"
                              value-format="yyyy-MM-dd"
                              placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="结束时间:"
              prop="headman">
              <el-date-picker style="width: 100%;"
                              v-model="task.end"
                              type="date"
                              value-format="yyyy-MM-dd"
                              placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer">
          <el-button @click="taskVisible = false">取消</el-button>
          <el-button @click="taskSubmit" type ="primary">
          <span>确认</span></el-button>`
        </span>
    </el-dialog>
    <el-dialog
      v-el-drag-dialog
      :visible.sync="declareVisible"
      :close-on-click-modal="false"
      width="80%" style="text-align: center">
      <el-row align="center" slot="title" style="margin-left: 125px">
        工时申报
        <span>
  <el-select v-model="declareDate" placeholder="请选择" size="mini" style="float: right;margin-right: 25px;width: 100px">
    <el-option
      v-for="item in declareMonth"
      :key="item"
      :label="item"
      :value="item">
    </el-option>
  </el-select>
      </span>
      </el-row>
      <ux-grid use-virtual border :data="declareList" class="ux-table" style="margin-top: -15px"
               :max-height=pageHeight
               @selection-change="handleSelectionChange"
               size = "mini" :cell-style="this.CellStyleOne">
        <ux-table-column type="checkbox" width="60px" v-if="true">
        </ux-table-column>
        <ux-table-column field="number" min-width="150px" fixed sortable title="任务编号" align="center"  >
        </ux-table-column>
        <ux-table-column field="name" min-width="160px" fixed sortable title="任务名称" align="center"  >
        </ux-table-column>
        <ux-table-column field="workday"  width="80px" sortable title="工时" align="center">
        </ux-table-column>
        <ux-table-column field="designerName"  width="80px" sortable title="设计" align="center">
        </ux-table-column>
        <ux-table-column field="designer"  width="100px" sortable title="设计工时" align="center">
        </ux-table-column>
        <ux-table-column field="checkerName"  width="80px" sortable title="校核" align="center">
        </ux-table-column>
        <ux-table-column field="checker"  width="100px" sortable title="校核工时" align="center">
        </ux-table-column>
        <ux-table-column field="principalName"  width="80px" sortable title="主设" align="center">
        </ux-table-column>
        <ux-table-column field="principal"  width="100px" sortable title="主设工时" align="center">
        </ux-table-column>
        <ux-table-column field="headmanName"  width="80px" sortable title="组长" align="center">
        </ux-table-column>
        <ux-table-column field="headman"  width="100px" sortable title="组长工时" align="center">
        </ux-table-column>
        <ux-table-column field="type" width="80px" title="工时类型" align="center"  >
          <template slot-scope="scope">
            <span>{{scope.row|workdayTypeFilter}}</span>
          </template>
        </ux-table-column>
        <ux-table-column field="role" width="80px" title="是否预发" align="center"  >
          <template slot-scope="scope">
            <span>{{scope.row.advance|advanceFilter}}</span>
          </template>
        </ux-table-column>
      </ux-grid>
      <el-row align="right" style="text-align: right">
        <el-button @click="declareVisible = false" size="mini">取消</el-button>
        <el-button @click="declareMethod" type="primary" size="mini">申报</el-button>
      </el-row>
    </el-dialog>
    <el-dialog
      v-el-drag-dialog
      :visible.sync="declareConfirmVisible"
      :close-on-click-modal="false"
      width="50%" style="text-align: center">
      <el-row align="center" slot="title">
        <span style="font-weight: bold;color: #000000">{{user.declareDate}}</span>工时申报
        <span>
      </span>
      </el-row>
      <ux-grid use-virtual border :data="declareUserList" class="ux-table" style="margin-top: -15px"
               :max-height=pageHeight show-summary
               :summary-method="arraySpanMethod"
               size = "mini" :cell-style="this.CellStyleOne">
        <ux-table-column field="name" min-width="15%" fixed sortable title="姓名" align="center"  >
        </ux-table-column>
        <ux-table-column field="workday" sortable title="工时" align="center">
        </ux-table-column>
      </ux-grid>
      <el-row align="right" style="text-align: right">
        <el-button @click="declareConfirmVisible = false" size="mini">取消</el-button>
        <el-button @click="submitDeclare" type="primary" size="mini">申报</el-button>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
const type = [{id :0, explain : "管理工时"},
  {id :1, explain : "备用工时"},
  {id :2, explain : "卷册工时"},
  {id :3, explain : "提前发放"},
  {id :4, explain : "提前发完成"},]
const role = [{id :0, explain : "设计"},
  {id :1, explain : "校核"},
  {id :2, explain : "主设"},
  {id :3, explain : "组长"},
  {id :5, explain : "设总"},]
export default {
  name: "ProjectVolume",
  data() {
    return {
      getRowKeys(row) {
        return row.id;
      },
      search: "",
      pageHeight: document.body.scrollHeight,
      id: "",
      pid: "",
      tid: "",
      isShow: false,
      projectId: null,
      volumeList: [],
      tecList: [],
      expands: [],
      nameList: [],
      volumeLoading: true,
      volumeWorkdayVisible: false,
      userVisible: false,
      logVisible : false,
      user: {
        tecList: []
      },
      showMonth : "",
      taskVisible : false,
      task : {
        project  : {},
        pid : 0,
        number : "",
        name : "",
        type : 1,
        workday : 0,
        usable : 0,
        dep : "",
        tec : "",
        planned_end : "",
        end : "",
        principal : ""
      },
      taskDep : [],
      taskTec : [],
      declareVisible : false,
      multipleSelection : [],
      declareList : [],
      declareConfirmVisible : false,
      declareDate : [],
      declareUserList : [],
      declareMonth : [],
      volumeWorkdayHigh: {},
      volumeWorkday: {},
      nameLoading: false,
      ratioVisible: false,
    }
  },
  watch: {

  },
  computed :{
    taskWorkday(){
      return (this.$myMethod.nullTo0(this.task.designer_workday)*1000 +
        this.$myMethod.nullTo0(this.task.checker_workday)*1000 +
        this.$myMethod.nullTo0(this.task.principal_workday)*1000 +
        this.$myMethod.nullTo0(this.task.headman_workday)*1000)/1000
    },
  },
  filters :{
    typeFilter(value){
      let  obj = type.find(value1 => {
        return value1.id === value
      })
      return obj.explain
    },
    roleFilter(value){
      let  obj = role.find(value1 => {
        return value1.id === value
      })
      return obj.explain
    },
    workdayTypeFilter(value){
      if (value.task){
        if (value.type){
          return "备用"
        }else {
          return  "管理"
        }
      }else {
        if (value.type){
          return "备用"
        }else {
          return  "卷册"
        }
      }

    },
    advanceFilter(value){
      if (value){
        return "预发"
      }else {
        return "非预发"
      }
    },
  },
  mounted() {
    this.projectId = this.$route.query.project_id;
    const a = new Date();
    let nowMonth = a.getFullYear() + "-" + (Number(a.getMonth()) + 1).toString().padStart(2,0)
    this.$axios
      .post(this.$baseUrl + 'project/declareDay'
      )
      .then(res => {
        let day = res.data.data
        const c = new Date(new Date().getTime()-3600*24*day*1000)
        let month1 = c.getFullYear() + "-" + (Number(c.getMonth()) + 1).toString().padStart(2,0)
        this.showMonth = month1;
        this.declareMonth.push2(month1);
        this.declareMonth.push2(nowMonth);
      })
      .catch(res => (console.log(res)));
    this.getData()
  },
  methods: {
    getData(){
      this.$axios
        .post(this.$baseUrl + 'project/queryTaskByUser', {
          "id": this.projectId,
        })
        .then(res => {
          this.volumeList = res.data.data;
          this.volumeLoading = false;
          this.volumeList.forEach((item)=>{
            this.tecList.push2({value:item.tec,text:item.tec});
          })
        })
        .catch(res => (console.log(res)));
    },
    newTask(){
      this.task = {
          project  : this.$parent.project.name,
          proNumber  : this.$parent.project.number,
          pid : this.projectId,
          number : "",
          name : "",
          type : 1,
          workday : 0,
          usable : 0,
          dep : "",
          tec : "",
          planned_end : "",
          end : "",
          principal : this.$parent.name,
          designer : null,
          checker : null,
          headman  : null,
          principal_workday : 0,
          designer_workday : 0,
          checker_workday : 0,
          headman_workday : 0,
      };
      this.getTec()
      this.taskVisible = true
    },
    getTec(){
      this.$axios
        .post(this.$baseUrl + 'department/queryByProject',{},{headers : {id : this.projectId}})
        .then(res => {
          res.data.data.forEach(item => {
            this.taskDep.push2(item)
          })

        })
        .catch(res => (console.log(res)));
    },
    selectDep(val){
      this.task.dep = val.dep
      this.taskTec = val.list
      this.$forceUpdate
    },
    getUasble(){
        if(this.task.tec === undefined || this.task.tec === ""){
          this.$message.error("请先选择部门专业")
          return 0
        }
      this.task.usable = 0;
        this.$axios
          .post(this.$baseUrl + 'project/queryUsedByTec',{
            id : this.task.pid,
            proNumber : this.task.proNumber,
            tec : this.task.tec,
            type : this.task.type
          })
          .then(res => {
            if(res.data.code === 0){
              this.task.usable = res.data.data.usable;
              this.task.number  = res.data.data.number;
              this.task.check = res.data.data.check;
              if(this.task.check !== 1){
                this.$message.warning("工时分配暂未审核或分配被组长回退，新建任务工时暂不能发放")
              }
              this.$forceUpdate
            }
          })
          .catch(res => (console.log(res)));
    },
    taskSubmit(){
      if(this.task.name === undefined || this.task.name === ''){
        this.$message.warning("任务名称未填写")
        return  0
      }
      if(this.task.number === undefined || this.task.number === ''){
        this.$message.warning("卷册编号未生成，请选择部门专业")
        return  0
      }
      // if(this.taskType){
        if (this.task.planned_end === undefined || this.task.planned_end === '') {
          this.$message.warning("计划完成时间未填写")
          return 0
        }
        this.$axios
          .post(this.$baseUrl + 'task/addTask',this.task,)
          .then(res => {
            if(res.data.code === 0 || res.data.code === 560){
              this.taskVisible = false;
              this.$message.success("新增任务成功")
            }
          })
          .catch(res => (console.log(res)));
      // }else{
      //   if (this.task.type === 0) {
      //     if (this.task.planned_end === undefined || this.task.planned_end === '') {
      //       this.$message.warning("计划完成时间未填写")
      //       return 0
      //     }
      //   }
      //   this.$axios
      //     .post(this.$baseUrl + 'projectWorkday/setWorkdayByGeneral',this.task,)
      //     .then(res => {
      //       if(res.data.code === 0 || res.data.code === 560){
      //         this.taskVisible = false;
      //         this.$message.success("新增任务成功")
      //       }
      //     })
      //     .catch(res => (console.log(res)));
      // }
    },
    openDeclare(){
      this.declareDate = this.declareMonth[0]
      this.$axios
        .post(this.$baseUrl + 'project/queryNotDeclare',{
          id : this.projectId,
        })
        .then(res => {
          if (res.data.data.length>0) {
            this.declareList = res.data.data
          }else {
            this.declareList  = [];
          }
          this.declareVisible = true
        })
        .catch(res => (console.log(res)));
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    submitDeclare(){
      this.$axios
        .post(this.$baseUrl + 'project/setDeclare',this.multipleSelection, {headers : {declareDate : this.declareDate}})
        .then(res => {
          if (res.data.code === 0) {
            this.$message.success("操作成功")
            this.declareVisible = false
            this.declareConfirmVisible = false
          }
        })
        .catch(res => (console.log(res)));
    },
    declareMethod(){
      this.declareUserList = [];
      let map = new Map();
      let roleList = ["designer", "checker", "principal", "headman"];
      this.multipleSelection.forEach(item =>{
        for (let i = 0; i < roleList.length; i++ ){
          if (item[roleList[i]] !== undefined && item[roleList[i]] !== 0){
            if (map.get(item[roleList[i] + 'Id']) !== undefined){
              let m = map.get(item[roleList[i] + 'Id'])
              m.workday =  Number(m.workday) + Number(item[roleList[i]])
              map.set(item[roleList[i] + 'Id'], m )
            }else {
              let m = {"id" : item[roleList[i] + 'Id'],
                "name" : item[roleList[i] + 'Name'],
                "workday" : item[roleList[i]]};
              map.set(item[roleList[i] + 'Id'],m)
            }
          }
        }
      })
      map.forEach((value,key) => {
        this.declareUserList.push(value)
      })
      this.declareConfirmVisible = true
    },
    changeVolumeWorkday(val){
      this.volumeWorkday.nowWorkday =
        this.$myMethod.nullTo0(this.volumeWorkday.designer_workday)
        + this.$myMethod.nullTo0(this.volumeWorkday.checker_workday)
      + this.$myMethod.nullTo0(this.volumeWorkday.principal_workday) +
          this.$myMethod.nullTo0(this.volumeWorkday.headman_workday)
      this.volumeWorkday.designer =Number(this.$myMethod.nullTo0(this.volumeWorkday.designer_workday)/ this.volumeWorkday.nowWorkday*100).toFixed(2)
      this.volumeWorkday.checker = Number(this.volumeWorkday.checker_workday/ this.volumeWorkday.nowWorkday*100).toFixed(2)
      this.volumeWorkday.principal = Number(this.volumeWorkday.principal_workday/ this.volumeWorkday.nowWorkday*100).toFixed(2)
      this.volumeWorkday.headman = Number(this.volumeWorkday.headman_workday/ this.volumeWorkday.nowWorkday*100).toFixed(2)
    },
    changeVolumeWorkdayRatio(){
      this.volumeWorkday.designer_workdayy = this.volumeWorkday.nowWorkday * this.volumeWorkday.designer /100
      this.volumeWorkday.checker_workday = this.volumeWorkday.nowWorkday * this.volumeWorkday.checker /100
      this.volumeWorkday.principal_workday = this.volumeWorkday.nowWorkday * this.volumeWorkday.principal /100
      this.volumeWorkday.headman_workday = this.volumeWorkday.nowWorkday * this.volumeWorkday.headman /100
    },
    changeVolumePlanDate(val,row){
      this.$axios
        .post(this.$baseUrl + 'volume/setSinglePlanDate',{
          id : row.id,
          plannedPublictionDate : val
        },)
        .then(res => {
          this.$message.success("操作成功")
        })
        .catch(res => (console.log(res)));
    },
    workdayByPrincipal(){
      this.$axios
        .post(this.$baseUrl + 'user/workdayByTec',{
          id : this.user.id,
          tec : this.user.tec,
          date : this.showMonth
        },)
        .then(res => {
          if (res.data.data.length>0) {
            this.user.list = res.data.data
          }else {
            this.user.list = [];
          }
          this.$forceUpdate();
          this.userVisible = true
        })
        .catch(res => (console.log(res)));
    },
    volumeWorkdaySubmit(){
      if (Number(this.volumeWorkday.workday) !== Number(this.volumeWorkday.nowWorkday)) {
        this.$confirm('当前工时与卷册工时不一致，是否将卷册工时改为卷册工时?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let type = this.volumeWorkday.type === 0 ? "卷册" : "备用";
            this.volumeWorkday.row.workday = this.volumeWorkday.nowWorkday
              this.volumeWorkday.row.designer_workdayy= this.volumeWorkday.designer_workday
            this.volumeWorkday.row.checker_workday= this.volumeWorkday.checker_workday
            this.volumeWorkday.row.principal_workday= this.volumeWorkday.principal_workday
            this.volumeWorkday.row.headman_workday= this.volumeWorkday.headman_workday
          this.httpWorkdayHigh();
        }).catch(() => {
        });
      }else {
        this.httpWorkdayHigh();
      }
    },
    httpWorkdayHigh(){
      this.$axios
        .post(this.$baseUrl + 'volume/setWorkdayHigh', {
            "id": this.volumeWorkday.id,
            "principal": this.volumeWorkday.principal,
            "designer": this.volumeWorkday.designer,
            "checker": this.volumeWorkday.checker,
            "headman": this.volumeWorkday.headman
          }
        )
        .then(res => {
          if (res.data.code === 0) {
            this.changeWorkday(this.volumeWorkday.row)
            this.$message.success("卷册比例修改成功")
            this.ratioVisible = false;
          }
        })
        .catch(res => (console.log(res)));
    },
    delTask(row){
      this.$axios
        .post(this.$baseUrl + 'task/del',row)
        .then(res => {
          if (res.data.code === 0){
            this.volumeList.forEach((item,index) =>{
              if (item.id === row.id){
                this.$message.success("删除成功")
                return this.volumeList.splice(index,1)
              }
            })
          }
        })
        .catch(res => (console.log(res)));
    },
    updateRole(row){
      if (row.principalRole) {
        if (row.workday_state === "未申报" || row.workday_state === "申报被拒" ||
          row.workday_state === "未填报" || row.workday_state === "未审核") {
          return true
        }
      }
      return false
    },
    tecByPrincipal(row){
      this.$axios
        .post(this.$baseUrl + 'technology/queryByPrincipal',{},{headers :{id : this.projectId}})
        .then(res => {
          this.user.id = this.projectId
          if (res.data.data.length>0) {
            this.user.tecList = res.data.data
            this.user.tec = this.user.tecList[0].volume_tec
            this.workdayByPrincipal(this.user.tec)
          }else {
            this.user.teclist = [];
          }
          this.$forceUpdate();
          this.userVisible = true
        })
        .catch(res => (console.log(res)));
    },
    openLog(row){
      this.$axios
        .post(this.$baseUrl + 'user/logByTec',{
          userId : row.id,
          id : this.user.id,
          tec : this.user.tec,
          date : this.showMonth
        })
        .then(res => {
          if (res.data.data.length>0) {
            this.user.log = res.data.data
          }else {
            this.user.log  = [];
          }
          this.logVisible = true
        })
        .catch(res => (console.log(res)));
    },
    tableRowClassName({row, rowIndex}) {
      //把每一行的索引放进row
      row.index = rowIndex;
    },
    changeWorkday(row){
      this.$axios
        .post(this.$baseUrl + 'volume/setWorkday', {
            "id": row.project_id,
            "tec" : row.tec,
            "taskId" : row.id,
            "workday" : row.workday,
            "designer_workday" : row.designer_workday,
            "checker_workday" : row.checker_workday,
            "principal_workday" : row.principal_workday,
            "headman_workday" : row.headman_workday,
            "old" : row.old,
            "state" : row.state,
            "date" : this.nowDate,
            "spider" : row.spider,
            "type" : row.type
          }
        )
        .then(res => {
          if (res.data.code === 0) {
            row.old = row.workday;
            row.wtid = res.data.data.wtid;
            row.workday = res.data.data.workday;
            row.designer_workday = res.data.data.designer;
            row.checker_workday = res.data.data.checker;
            row.principal_workday = res.data.data.principal;
            row.headman_workday = res.data.data.headman;
            this.$notify.closeAll();
            this.$notify({
              title: row.projectName,
              type: 'info',
              dangerouslyUseHTMLString: true,
              message: "类型:" + (res.data.data.type) +
                "<br/>总工时:" + (res.data.data.amount) +
                " <br/> 已分配工时:" + res.data.data.used
            })
          }
        })
        .catch(res => (console.log(res)));
    },
    filterHandler(value, row, column){
      const property = column['property'];
      return row[property] === value;
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
    openVolumeWorkday(row){
      this.$axios
        .post(this.$baseUrl + 'volume/queryVolumeWorkday', {
            "id": row.id,
          }
        )
        .then(res => {
          this.volumeWorkday = res.data.data
          this.volumeWorkday.id = row.id
          this.volumeWorkday.nowWorkday = res.data.data.workday
          this.volumeWorkday.row = row
          this.ratioVisible = true;
        })
        .catch(res => (console.log(res)));
    },
    openVolumeWorkdayAdvance(row){
      this.volumeWorkdayHigh = {};
      this.rowData = row;
      this.$axios
        .post(this.$baseUrl + 'volume/queryVolumeWorkdayHigh', {
            "id": row.id,
            "date" : this.nowDate,
            spider : 1
          }
        )
        .then(res => {
          if(res.data.data !== null) {
            this.volumeWorkdayHigh = res.data.data
            this.volumeWorkdayHigh.id = row.id
            this.volumeWorkdayHigh.workday_state = row.workday_state
            this.volumeWorkdayHigh.state = row.state
            if (this.volumeWorkdayHigh.ratio === undefined) {
              this.volumeWorkdayHigh.ratio = 0;
            }
            this.volumeWorkdayVisible = true
          }
          this.$forceUpdate
        })
        .catch(res => (console.log(res)));
    },
    setWorkdayAdvance(val){
      this.$axios
        .post(this.$baseUrl + 'volume/setWorkdayAdvance', {
            id: this.volumeWorkdayHigh.id,
            ratio : val,
            date : this.nowDate
          }
        )
        .then(res => {
          if(res.data.code === 0){
            this.$message.success("预发成功")

          }
        })
        .catch(res => (console.log(res)));
    },
    taskUpdate(val,row){
      let value = row[val];
      if (val === 'end') {
         value = row['complete_time']
      }
      this.$axios
        .post(this.$baseUrl + 'task/update', {
          id: row.id,
          key : val,
          value : value
        })
        .then(res =>{
          if(res.data.code === 0  ){
            this.$message.success("成功")
          }
        })
        .catch(res => {console.log(res)})
    },
    arraySpanMethod({  columns, data }) {
      const means = [] // 合计
      columns.forEach((column, columnIndex) => {
        if (columnIndex === 0) {
          means.push('合计')
        } else {
          const values = data.map(item => Number(item[column.property]));
          // 合计
          if (!values.every(value => isNaN(value))) {
            means[columnIndex] = values.reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value)) {
                return (prev * 100 + curr * 100)/100;
              } else {
                return prev;
              }
            }, 0);
            // 改变了ele的合计方式，扩展了合计场景
            // 你以为就只有上面这样玩吗？错啦，你还可以自定义样式哦
            // means[columnIndex] = '<span style="color: red">' + means[columnIndex] + '元</span>'
            means[columnIndex] = means[columnIndex].toFixed(2)
          } else {
            means[columnIndex] = '';
          }
        }
      })
      // 返回一个二维数组的表尾合计(不要平均值，你就不要在数组中添加)
      return [means]
    },
    remoteMethod(query) {
      this.nameList = []
      if (query !== '') {
        this.nameLoading = true;
        setTimeout(() => {
          this.$axios
            .post(this.$baseUrl + 'user/queryByName', {
                "name" : query
              }
            )
            .then(res => {
              if (res.data.data != null) {
                this.nameList = res.data.data
              }
            });
          this.nameLoading = false;
        }, 200);
      } else {
        this.nameList = [];
      }
    },
  }
}
</script>
<style>
html,body{
  height: 100%;
}
</style>

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
  width: 25%;
}
.u-table {
  horiz-align: center;
  font-size: 12px;
  word-wrap: break-word;
}
</style>
