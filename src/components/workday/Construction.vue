<template>
<div>
  <ux-grid ref="uxGrid" key="projectList" use-virtual border :data="projectList" class="ux-table"
                @expand-change="toggleExpandChangeEvent"           @row-click="clickRowHandle"
              size = "mini" :header-cell-style="{color:'#000000'}">
      <ux-table-column type="expand" width="50" align="center">
        <template v-slot:content="{ row, rowIndex }">
          <template>
              <ux-grid key="volumeList" :ref="'gird'+row.id" use-virtual border :data="row.list" class="ux-table" :header-cell-style="{color:'#000000'}"
                  :default-sort = "{prop: 'date', order: 'descending'}"
                  size="mini"
                  max-height="300"
                  :row-style="completeState" @row-contextmenu="rightClick">
          <ux-table-column  fixed="left" field="type" width="130" title="任务类型" align="center"
                      :filters="[{label:'卷册',value:'卷册'},{label:'管理',value:'管理'},
                            {label:'备用',value:'备用'},{label:'设总备用',value:'设总备用'},{label:'设总管理',value:'设总管理'}]"
                      :filter-method="filterHandler">
                   <template slot-scope="scope">
                      <el-select v-model="scope.row.type" placeholder="请选择" size="mini"
                      v-if="scope.row.spider && (scope.row.state ==='正在设计' || scope.row.state === '正在校审')">
                          <el-option
                            v-for="item in volumeType"
                            :key="item.name"
                            :label="item.name"
                            :value="item.name">
                          </el-option>
                      </el-select>
                      <span v-else>{{scope.row.type}}</span>
                    </template>
          </ux-table-column>
          <ux-table-column fixed="left" field="number" width="140" show-overflow="tooltip" title="任务编号" sortable align="center">
          </ux-table-column>
          <ux-table-column field="name" width="220" title="任务名称" show-overflow="tooltip" align="center" sortable>
          </ux-table-column>
          <ux-table-column field="state"  width="80" title="状态" align="center"
                           :filters="[{label:'尚未开展',value:'尚未开展'},{label:'正在设计',value:'正在设计'},
                            {label:'正在校审',value:'正在校审'},{label:'待送出版',value:'待送出版'},
                            {label:'正在出版',value:'正在出版'},{label:'待送业主',value:'待送业主'},
                            {label:'已完成',value:'已完成'},{label:'院交出',value:'院交出'},
                            {label:'尚未确定',value:'尚未确定'}]"
                           :filter-method="filterHandler" >
          </ux-table-column>
          <ux-table-column field="scope" width="80" title="工时"  align="center"
                           sortable>
            <template slot-scope="scope">
              <el-input v-model.lazy="scope.row.workday" size="mini" :disabled="releasableStateFilterSum(scope.row,true)"
               @change="changeWorkday(scope.row)"></el-input>
            </template>
          </ux-table-column>
            <ux-table-column field="scope" width="80" title="设计工时"  align="center"
                           >
            <template slot-scope="scope">
              <el-input v-model.lazy="scope.row.designer_workday" size="mini" :disabled="releasableStateFilterSum(scope.row, false)"
               @change="changeWorkday(scope.row)"></el-input>
            </template>
          </ux-table-column>
            <ux-table-column field="scope" width="80" title="校核工时"  align="center"
                           >
            <template slot-scope="scope">
              <el-input v-model.lazy="scope.row.checker_workday" size="mini" :disabled="releasableStateFilterSum(scope.row, false)"
               @change="changeWorkday(scope.row)"></el-input>
            </template>
          </ux-table-column>
            <ux-table-column field="scope" width="80" title="主设工时"  align="center"
                           >
            <template slot-scope="scope">
              <el-input v-model.lazy="scope.row.principal_workday" size="mini" :disabled="releasableStateFilterSum(scope.row, false)"
               @change="changeWorkday(scope.row)"></el-input>
            </template>
          </ux-table-column>
            <ux-table-column field="scope" width="80" title="组长工时"  align="center"
                           >
            <template slot-scope="scope">
              <el-input v-model.lazy="scope.row.headman_workday" size="mini" :disabled="releasableStateFilterSum(scope.row, false)"
               @change="changeWorkday(scope.row)"></el-input>
            </template>
          </ux-table-column>
          <ux-table-column field="designer" width="100"  title="设计人"
                            :filters="row.designerList"
                           align="center"
                          :filter-method="filterHandler">
          </ux-table-column>
          <ux-table-column field="workday_state" width="100" title="工时状态"  align="center"
                           sortable>
            <template slot-scope="scope">
              <span>{{scope.row.workday_state}}</span>
            </template>
          </ux-table-column>
          <ux-table-column field="grant" width="120" title="已发放工时"  align="center"
                           sortable>
          </ux-table-column>
          <ux-table-column field="shot_date" width="120"  title="出手日期" sortable align="center">
            <template slot-scope="scope">
            <el-date-picker
                      v-if="scope.row.spider === 0 && scope.row.type.indexOf('设总') === -1"
          v-model="scope.row.shot_date"
          value-format="yyyy-MM-dd"
          type="date"
          @change="taskComplete(scope.row)"
          size="mini"
          placeholder="选择任务完成日期"
          :picker-options="pickerOptions">
        </el-date-picker>
        <span v-else>{{scope.row.shot_date}}</span>
            </template>
          </ux-table-column>
          <ux-table-column field="reason" width="170" title="未按时完成原因"  align="center"
                          sortable>
            <template slot-scope="scope">
            <el-autocomplete
              class="inline-input"
              size="mini"
              v-model="scope.row.reason"
              :fetch-suggestions="querySearch"
              placeholder="请输入内容"
              v-if="scope.row.reasonState"
              @change.native="changeReason(scope.row)"
              @select="reasonHandle($event,scope.row)"
            ><template slot-scope="{item}">
              <span>{{item}}</span>
            </template>
            </el-autocomplete>
              <el-input v-model.lazy="scope.row.reason" size="mini"
                        v-else disabled></el-input>
            </template>
          </ux-table-column>
          <ux-table-column field="planned_shot_date" width="120"  title="计划出手日期" sortable align="center">
          </ux-table-column>
          <ux-table-column field="principal" width="100"  title="主设人"
                           align="center"
                          :filter-method="filterHandler">
          </ux-table-column>
          <ux-table-column field="dep" width="100"  title="部门"
                          :filter-method="filterHandler"
                          align="center">
          </ux-table-column>
          <ux-table-column field="tec" align="center" width="100" title="专业"
                          :filter-method="filterHandler">
            </ux-table-column>
          <ux-table-column field="start_date" width="120"  title="开始日期" sortable align="center">
          </ux-table-column>
          <ux-table-column field="actual_publication_date" width="120" title="出版日期" sortable align="center">
          </ux-table-column>
          <ux-table-column field="planned_publication_date" width="120" title="计划出版日期" sortable align="center">
          </ux-table-column>
          <ux-table-column field="proofreading_date" width="160"  title="校核完成日期" sortable align="center">
          </ux-table-column>
          <ux-table-column field="complete_time" width="100"  title="完成日期" sortable align="center">
          </ux-table-column>
          <ux-table-column field="checker" width="100"  title="校核人"
                           align="center"
                          :filter-method="filterHandler">
          </ux-table-column>
                <ux-table-column field="headman" width="120"  title="组长工程师"
                                 align="center"
                                 :filter-method="filterHandler">
                </ux-table-column>
          <ux-table-column
            align="center" width="100px" fixed="right">
            <template slot-scope="scope">
              <el-button v-if="scope.row.spider === 1 "
                         :disabled="scope.row.workday === undefined || scope.row.check !== 1 || scope.row.submit !== 0"
                size="mini"
                @click="openVolumeWorkday(scope.row,true)">预发</el-button>
              <el-button v-if="scope.row.spider === 0 && scope.row.type.indexOf('设总') === -1"
                         :disabled="scope.row.workday === undefined || scope.row.shot_date !== '' || scope.row.submit !== 0"
                         size="mini"
                         @click="openVolumeWorkday(scope.row,true)">预发</el-button>
            </template>
          </ux-table-column>
        </ux-grid>
          </template>
        </template>
      </ux-table-column>
      <ux-table-column field="number" min-width="10%" title="项目编号" align="center"  >
      </ux-table-column>
      <ux-table-column field="name" min-width="26%" title="项目名称" align="center">
      </ux-table-column>
      <ux-table-column field="director" width="80" title="主管设总" align="center"  >
      </ux-table-column>
      <ux-table-column field="general" width="80" title="设总" align="center" style="word-break: break-all;">
      </ux-table-column>
      <ux-table-column field="create_time" width="120" title="开始时间" align="center">
      </ux-table-column>
      <ux-table-column field="amount"  width="100" title="参与卷册数"  align="center">
      </ux-table-column>
      <ux-table-column  width="400px" align="center">
        <template slot="header" slot-scope="scope">
          <el-date-picker
            v-model="showDate"
            type="daterange"
            value-format="yyyy-MM-dd"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            size = "mini"
            style="margin-right: 10%; margin-left: 5%"
            @change="getData">
          </el-date-picker>
        </template>
        <template slot-scope="scope">
          <el-row>
              <el-button size="mini" @click="newTask(scope.row)"
               v-if="(scope.row.show === 1 || scope.row.principal === 1)">新增任务</el-button >
              <el-button
                size="mini"
                :disabled = "scope.row.principal !== 1"
                @click="workdayDistribute(scope.row)">工时分配</el-button>
            <el-button
              size="mini"
              :disabled = "scope.row.principal !== 1"
              @click="workdayByPrincipal(scope.row)">工时统计</el-button>
              <el-button
                size="mini"
                v-if="scope.row.show === 1"
                @click="openProject(scope.row)">项目主页</el-button>
          </el-row>
        </template>
      </ux-table-column>
    </ux-grid>
  <el-dialog
    v-el-drag-dialog
    :visible.sync="visible_workday"
    @close="closeDialog"
    width="60%" v-if='visible_workday'>
    <el-container>
      <el-header align="left" style="margin-top: -30px">
        <el-row>
          <el-col :span="10" style="margin-top: -20px;">
            <h4>
            <el-select v-model="workdayData.tec" placeholder="请选择" style="width: 100px" value-key="tec" size="mini"
            @change="selectTec">
              <el-option
                v-for="item in workdayDateList"
                :key="item.tec"
                :label="item.tec"
                :value="item">
              </el-option>
            </el-select>专业工时分配</h4>
          </el-col>
          <el-col :span="7">
            总专业工时:<span style="color: #66b1ff">{{workdayData.num}}</span>
          </el-col>
          <el-col :span="7">
            已分配工时:<span style="color: #66b1ff">{{workdayData.used}}</span>
            <el-tooltip class="item" effect="dark" content="已分配工时包含卷册工时和主设人管理工时以及已分配到人的备用工时" placement="top">
              <i class="el-icon-question"></i>
            </el-tooltip>
          </el-col>
        </el-row>
      </el-header>
        <el-main style="margin-top: -20px">
          <el-form label-width="120px" size="mini">
          <el-row >
            <el-col :span="10" style="font-weight: bold">
              <el-form-item label="已分配管理工时">
                <el-input
              size = "mini"
              disabled
              v-model="workdayData.manageUsed"
              style="width: 70%"
              placeholder="请输入内容"
            ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="14" style="font-weight: bold;">
              <el-form-item label="管理工时">
              <el-input
              size = "mini"
              v-model="workdayData.manage"
              style="width: 40%"
              placeholder="请输入内容"
            >
              </el-input>
                <el-input
                  size = "mini"
                  v-model="workdayData.manageRatio"
                  style="width: 40%"
                  placeholder="请输入内容"
                ></el-input>%
              </el-form-item>
            </el-col>
          </el-row>
                    <el-row >
            <el-col :span="10" style="font-weight: bold">
              <el-form-item label="已分配卷册工时">
                <el-input
              size = "mini"
              disabled
              v-model="workdayData.volumeUsed"
              style="width: 70%"
              placeholder="请输入内容"
            ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="14   " style="font-weight: bold">
              <el-form-item label="卷册工时"><el-input
              size = "mini"
              v-model="workdayData.volume"
              style="width: 40%"
              placeholder="请输入内容"
            ></el-input>
                <el-input
                  size = "mini"
                  v-model="workdayData.volumeRatio"
                  style="width: 40%"
                  placeholder="请输入内容"
                ></el-input>%
              </el-form-item>
            </el-col>
          </el-row>
            <el-row >
            <el-col :span="10" style="font-weight: bold">
              <el-form-item label="已分配备用工时">
                <el-input
              size = "mini"
              disabled
              v-model="workdayData.backupUsed"
              style="width: 70%"
              placeholder="请输入内容"
            ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="14" style="font-weight: bold">
              <el-form-item label="备用工时"><el-input
              size = "mini"
              disabled
              :value.trim = "backupUable"
              style="width: 40%"
              placeholder="请输入内容"
            ></el-input>
                <el-input
                  size = "mini"
                  v-model="workdayData.backupRatio"
                  style="width: 40%"
                  placeholder="请输入内容"
                ></el-input>%
              </el-form-item>
            </el-col>
          </el-row><el-row >
          <el-col :span="10" style="font-weight: bold">
            <el-form-item label="设计">
              <el-input v-model="workdayData.designer" size="mini" style="width: 70%"
                        oninput="value=value.replace(/[^\d.]/g,'')"  >
              </el-input>%
            </el-form-item>
          </el-col>
          <el-col :span="10" style="font-weight: bold">
            <el-form-item label="校核">
              <el-input v-model="workdayData.checker" size="mini" style="width: 70%"
                        oninput="value=value.replace(/[^\d.]/g,'')">
              </el-input>
            %
            </el-form-item>
          </el-col>
        </el-row>
          <el-row >
            <el-col :span="10" style="font-weight: bold">
              <el-form-item label="主设">
                <el-input v-model="workdayData.principal" size="mini" style="width:70%"
                          oninput="value=value.replace(/[^\d.]/g,'')">
                </el-input>%
              </el-form-item>
            </el-col>
            <el-col :span="10" style="font-weight: bold">
              <el-form-item label="组长">
                <el-input v-model="workdayData.headman" size="mini" style="width: 70%" disabled
                          oninput="value=value.replace(/[^\d.]/g,'')">
                </el-input>
              %
              </el-form-item>
            </el-col>
          </el-row>
          </el-form>
          <ux-grid use-virtual border :data="workdayData.list" class="ux-table"
                   :max-height=300
                   size = "mini" :cell-style="this.CellStyleOne">
            <ux-table-column field="number" min-width="10%" fixed sortable title="任务编号" align="center"  >
            </ux-table-column>
            <ux-table-column field="name" min-width="10%" fixed sortable title="任务名称" align="center"  >
              <template slot-scope="scope">
                <span v-if="scope.row.tips" style="font-weight: bold">{{scope.row.name}}</span>
                <span v-else>{{scope.row.name}}</span>
              </template>
            </ux-table-column>
            <ux-table-column field="workday"  min-width="10%" sortable title="工时" align="center">
              <template slot-scope="scope">
                <el-input v-model="scope.row.workday" size="mini" :disabled="scope.row.submit === 1 || scope.row.submit === 2" oninput="value=value.replace(/[^\d.]/g,'')"></el-input>
              </template>
            </ux-table-column>
          </ux-grid>
          <el-row >
            已用工时<el-input disabled :value.trim="volumeUsed" size="mini" style="width: 80px;margin-right: 80px"></el-input>
            审核人
            <el-select v-model="workdayData.checkerId" placeholder="请选择" style="width: 100px" size="mini"
                       @change="selectChecker">
              <el-option
                v-for="item in checkerList"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
            <el-button size="mini" @click="distributeSubmit(4)">保存
            </el-button>
            <el-button type="primary" size="mini" @click="distributeSubmit(0)">报审
            </el-button>
          </el-row>
        </el-main>
    </el-container>
  </el-dialog>
  <el-dialog
      v-el-drag-dialog
    title="预发"
    :visible.sync="volume_workday_visible"
    width="60%" style="text-align: center">
    <el-form :model="volume_workday" size="mini" :inline="true">
      <el-row v-if="volume_workday.spider">
        <template>
        <el-radio-group v-model="volume_workday.ratio" @change="setWorkdayAdvance" :disabled="volume_workday.state !== '正在设计' && volume_workday.state !== '正在校审' && volume_workday.state !== '尚未开展'">
          <el-radio :label="0.2" :disabled="volume_workday.max>=0.2">提资完成(20%)</el-radio>
          <el-radio :label="0.5" :disabled="volume_workday.max>=0.5">个人出手(50%)</el-radio>
          <el-radio :label="0">不预发</el-radio>
        </el-radio-group>
          <el-tooltip class="item" effect="dark" content="预发工时只发放设计人；计算方式为:卷册工时 * 卷册设计人比例 * 预发比例" cement="top">
            <i class="el-icon-question"></i>
          </el-tooltip>
        </template>
      </el-row>
        <el-row v-else>
          <el-col :span="10">
            本任务剩余可提前发放工时<el-input size="mini" disabled v-model="volume_workday.usable" style="width: 30%" oninput="value=value.replace(/[^\d.]/g,'')">
            </el-input>
          </el-col>
          <el-col :span="10">
            本次发放工时<el-input size="mini" v-model="volume_workday.grant" style="width: 30%" oninput="value=value.replace(/[^\d.]/g,'')">
            </el-input>
          </el-col>
            <el-button size="mini" @click="setHighMethod()">确认</el-button>
      </el-row>
    </el-form>
  </el-dialog>
  <el-dialog
    v-el-drag-dialog
    title="卷册比例修改"
    :visible.sync="ratioVisible"
    width="60%" style="text-align: center">
    <el-form :model="volume_workday" size="mini">
      <el-row>
        <el-col :span="10">
          <el-form-item label-width="160px"
                        style="margin-left: -50px" label="卷册工时:"
          >
            <el-input v-model="volume_workday.workday" disabled style="width: 50%" oninput="value=value.replace(/[^\d.]/g,'')">
            </el-input>
          </el-form-item >
        </el-col>
        <el-col :span="10">
          <el-form-item label-width="160px"
                        style="margin-left: -50px" label="当前工时:">
            <el-input v-model="volume_workday.nowWorkday" disabled style="width: 50%" oninput="value=value.replace(/[^\d.]/g,'')">
            </el-input>
          </el-form-item >
        </el-col>
      </el-row>
        <el-row >
          <el-col :span="12">
            <el-form-item label-width="160px"
                          style="margin-left: -50px" label="设计人所得比例:"
                          >
              <el-input v-model="volume_workday.designer" @input="ratioChange('designer')" style="width: 50%" oninput="value=value.replace(/[^\d.]/g,'')">
                <template slot="append">
                  %</template>
              </el-input>
              <el-input v-model="volume_workday.designerNum" @input="numChange('designer')" style="width: 30%" oninput="value=value.replace(/[^\d.]/g,'')">
              </el-input>
            </el-form-item >
          </el-col>
          <el-col :span="12">
            <el-form-item label-width="160px"
                          style="margin-left: -50px" label="校核人所得比例:"
                          >
              <el-input v-model="volume_workday.checker" @input="ratioChange('checker')" style="width: 50%" oninput="value=value.replace(/[^\d.]/g,'')">
                <template slot="append">
                  %</template>
              </el-input>
              <el-input v-model="volume_workday.checkerNum" @input="numChange('checker')" style="width: 30%" oninput="value=value.replace(/[^\d.]/g,'')">
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label-width="160px"
                          style="margin-left: -50px" label="主设人所得比例:"
                          >
              <el-input v-model="volume_workday.principal" @input="ratioChange('principal')" style="width: 50%" oninput="value=value.replace(/[^\d.]/g,'')">
                <template slot="append">
                  %</template>
              </el-input>
              <el-input v-model="volume_workday.principalNum" @input="numChange('principal')"  style="width: 30%" oninput="value=value.replace(/[^\d.]/g,'')">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label-width="160px"
                          style="margin-left: -50px" label="组长所得比例:"
                          >
              <el-input v-model="volume_workday.headman" @input="ratioChange('headman')" style="width: 50%" oninput="value=value.replace(/[^\d.]/g,'')">
                <template slot="append">
                  %</template>
              </el-input>
              <el-input v-model="volume_workday.headmanNum" @input="numChange('headman')" style="width: 30%" oninput="value=value.replace(/[^\d.]/g,'')">
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item style="margin-left: -50px;text-align: center;margin-top: 20px">
          <el-button @click="closeVolumeWorkday()">取消</el-button>
          <el-button @click="volumeWorkdaySubmit" type="primary">确认</el-button>
        </el-form-item>
    </el-form>
  </el-dialog>
  <el-dialog
    v-el-drag-dialog
    :visible.sync="taskVisible"
    width="60%" style="text-align: center">
            <span slot="title">
            <el-switch
            v-model="taskType"
            :active-text="taskActivity"
            :inactive-text="taskInActivity"
            :disabled = "taskTypeShow"
            @change="taskTypeChange"
            style="float: left;">
            </el-switch>
          <span style="margin-left:-100px">
            新增任务
          </span>
          </span>
    <el-form :model="task" size="mini" label-width="160px">
      <el-row style="margin-left: -50px">
        <el-col :span="12">
          <el-form-item
                    label="项目名称:"
          >
           <el-input disabled v-model="task.project.name" class="input" style="width: 100%;">
            </el-input>
          </el-form-item >
        </el-col>
        <el-col :span="12">
          <el-form-item
                         label="任务类型:"
          >
            <el-select v-model="task.type" :disabled="!task.show&&!taskType" placeholder="请选择" style="width: 100%;" @change="getUasble">
                <el-option
                  v-for="item in typeList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
          </el-form-item >
        </el-col>
      </el-row>
      <el-row style="margin-left: -50px">
        <el-col :span="12">
          <el-form-item
                         label="任务编号:"
          >
            <el-input disabled v-model="task.number" class="input" style="width: 100%;">
            </el-input>
          </el-form-item >
        </el-col>
        <el-col :span="12">
          <el-form-item
                         label="任务名称:"
          >
            <el-input v-model="task.name" class="input" style="width: 100%;">
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
            <el-row  v-if="taskType || task.type === 1" style="margin-left: -50px">
        <el-col :span="12">
          <el-form-item
                         label="部门:"
                        >
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
          <el-form-item
                         label="专业:"
                        >
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
          <el-form-item
                         label="可用工时:"
                        >
            <el-input v-model="task.usable" class="input" disabled style="width: 100%;">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
                         label="任务工时:"
                        >
            <el-input v-model="task.workday" :disabled="!task.check" v-if="!taskType" class="input" oninput="value=value.replace(/[^\d.]/g,'')" style="width: 100%;">
            </el-input>
            <el-input :value.trim="taskWorkday" disabled v-else class="input" oninput="value=value.replace(/[^\d.]/g,'')" style="width: 100%;">
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row style="margin-left: -50px">
        <el-col :span="8">
          <el-form-item
                         label="主设人:"
                        v-if="taskType">
            <el-select v-model="task.principal" placeholder="请选择" disabled style="width: 100%;">
                <el-option
                  v-for="item in taskPrincipal"
                  :key="item.id"
                  :label="item.principal"
                  :value="item.id">
                </el-option>
              </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item
                         label="工时:"
                        v-if="taskType" label-width="60px">
                 <el-input v-model="task.principal_workday" :disabled="!task.check || task.principal === null" size="mini" ></el-input>
          </el-form-item>
        </el-col>


        <el-col :span="8" v-if="taskType || task.type === 0">
          <el-form-item
                         label="执行人:"
                        >
            <el-select v-model="task.designer" style="width: 100%;"
                       :disabled="!taskType"
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
              </el-option></el-select>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item
                         label="工时:"
                        v-if="taskType" label-width="60px">
                 <el-input v-model="task.designer_workday" :disabled="!task.check || task.designer === null" size="mini" ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
            <el-row style="margin-left: -50px"  v-if="taskType || task.type === 0">
        <el-col :span="8">
          <el-form-item
                         label="校核人:"
                        v-if="taskType">
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
              </el-option></el-select>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item
                         label="工时:"
                        v-if="taskType" label-width="60px">
                 <el-input v-model="task.checker_workday" :disabled="!task.check || task.checker === null" size="mini" ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item
                         label="组长工程师:" v-if="taskType"
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
              </el-option></el-select>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item
                         label="工时:"
                        v-if="taskType" label-width="60px">
                 <el-input v-model="task.headman_workday" :disabled="!task.check || task.headman === null"  size="mini" ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
            <el-row v-if="taskType ||  task.type === 0" style="margin-left: -50px">
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
            <span v-if="!task.show && !taskType">报审</span>
          <span v-else>确认</span></el-button>`
        </span>
  </el-dialog>
  <el-dialog
    v-el-drag-dialog
    :visible.sync="userVisible"
    width="80%" style="text-align: center">
    <el-row align="center" slot="title">
      工时统计
      <i class="el-icon-document-copy" @click="downExcel()"></i>
      <el-button size="mini" style="float: right;margin-right: 25px" @click="openDeclare">工时申报</el-button>
    </el-row>
    <ux-grid use-virtual border :data="user.list" class="ux-table"
             :max-height=pageHeight
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
            v-model="nowMonth"
            field="month"
            style="width: 160px"
            size="mini"
            type="month"
            @change="workdayByPrincipal(user)"
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
    :visible.sync="declareVisible"
    width="80%" style="text-align: center">
    <el-row align="center" slot="title" style="margin-left: 125px">
      工时申报
      <span>
  <el-select v-model="user.declareDate" placeholder="请选择" size="mini" style="float: right;margin-right: 25px;width: 100px">
    <el-option
      v-for="item in declareMonth"
      :key="item"
      :label="item"
      :value="item">
    </el-option>
  </el-select>
      </span>
    </el-row>
    <ux-grid use-virtual border :data="user.declareList" class="ux-table" style="margin-top: -15px"
             :max-height=pageHeight
             @selection-change="handleSelectionChange"
             size = "mini" :cell-style="this.CellStyleOne">
      <ux-table-column type="checkbox" width="60px" v-if="true">
      </ux-table-column>
      <ux-table-column field="number" min-width="10%" fixed sortable title="任务编号" align="center"  >
      </ux-table-column>
      <ux-table-column field="name" min-width="15%" fixed sortable title="任务名称" align="center"  >
      </ux-table-column>
      <ux-table-column field="workday"  width="80px" sortable title="工时" align="center">
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
      <el-button @click="submitDeclare" type="primary" size="mini">申报</el-button>
    </el-row>
  </el-dialog>
  <div id="rightMenu"
       v-show="menuVisible"
       class="menu">
    <div class="contextmenu__item" v-if="updMenu"
         @click="openVolumeWorkday(CurrentRow,false)">修改</div>
    <div class="contextmenu__item" v-if="delMenu"
         @click="delTask(CurrentRow)">删除</div>
  </div>
</div>
</template>

<script>

const workdayState =[
  {"type" : 0, name : "未发放"},
  {"type" : 1, name : "已发放"},
  {"type" : 2, name : "部分发放"}
]

const releasableState = [
  "正在设计",  "正在校审",  "尚未开展", "尚未确定",
]

const reasonList = [
  "请假",  "出差",  "提资"
]
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

import virtualList  from 'vue-virtual-scroll-list'
import chinapy from '@/assets/js/chinapy.js'
import News from '../other/News.vue'
export default {
name: "UserScore",
  components: { 'virtual-list': virtualList },
  data(){
  return{
      getRowKeys(row){
        return row.id
      },
    pageHeight : document.body.scrollHeight,
    nowDate : "",
    menuVisible : false,
    delMenu : false,
    updMenu : false,
    declareVisible : false,
    CurrentRow : null,
    volume_workday_visible : false,
    loading : true,
    projectList : [],
    volumeList : [],
    volumeProject : [],
    visible_workday : false,
    workdayDateList : [],
    multipleSelection : [],
    workdayData : {
      tec : "",
      num : 0,
      used : 0,
      manage : 0,
      volume : 0,
      usedManage : 0,
      todayManage : 0,
      designer : 0,
      checker : 0,
      principal : 0,
      headman : 0,
      manageRatio : 0,
      volumeRatio : 0,
      backupRatio : 0
    },
    volume_workday : {
      spider : 0,
      ratio : 0,
      designerNum : 0,
    },
    nameLoading : true,
    nameList : [],
    excelDialog : false,
    showDate : [],
    downMonth : [],
    ratioVisible : false,
    rowData : "",
    taskVisible : false,
    task : {
      project  : "",
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
      principal : this.$parent.name
    },
    volumeType : [{id: 0, name : "卷册"},{id: 1, name : "备用"}],
    typeList:[{id: 0, name : "管理"},{id: 1, name : "备用"}],
    taskProject : [],
    taskActivity : "任务新增",
    taskInActivity : "申请备用",
    taskType : true,
    taskPrincipal : [],
    taskDep : [],
    taskTec : [],
    checkerList : [],
    taskTypeShow : false,
    user : {
        id : null,
        declareDate : null,
        list : [],
        log : []
    },
    userVisible : false,
    logVisible : false,
    nowMonth : "",
    declareMonth : [],
  }
  },
  filters:{
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
  computed:{
    pickerOptions() {
      let that = this
      return {
        disabledDate(time) {
          const year = time.getFullYear()
          let month = (Number(time.getMonth()) + 1).toString().padStart(2,0)
          const ym = year + '-' + month
        return !(ym === that.nowDate && time.getTime() <= new Date().getTime())
        }
      }
    },
    taskWorkday(){
      return (Number(this.task.designer_workday) + Number(this.task.checker_workday) +
       Number(this.task.principal_workday) +Number(this.task.headman_workday))
    },
    backupUable(){
      return (Number(this.workdayData.num) - Number(this.workdayData.manage) - Number(this.workdayData.volume))
    },
    volumeUsed(){
      return this.workdayData.list.reduce((prev, cur) => {
        if (cur.workday !== undefined && cur.workday !== "") {
          return Number(prev) + Number(cur.workday);
        }
      },0)
    }
  },
  watch :{
    workdayData:{
      handler( newVal, oldVal){
        newVal.headman = 100 - Number(newVal.designer) - Number(newVal.checker) - Number(newVal.principal)
        newVal.manageRatio = (newVal.manage / newVal.num) * 100;
        newVal.volumeRatio = (newVal.volume / newVal.num) * 100;
        newVal.backupRatio = (this.backupUable / newVal.num) * 100
      },
      deep : true
    },
    volume_workday:{
      handler(newVal,oldVal){
        newVal.nowWorkday = Number(newVal.principalNum) +
          Number(newVal.designerNum) +
          Number(newVal.checkerNum) +
          Number(newVal.headmanNum);
      },
      deep: true
    }
  },
  created() {
  //picker 初始化 需要赋值为yyyy-MM-dd格式，月份和日期需要补0，
    const a = new Date();
    const  end = a.getFullYear() + "-" + (Number(a.getMonth())+1).toString().padStart(2,0) + "-" + a.getDate().toString().padStart(2,0)
    const b = new Date(new Date().getTime()-3600*24*30*1000)
    const start =  b.getFullYear() + "-" + (Number(b.getMonth())+1).toString().padStart(2,0) + "-" + b.getDate().toString().padStart(2,0)
    this.nowDate = a.getFullYear() + "-" + (Number(a.getMonth()) + 1).toString().padStart(2,0)
    this.nowMonth = a.getFullYear() + "-" + (Number(a.getMonth()) + 1).toString().padStart(2,0)
    this.showDate = [start,end]
    this.downMonth = [start,end]
    this.$axios
      .post(this.$baseUrl + 'project/declareDay'
      )
      .then(res => {
        let day = res.data.data
        this.declareMonth.push2(this.nowMonth);
        const c = new Date(new Date().getTime()-3600*24*day*1000)
        this.declareMonth.push2(c.getFullYear() + "-" + (Number(c.getMonth()) + 1).toString().padStart(2,0));
        this.declareMonth.push2("2021-12");
      })
      .catch(res => (console.log(res)));
  },
  mounted() {
    this.getData();
  },
  methods: {
    ratioChange(val){
      this.volume_workday[val+'Num'] = (this.volume_workday.workday * this.volume_workday[val]/100).toFixed(2)
    },
    numChange(val){
      this.volume_workday[val] =  (this.volume_workday[val+'Num']/ this.volume_workday.workday*100).toFixed(2)
    },
    rightClick(row, column, event) {
      this.menuVisible = false // 先把模态框关死，目的是 第二次或者第n次右键鼠标的时候 它默认的是true
      this.delMenu = false
      this.updMenu = false
      if (row.principal === this.$parent.name) {
        if (row.submit === 0 || row.submit === 3) {
          if (row.spider && ( row.state === "尚未开展" || row.state === "尚未确定")) {
            this.delMenu = true
          }
          if (row.spider === 0){
            this.delMenu = true
          }
          if (row.spider) {
            this.updMenu = true
          }
          if (this.delMenu || this.updMenu) {
            this.menuVisible = true // 显示模态窗口，跳出自定义菜单栏
            event.preventDefault() //关闭浏览器右键默认事件
            this.CurrentRow = row
            let menu = document.querySelector('#rightMenu');
            this.styleMenu(menu)
          }
        }
      }
    },
    foo() {
      // 取消鼠标监听事件 菜单栏
      this.menuVisible = false
      document.removeEventListener('click', this.foo) // 关掉监听，
    },
    styleMenu(menu) {
      if (event.clientX > 1800) {
        menu.style.left = event.clientX - 100 + 'px'
      } else {
        menu.style.left = event.clientX + 1 + 'px'
      }
      document.addEventListener('click', this.foo) // 给整个document新增监听鼠标事件，点击任何位置执行foo方法
      if (event.clientY > 700) {
        menu.style.top = event.clientY - 30 + 'px'
      } else {
        menu.style.top = event.clientY - 10 + 'px'
      }
    },
    dateDisabled(time){
      return time.getTime > Date.now && time>Date.getMonth()
    },
    dateDiff(sDate) {
      let date2 = new Date();
      let date1 = new Date(Date.parse(sDate.replace(/-/g,   "/")));
      let iDays = parseInt((date2.getTime()- date1.getTime()) /1000/60/60/24);
      return iDays;
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    completeState({row, rowIndex}) {
      // if (row.planned_shot_date !== undefined && row.planned_shot_date !== "" &&
      //   (row.state === '正在设计' || row.state === '正在校审')) {
      //   let days = this.dateDiff(row.planned_shot_date)
      //   let rowBackground = {};
      //   if (-1 >= days >= -3){
      //     row.reasonState = true
      //     rowBackground.background = "#dede89";
      //     return rowBackground;
      //   }else if (days >= -1 ){
      //     row.reasonState = true
      //     rowBackground.background = "pink";
      //     return rowBackground;
      //   }
      // }
    },
    clickRowHandle(row, column, event) {
      if(!row.expanded){
      if (column.property !== undefined) {
      row.loading = true;
      this.$axios
        .post(this.$baseUrl + 'project/queryTaskByUser',{
          id : row.id,
          queryStart : this.showDate[0],
          queryEnd : this.showDate[1]
        })
        .then(res => {
          if(res.data.data != undefined){
            let depList =[], tecList =[], designerList = [],
            principalList = [], checkerList = [];
          this.$nextTick( () => {
            res.data.data.forEach(item =>{
              item.general = row.general
              item.old = item.workday
            })
            this.$set(row,'list',res.data.data)
            row.expanded = true;
            this.$refs.uxGrid.setRowExpand([row],true)
            row.loading = false
          },0)
          }
              })
              .catch(res => (console.log(res.data)))
      }
      }else{
        row.expanded = false;
        this.$refs.uxGrid.setRowExpand([row],false)
      }
    },
    releasableStateFilterSum(row,type){
      if (type) {
        if (row.spider === 1) {
          if (row.submit === 1 || row.submit === 2) {
            return true;
          } else return false;
        }else {return true;}
      }else {
        if (row.spider === 0) {
          if (row.submit === 1 || row.submit === 2) {
            return true;
          } else return false;
        }else {return true;}
      }
    },
    querySearch(queryString, cb) {
      let results = queryString ? reasonList.filter( item =>
        item.toLowerCase().indexOf(queryString.toLowerCase()) === 0) : reasonList;
      cb(results);
    },
    reasonHandle(item,row){
      row.reason = item
    },

    changeReason(row){
      this.$axios
        .post(this.$baseUrl + 'volume/setReason', {
            "id": row.id,
            "reason" : row.reason
          }
        )
        .catch(res => (console.log(res)));
    },
      getData() {
      this.loading = false;
        this.$axios
          .post(this.$baseUrl + 'project/homepageProject')
          .then(res => {
            if (res.data.data.length>0) {
              this.projectList = res.data.data;
            }else {
              this.projectList = [];
            }
          })
          .catch(res => (console.log(res)));
    },
    workdayByPrincipal(row){
      this.$axios
        .post(this.$baseUrl + 'user/workdayByPrincipal',{},{headers :{id : row.id, queryDate : this.nowMonth}})
        .then(res => {
          this.user.id = row.id
          this.user.proName = row.name
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
    openDeclare(){
      this.user.declareDate = this.declareMonth[this.declareMonth.length-1]
      this.$axios
        .post(this.$baseUrl + 'project/queryNotDeclare',{
          id : this.user.id,
        })
        .then(res => {
          if (res.data.data.length>0) {
            this.user.declareList = res.data.data
          }else {
            this.user.declareList  = [];
          }
          this.declareVisible = true
        })
        .catch(res => (console.log(res)));
    },
    submitDeclare(){
      this.$axios
        .post(this.$baseUrl + 'project/setDeclare',this.multipleSelection, {headers : {declareDate : this.user.declareDate}})
        .then(res => {
          if (res.data.code === 0) {
            this.$message.success("操作成功")
            this.declareVisible = false
          }
        })
        .catch(res => (console.log(res)));
    },
    openLog(row){
      this.$axios
        .post(this.$baseUrl + 'user/logByPrincipal',{
          userId : row.id,
          id : this.user.id,
          date : this.nowMonth
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
    toggleExpandChangeEvent ({ row, expanded }) {
      row.loading = true;
      if(expanded){
      this.$axios
        .post(this.$baseUrl + 'project/queryTaskByUser',{
          id : row.id,
          queryStart : this.showDate[0],
          queryEnd : this.showDate[1]
        })
        .then(res => {
          if(res.data.data !== undefined){
            let depList =[], tecList =[], designerList = [],
            principalList = [], checkerList = [];
          this.$nextTick( () => {
            res.data.data.forEach(item =>{
              item.general = row.general
              item.old = item.workday
            })
            this.$set(row,'list',res.data.data)
            setTimeout(() =>{
                          console.log(this.$refs['grid'+row.id])
            },1)

            row.loading = false
          },0)
          }
              })
              .catch(res => (console.log(res.data)))
      }
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
    setWorkdayAdvance(val){
      this.$axios
        .post(this.$baseUrl + 'volume/setWorkdayAdvance', {
          id: this.volume_workday.id,
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
    setHighMethod(){
      console.log(this.volume_workday)
      if(Number(this.volume_workday.usable) === Number(this.volume_workday.grant)){
          this.$confirm('是否将任务结束时间置为已完成?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let row = {id : this.volume_workday.id, shot_date : this.nowDate + '-' +new Date().getDate().toString().padStart(2,0)}
          this.setHigh();
          this.taskComplete(row)
        }).catch(() => {
          this.setHigh()
        });
      }else{
        this.setHigh()
      }
    },
    setHigh(){
      if(Number(this.volume_workday.usable) >= Number(this.volume_workday.grant)){
      this.$axios
        .post(this.$baseUrl + 'task/setAdvance', {
          id: this.volume_workday.id,
          advance : this.volume_workday.grant,
          date : this.nowDate
          }
        )
        .then(res => {
          if(res.data.code === 0){
          this.$message.success("预发成功")

          }
        })
        .catch(res => (console.log(res)));
      }else{
           this.$message.warning("预发超出上限")
      }
    },
    openVolumeWorkday(row,type){
      this.rowData = row;
      this.$axios
        .post(this.$baseUrl + 'volume/queryVolumeWorkday', {
            "id": row.id,
            "date" : this.nowDate,
            spider : row.spider
          }
        )
        .then(res => {
          console.log(row.state)
          if(res.data.data !== null){
          this.volume_workday = res.data.data
            let t = ['designer','checker','principal', 'headman'];
            t.forEach(item =>{
              this.volume_workday[item + 'Num'] = this.volume_workday[item] * this.volume_workday.workday / 100
            });
          }
          this.volume_workday.id = row.id
          this.volume_workday.spider = row.spider
          this.volume_workday.state = row.state
          if(this.volume_workday.ratio === undefined){
            this.volume_workday.ratio = 0;
          }
          this.$forceUpdate
          if (type) {
            this.volume_workday_visible = true
          }else {
            this.ratioVisible = true
          }
        })
        .catch(res => (console.log(res)));
    },
    closeVolumeWorkday(){
      this.volume_workday = {};
      this.volume_workday_visible = false;
    },
    volumeWorkdaySubmit(){
      let sumRatio = Number(this.volume_workday.principal) +
        Number(this.volume_workday.designer) +
        Number(this.volume_workday.checker) +
        Number(this.volume_workday.headman);
      if (sumRatio === 100 || this.volume_workday.nowWorkday === this.volume_workday.workday) {
       this.httpWorkdayHigh();
      }else {
        this.$confirm('当前工时与卷册工时不一致，是否将卷册工时改为卷册工时?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let type = this.volume_workday.type === 0 ? "卷册" : "备用";
          this.volume_workday.designer = this.volume_workday.designerNum/this.volume_workday.nowWorkday*100;
          this.volume_workday.checker = this.volume_workday.checkerNum/this.volume_workday.nowWorkday*100;
          this.volume_workday.principal = this.volume_workday.principalNum/this.volume_workday.nowWorkday*100;
          this.volume_workday.headman = this.volume_workday.headmanNum/this.volume_workday.nowWorkday*100;
          let row = {project_id : this.volume_workday.project_id, id : this.volume_workday.id, type:type, workday: this.volume_workday.nowWorkday,
          spider : 1 , state : 0, tec : this.volume_workday.tec,
            designer_workday : 0,checker_workday : 0, principal_workday : 0, headman_workday : 0,
          old : this.volume_workday.workday,date : this.nowDate }
          this.changeWorkday(row)
          this.httpWorkdayHigh();
        }).catch(() => {
        });
      }
    },
    httpWorkdayHigh(){
      this.$axios
        .post(this.$baseUrl + 'volume/setWorkdayHigh', {
            "id": this.volume_workday.id,
            "principal": this.volume_workday.principal,
            "designer": this.volume_workday.designer,
            "checker": this.volume_workday.checker,
            "headman": this.volume_workday.headman
          }
        )
        .then(res => {
          if (res.data.code === 0) {
            this.$message.success("卷册比例修改成功")
            this.ratioVisible = false;
          }
        })
        .catch(res => (console.log(res)));
    },
    filterHandler({value, row, column}){
      const property = column['property'];
      return row[property] === value;
    },
    openProject(project){
      const href = this.$router.resolve(
        {
          path: "/projectMain",
          name: "projectMain",
          query:{
            "project_id" : project.id
          }
        }
      )
      window.open( href.href,project.id)
    },
    workdayDistribute(row){
          this.workdayData = {
            tec : "",
            num : 0,
            used : 0,
            manage : 0,
            volume : 0,
            usedManage : 0,
            todayManage : 0,
            designer : 0,
            checker : 0,
            principal : 0,
            headman : 0,
            manageRatio : 0,
            volumeRatio : 0,
            backupRatio : 0
          }
        this.$axios
          .post(this.$baseUrl + 'project/queryDistribute', {
            id : row.id,
            date : this.nowDate
          })
          .then(res => {
            this.workdayDateList = res.data.data;
            this.workdayData.id = row.id
            this.workdayData.tec = res.data.data[0].tec
            this.workdayData.num = res.data.data[0].amount
            this.workdayData.volumeUsed = res.data.data[0].volumeUsed;
            this.workdayData.manageUsed = res.data.data[0].manageUsed;
            this.workdayData.backupUsed = res.data.data[0].backupUsed;
            this.workdayData.manage = res.data.data[0].manage
            this.workdayData.volume = res.data.data[0].volume
            this.workdayData.check = res.data.data[0].check
            this.workdayData.designer = res.data.data[0].designer
            this.workdayData.checker = res.data.data[0].checker
            this.workdayData.principal = res.data.data[0].principal
            this.workdayData.headman = res.data.data[0].headman
            this.workdayData.checkerId = res.data.data[0].checkerId
            // this.workdayData.completeUsed = res.data.data[0].completeUsed
            this.workdayData.list = res.data.data[0].list
            this.workdayData.used = Number(res.data.data[0].backupUsed) + Number(res.data.data[0].manageUsed)
              + Number(res.data.data[0].volumeUsed)
            this.visible_workday = true;
          })
          .catch(res => (console.log(res)));
      this.$axios
        .post(this.$baseUrl + 'project/getCheckerList',{},{headers : {type : 0}})
        .then(res => {
          this.checkerList = res.data.data
        })
      .catch( res => console.log(res))
    },
    selectChecker(val){
      this.workdayData.checkerId = val
      this.$forceUpdate();
      this.$axios
        .post(this.$baseUrl + 'project/setTecChecker',
          {
            id : this.workdayData.id,
            tec : this.workdayData.tec,
            checker : this.workdayData.checkerId
          })
        .then(res => {
          if (res.data.code === 0){
            this.$message.success("操作成功")
          }
        })
        .catch( res => console.log(res))
    },
    selectTec(val){
                  this.workdayData.tec = val.tec
                  this.workdayData.num = val.amount
                  this.workdayData.volumeUsed = val.volumeUsed;
                  this.workdayData.manageUsed = val.manageUsed;
                  this.workdayData.backupUsed = val.backupUsed;
                  this.workdayData.manage =  val.manage
                  this.workdayData.volume =  val.volume;
                  this.workdayData.check = val.check;
                  this.workdayData.designer = val.designer
                  this.workdayData.checker = val.checker
                  this.workdayData.principal = val.principal
                  this.workdayData.headman = val.headman
                  this.workdayData.checkerId = val.checkerId
                  // this.workdayData.completeUsed = val.completeUsed
                  this.workdayData.list = val.list
                  this.workdayData.used = Number( val.backupUsed) + Number( val.manageUsed)
                  + Number(val.volumeUsed)
    },
    distributeSubmit(val){
      if (val === 0) {
        if (this.workdayData.checkerId === undefined) {
          this.$message.warning("请选择审核人")
          return 0;
        }
        if (this.workdayData.check === 2) {
          this.$message.warning("设总分配专业工时被主任回退，请稍后重试")
          return 0;
        }
        let t = ['designer','checker','principal', 'headman'];
        let ratioSum = 0;
        t.forEach( item =>{
          ratioSum += Number(this.workdayData[item])
        })
        console.log(ratioSum)
        if (Number(ratioSum) !== 100){
          this.$message.warning("专业比例和为100")
          return 0;
        }
      }
      // if (this.volumeUsed > (Number(this.workdayData.volume) - Number(this.workdayData.completeUsed))){
         if (this.volumeUsed > (Number(this.workdayData.volume))){
        this.$message.warning("卷册分配工时超出上限，请修改")
        return 0;
      }
      if(this.workdayData.check === 1){
      this.$axios
        .post(this.$baseUrl + 'project/distributeTecWorkday',{
          id : this.workdayData.id,
          tec : this.workdayData.tec,
          manage : this.workdayData.manage,
          volume : this.workdayData.volume,
          designer : this.workdayData.designer,
          checker : this.workdayData.checker,
          principal : this.workdayData.principal,
          headman : this.workdayData.headman,
          list : this.workdayData.list,
          check : val
          },
        )
        .then(res => {
          if (res.data.code === 0) {
            this.$message({
              type: "success",
              message: "工时分配成功"
            })
            this.visible_workday = false;
          }
        })
        .catch(res => (console.log(res)));
      }else{
        this.$message.warning("设总分配专业工时暂未被上级审核，请稍后重试")
      }
    },
    closeDialog(){
      this.workdayData = {
            tec : "",
            num : 0,
            used : 0,
            manage : 0,
            volume : 0,
            usedManage : 0,
            todayManage : 0,
    }
      this.visible_workday = false
    },
    openExcel(){
      this.excelDialog = true;
    },
    selectDep(val){
      this.task.dep = val.dep
      this.taskTec = val.list
      this.$forceUpdate
    },
    getTec(val){
      this.task.proNumber = val.number
      this.task.pid = val.id
    this.taskDep = [];
    this.taskTec = [];
    this.task.dep = "";
    this.task.tec = "";
      if(!this.taskType && this.task.show){
        this.$axios
          .post(this.$baseUrl + 'department/queryByProjectAll',{},{headers : {id : val.id}})
          .then(res => {
            if(res.data.code === 0){
              this.taskDep = res.data.data
            }
          })
          .catch(res => (console.log(res)));

      }else{
        this.$axios
          .post(this.$baseUrl + 'department/queryByProject',{},{headers : {id : val.id}})
          .then(res => {
            res.data.data.forEach(item => {
              this.taskDep.push2(item)
            })

          })
          .catch(res => (console.log(res)));
      }
    },
    getUasble(val){
      if(this.taskType){
        if(this.task.tec === undefined || this.task.tec === ""){
          this.$message.error("请先选择部门专业")
          return 0
        }
      }
      this.task.usable = 0;
      if(this.taskType){
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
              if(!this.task.check){
                this.$message.warning("工时分配暂未审核，新建任务工时暂不能发放")
              }else if(this.task.check === 2){
                this.$message.warning("该专业工时分配被组长回退，新建任务工时暂不能发放")
              }
              this.$forceUpdate
            }
            })
          .catch(res => (console.log(res)));
      }else{
          this.$axios
            .post(this.$baseUrl + 'projectWorkday/queryWorkdayByGeneral', {
              pid: this.task.pid,
              proNumber: this.task.proNumber,
              type: this.task.type,
            })
            .then(res => {
              if (res.data.code === 0) {
                this.task.number = res.data.data.number
                if (this.task.show) {
                  if (this.task.type === 0) {
                    this.task.usable = Number(res.data.data.manage) - Number(res.data.data.manageUsed)
                  } else {
                    this.task.usable = Number(res.data.data.backup) - Number(res.data.data.backupUsed)
                  }
                }else {
                  this.task.usable = "???"
                }
                this.task.check = res.data.data.check;
                if (!this.task.check) {
                  this.$message.warning("工时分配暂未审核，新建任务工时暂不能发放")
                }
                this.$forceUpdate
              }
            })
            .catch(res => (console.log(res)));
      }
    },
    newTask(val){
      this.task = {
      project : val,
      pid : val.id,
      number : "",
      name : "",
      type : 1,
      workday : 0,
      dep : "",
      tec : "",
      usable : 0,
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
      show : val.show};
    if(val.show){
      this.task.designer = this.$parent.name;
      this.taskInActivity = "设总发放";
      this.taskType = false;
    }else {
      this.taskType = true;
      this.taskInActivity = "申请备用";
    }
      // this.taskTypeShow = false;
      this.taskTypeShow = true;
      // 只有登陆人即是设总又是主设人才可
    if(val.show && val.principal){
      // this.taskTypeShow = true;
      this.taskTypeShow = false;
      this.taskType = false
    }
    this.taskPrincipal = [];
    if(this.taskType){
      this.projectList.forEach(item =>{
        if(item.principal){
          this.taskProject.push2(item)
        }
    })
    }else{
            this.projectList.forEach(item =>{
              if(item.show){
                this.taskProject.push2(item)
              }
            })
      }
    this.$forceUpdate();
    this.taskVisible = true
    this.getTec(val)
    },
    taskTypeChange(val){
      this.task.number = "";
      this.task.dep  = "";
      this.task.type = 1;
      this.task.tec = "";
      this.task.workday = 0;
      this.task.usable = 0;
      this.getTec(this.task.project)
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
      if(this.taskType){
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
      }else{
        if (this.task.type === 0) {
          if (this.task.planned_end === undefined || this.task.planned_end === '') {
            this.$message.warning("计划完成时间未填写")
            return 0
          }
        }
        this.$axios
          .post(this.$baseUrl + 'projectWorkday/setWorkdayByGeneral',this.task,)
          .then(res => {
            if(res.data.code === 0 || res.data.code === 560){
              this.taskVisible = false;
              this.$message.success("新增任务成功")
            }
          })
          .catch(res => (console.log(res)));
      }
    },
    delTask(row){
      this.$axios
        .post(this.$baseUrl + 'task/del',row)
        .then(res => {
          if (res.data.code === 0){
            this.$message.success("删除成功")
          }
        })
        .catch(res => (console.log(res)));
    },
    taskComplete(row){
      this.$axios
        .post(this.$baseUrl + 'task/taskComplete', {
            "id": row.id,
            "end" : row.shot_date          })
        .then(res =>{
          if(res.data.code === 0  ){
            this.$message.success("成功")
          }
        })
        .catch(res => {console.log(res)})
    },
    downExcel(){
      // 工时日志
      let that = this;
      this.$message.success("即将开始下载");
      let xhr = new XMLHttpRequest();
      let u =  this.$baseUrl + 'projectExcel/userByPrincipal?date='
        + this.nowMonth+'&id=' + that.user.id;
      xhr.open("get", u, true); // get、post都可
      xhr.responseType = "blob";  // 转换流
      xhr.setRequestHeader("Authorization", this.$storage.get("Authorization")); // token键值对
      xhr.onload = function() {
        if (this.status === 200) {
          let blob = this.response;
          let a = document.createElement("a")
          let url = window.URL.createObjectURL(blob)
          a.href = url
          a.download =  that.user.proName + "工时汇总表.xlsx"  // 文件名
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
      let u =  this.$baseUrl + 'projectExcel/personalVolume?minDay='
        + this.downMonth[0]+'&maxDay='+this.downMonth[1] + '&id=' + this.id;
      xhr.open("get", u, true); // get、post都可
      xhr.responseType = "blob";  // 转换流
      xhr.setRequestHeader("Authorization", this.$storage.get("Authorization")); // token键值对
      xhr.onload = function() {
        if (this.status === 200) {
          let blob = this.response;
          let a = document.createElement("a")
          let url = window.URL.createObjectURL(blob)
          a.href = url
          a.download =  that.$parent.name + "完成卷册信息表.xlsx"  // 文件名
          a.click()
          window.URL.revokeObjectURL(url)
        }
      }
      xhr.send();
    },
    remoteMethod(query) {
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
.el-tabs{
  margin-left: 2%;
  width: 96%;
}
.ux-table {
  /*margin-left: 2%;*/
  /*width: 96%;*/
  horiz-align: center;
  font-size: 12px;
  word-wrap: break-word;
  margin-bottom: 10px;
}

    /deep/ .ux-table__fixed-right {
      height: 100% !important;
    /*/ / 设置高优先，以覆盖内联样式*/
    }
    /deep/ .ux-table__fixed {
      height: 100% !important;
    /*/ / 设置高优先，以覆盖内联样式*/
    }
  /deep/ .ux-table th > .cell{
    text-align: center;
  }
  /deep/ .ux-table .cell{
    text-align: center;
  }

  .input {
    width: 50%;
  }

.el-input.is-disabled /deep/ .el-input__inner {
  background-color: white;
  color: #000000;
}

.contextmenu__item {
  display: block;
  line-height: 34px;
  text-align: center;
}
.contextmenu__item:not(:last-child) {
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}
.menu {
  position: absolute;
  background-color: #fff;
  width: 100px;
  /*height: 106px;*/
  font-size: 12px;
  color: #444040;
  border-radius: 4px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  border-radius: 3px;
  border: 1px solid rgba(0, 0, 0, 0.15);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.175);
  white-space: nowrap;
  z-index: 1000;
}
.contextmenu__item:hover {
  cursor: pointer;
  background: #66b1ff;
  border-color: #66b1ff;
  color: #fff;
}

</style>
