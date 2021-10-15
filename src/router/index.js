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
import Virtual from "../components/workday/AdminProphase";
import news from "../components/other/news";
import Business from "../components/workday/Business";
import BusinessManage from "../components/workday/BusinessManage";
import store from '@/store'
import Prophase from "../components/workday/Prophase";
import MajorWorkday from "../components/workday/MajorWorkday";
import BackupWorkday from "../components/workday/BackupWorkday";
import Self from "../components/Self";
import Workday from "../components/admin/Workday";

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
      path: '/home',
      name: 'Home',
      component: Home,
      children:[
        {
          path: 'main',
          name: 'main',
          component: Main
        },
        {
          path: 'workday',
          name: 'workday',
          component: Workday
        },
        {
          path: 'perScore',
          name: 'score',
          component: Score
        },
        {
          path: 'perDetails',
          name: 'details',
          component: Details
        },
        {
          path: 'tecScore',
          name: 'tecScore',
          component: TecScore
        },
        {
          path: 'tecDetails',
          name: 'tecDetails',
          component: TecDetails
        },
        {
          path: 'personal',
          name: 'personal',
          component: Personal
        },
        {
          path: 'department',
          name: 'department',
          component: Department
        },
        {
          path: 'appraiseManage',
          name: 'appraiseManage',
          component: AppraiseManage
        },
        {
          path: 'adminProject',
          name: 'adminProject',
          component: AdminProject
        },
        {
          path: 'virtual',
          name: 'virtual',
          component: Virtual
        },
        {
          path: 'business',
          name: 'business',
          component: Business
        },
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/appraiseMain',
      name: 'AppraiseMain',
      component:  AppraiseMain,
      children: [
        {
          path: '',
          name: 'Main',
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
          path: 'prophase',
          name: 'prophase',
          component: Prophase
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
        },]
    },
    {
      path: '/businessManage',
      name : 'businessManage',
      component: BusinessManage
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
          path: 'projectWorkday',
          name: 'projectWorkday',
          component: ProjectWorkday
        },
        {
          path: 'majorWorkday',
          name: 'majorWorkday',
          component: MajorWorkday
        },
        {
          path: 'backupWorkday',
          name: 'backupWorkday',
          component: BackupWorkday
        },
      ]
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.path === '/login') {
    next();
  } else {
    let token = localStorage.getItem('Authorization');
    if (token === null || token === '') {
      store.remove('TOKEN')
      next({
        path: "/login",
        query: {
          redirect: to.fullPath
        } // 将刚刚要去的路由path（却无权限）作为参数，方便登录成功后直接跳转到该路由
      });
    } else {
      next();
    }
  }
});

export default router;


