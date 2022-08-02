import router from "./index";
import storage from '../store/index'
import ProjectMain from "../components/navbar/ProjectMain";
import Project from "../components/workday/Project";
import ProjectVolume from "../components/workday/ProjectVolume";
import ProjectSumWorkday from "../components/workday/ProjectSumWorkday";
import ProjectWorkday from "../components/workday/ProjectWorkday";
import WorkdayLog from "../components/workday/WorkdayLog";
import BackupLog from "../components/workday/BackupLog";
import ProjectUserWorkday from "../components/workday/ProjectUserWorkday";
import AppraiseMain from "../components/navbar/AppraiseMain";
import Self from "../components/Self";
import Appraise from "../components/appraise/Appraise";
import TecAppraise from "../components/appraise/TecAppraise";
import Construction from "../components/workday/Construction";
import emptyPage from "../components/other/emptyPage";
import ShowProject from "../components/workday/ShowProject";
import ManagerWorkday from "../components/workday/ManagerWorkday";
import Error from "../components/other/Error";
import OtherCheck from "../components/other/OtherCheck";
import SelfProject from "../components/workday/SelfProject";
import ProjectProgressDetails from "../components/workday/ProjectProgressDetails";
import ManageProgress from "../components/workday/ManageProgress";
import ManageProjectRole from "../components/workday/ManageProjectRole";


export function getRouter(routers) {
  let role = storage.get("role")
  if (role !== "外部门") {
    let routerList = [
      {
        path: '/appraiseMain',
        name: 'AppraiseMain',
        component: AppraiseMain,
        children: [
          {
            path: '',
            name: 'self',
            component: Self,
          },
          {
            path: 'self',
            name: 'self',
            component: Self,
          },
          {
            path: 'appraise',
            name: 'appraise',
            component: Appraise,
          },
          {
            path: 'tecAppraise',
            name: 'tecAppraise',
            component: TecAppraise,
          },
          {
            path: 'construction',
            name: 'construction',
            component: Construction
          },
          {
            path: 'emptyPage',
            name: 'emptyPage',
            component: emptyPage
          },
          {
            path: 'showProject',
            name: 'showProject',
            component: ShowProject
          },
          {
            path: 'managerWorkday',
            name: 'managerWorkday',
            component: ManagerWorkday
          },
          {
            path: 'manageProgress',
            name: 'manageProgress',
            component: ManageProgress
          },
          {
            path: 'manageProjectRole',
            name: 'manageProjectRole',
            component: ManageProjectRole
          },
          {
            path: 'selfProject',
            name: 'selfProject',
            component: SelfProject
          },
        ]
      },
      {
        path: '/projectMain',
        name: 'projectMain',
        redirect: '/projectMain/project',
        component: ProjectMain,
        children: [
          {
            path: 'project',
            name: 'project',
            component: Project
          },
          {
            path: 'projectVolume',
            name: 'projectVolume',
            component: ProjectVolume
          },
          {
            path: 'projectSumWorkday',
            name: 'projectSumWorkday',
            component: ProjectSumWorkday
          },
          {
            path: 'projectWorkday',
            name: 'projectWorkday',
            component: ProjectWorkday
          },
          {
            path: 'workdayLog',
            name: 'workdayLog',
            component: WorkdayLog
          },
          {
            path: 'backupLog',
            name: 'backupLog',
            component: BackupLog
          },
          {
            path: 'projectUserWorkday',
            name: 'projectUserWorkday',
            component: ProjectUserWorkday
          },
          {
            path: 'projectProgressDetails',
            name: 'projectProgressDetails',
            component: ProjectProgressDetails
          },
        ]
      },
      {
        path: '*',
        name: '404',
        component: Error
      },]
    let home = {
      path: '/home',
      name: 'Home',
      component: (resolve) => require(['../components/navbar/Home'], resolve),
      children: [
        {
          path: '',
          name: 'main',
          component: (resolve) => require(["../components/admin/Workday"], resolve)
        },
        {
          path: 'main',
          name: 'main',
          component: (resolve) => require(["../components/admin/Workday"], resolve)
        },
      ]
    }
    if (routers !== null && routers.length > 0) {
      routers.forEach((item, index) => {
        ``
        if (item.path) {
          let ops = {
            path: item.path,
            name: item.router,
            component: (resolve) => require([`../components${item.import}`], resolve),
          }
          home.children.push(ops)
        } else {
          item.children.forEach(i => {
            let ops = {
              path: i.path,
              name: i.router,
              component: (resolve) => require([`../components${i.import}`], resolve),
            }
            home.children.push(ops)
          })
        }
      })
      routerList.push(home)
    }
    return routerList
  }else {
    return [
      {
        path: '*',
        name: '404',
        component: Error
      },
    ]
  }
}
