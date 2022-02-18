import Vue from 'vue'
import Router from 'vue-router'
import Login from '../components/login/Login'
import Appraise  from "../components/appraise/Appraise";
import Score  from "../components/admin/Score";
import Home  from "../components/navbar/Home";
import Details from "../components/admin/Details";
import AppraiseMain from "../components/navbar/AppraiseMain";
import TecAppraise from "../components/appraise/TecAppraise";
import TecScore from "../components/admin/TecScore";
import TecDetails from "../components/admin/TecDetails";
import Personal from "../components/admin/Personal";
import Department from "../components/admin/Department";
import AppraiseManage from "../components/admin/ApprasieManage";
import emptyPage from "../components/other/emptyPage";
import AdminProject from "../components/workday/AdminProject";
import Main from "../components/admin/Main";
import Construction from "../components/workday/Construction";
import ShowProject from "../components/workday/ShowProject";
import ProjectMain from "../components/navbar/ProjectMain";
import Project from "../components/workday/Project";
import ProjectVolume from "../components/workday/ProjectVolume";
import ProjectWorkday from "../components/workday/ProjectWorkday";
import AdminProphase from "../components/workday/AdminProphase";
import news from "../components/other/News";
import store from '@/store'
import Self from "../components/Self";
import Workday from "../components/admin/Workday";
import { Message } from 'element-ui'
import  storage  from  "../store/index"
import WorkdayLog from "../components/workday/WorkdayLog";
import BackupLog from "../components/workday/BackupLog";
import ManagerWorkday from "../components/workday/ManagerWorkday";
import ProjectUserWorkday from "../components/workday/ProjectUserWorkday";
import ProjectSumWorkday from "../components/workday/ProjectSumWorkday";

Vue.use(Router)

const VueRouterPush = Router.prototype.push
Router.prototype.push = function push (to) {
  return VueRouterPush.call(this, to).catch(err => err)
}

//replace
const VueRouterReplace = Router.prototype.replace
Router.prototype.replace = function replace (to) {
  return VueRouterReplace.call(this, to).catch(err => err)
}

const router = new Router({
  routes: [
    {
      path: '',
      name: 'self',
      component: AppraiseMain,
      children: [
        {path: '',
          name: 'Main',
          component: Self,
        }
      ]
    },
    {
      path: '/appraiseMain',
      name: 'AppraiseMain',
      component:  AppraiseMain,
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
      ]
    },
    {
      path: '/home',
      name: 'Home',
      component: Home,
      meta :{ role : ["超级管理员","管理员","主任"] },
      children:[
        {
          path: '',
          name: 'main',
          component: Main,
          meta :{ role : ["超级管理员","管理员","主任"] },
        },
        {
          path: 'main',
          name: 'main',
          component: Main,
          meta :{ role : ["超级管理员","管理员","主任"] },
        },
        {
          path: 'workday',
          name: 'workday',
          component: Workday,
          meta :{ role : ["超级管理员","管理员","主任"] },
        },
        {
          path: 'perScore',
          name: 'score',
          component: Score,
          meta :{ role : ["超级管理员","管理员","主任"] },
        },
        {
          path: 'perDetails',
          name: 'details',
          component: Details,
          meta :{ role : ["超级管理员","管理员","主任"] },
        },
        {
          path: 'tecScore',
          name: 'tecScore',
          component: TecScore,
          meta :{ role : ["超级管理员","管理员","主任"] },
        },
        {
          path: 'tecDetails',
          name: 'tecDetails',
          component: TecDetails,
          meta :{ role : ["超级管理员","管理员","主任"] },
        },
        {
          path: 'personal',
          name: 'personal',
          component: Personal,
          meta :{ role : ["超级管理员","管理员","主任"] },
        },
        {
          path: 'department',
          name: 'department',
          component: Department,
          meta :{ role : ["超级管理员","管理员","主任"] },
        },
        {
          path: 'appraiseManage',
          name: 'appraiseManage',
          component: AppraiseManage,
          meta :{ role : ["超级管理员","管理员","主任"] },
        },
        {
          path: 'adminProject',
          name: 'adminProject',
          component: AdminProject,
          meta :{ role : ["超级管理员","管理员","主任"] },
        },
        {
          path: 'adminProphase',
          name: 'adminProphase',
          component: AdminProphase,
          meta :{ role : ["超级管理员","管理员","主任"] },
        },
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: Login
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
      ]
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.path === '/login') {
    next();
  } else {
    let token = storage.get('Authorization');
    if (token === null || token === '') {
      store.remove('TOKEN')
      next({
        path: "/login",
        query: {
          redirect: to.fullPath
        } // 将刚刚要去的路由path（却无权限）作为参数，方便登录成功后直接跳转到该路由
      });
    } else {
      let reg = RegExp('home')
      if (reg.test(to.path)) {
        if (to.meta.role.indexOf( storage.get("role")) !== -1) {
          next();
        }else {
          Message({
            message: "暂无权限访问",
            type: 'error'
          })
        }
      } else {
        next();
      }
    }
  }
});

export default router;


