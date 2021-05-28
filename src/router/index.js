import Vue from 'vue'
import Router from 'vue-router'
import Login from '../components/login/Login'
import Appraise  from "../components/score/Appraise";
import Score  from "../components/admin/Score";
import Home  from "../components/navbar/Home";
import Details from "../components/admin/Details";
import AppraiseMain from "../components/navbar/AppraiseMain";
import TecAppraise from "../components/score/TecAppraise";
import TecScore from "../components/admin/TecScore";
import TecDetails from "../components/admin/TecDetails";
import Personal from "../components/admin/Personal";
import Department from "../components/admin/Department";
import AppraiseManage from "../components/admin/ApprasieManage";
import emptyPage from "../components/emptyPage";
import GeneralProject from "../components/project/GeneralProject";
import DesignerProject from "../components/project/DesignerProject";
import PrincipalProject from "../components/project/PrincipalProject";
import CheckerProject from "../components/project/CheckerProject";
import HeadmanProject from "../components/project/HeadmanProject";
import AdminProject from "../components/admin/AdminProject";
import Main from "../components/admin/Main";
import UserScore from "../components/admin/UserScore";
import ShowProject from "../components/project/ShowProject";
import ProjectMain from "../components/navbar/ProjectMain";
import Project from "../components/project/Project";
import ProjectVolume from "../components/project/ProjectVolume";
import WorkDayManage from "../components/project/WorkDayManage";
import Virtual from "../components/admin/Virtual";
import news from "../components/diglog/news";
import Business from "../components/admin/Business";
import VirtualManage from "../components/admin/VirtualManage";
import BusinessManage from "../components/admin/BusinessManage";
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
export default new Router({
  routes: [
    {
      path: '/',
      name: 'login',
      component: Login
    },
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
      path: '/appraiseMain',
      name: 'AppraiseMain',
      component:  AppraiseMain,
      children: [
        {
          path: '',
          name: 'Main',
          component: UserScore,
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
          path: 'userScore',
          name: 'userScore',
          component: UserScore
        },
        {
          path: 'emptyPage',
          name: 'emptyPage',
          component: emptyPage
        },
        {
          path: 'generalProject',
          name: 'generalProject',
          component: GeneralProject
        },
        {
          path: 'principalProject',
          name: 'principalProject',
          component: PrincipalProject
        },
        {
          path: 'designerProject',
          name: 'designerProject',
          component: DesignerProject
        },
        {
          path: 'checkerProject',
          name: 'checkerProject',
          component: CheckerProject
        },
        {
          path: 'headmanProject',
          name: 'headmanProject',
          component: HeadmanProject
        },
        {
          path: 'showProject',
          name: 'showProject',
          component: ShowProject
        },]
    },
    {
      path: '/virtualManage',
      name : 'virtualManage',
      component: VirtualManage
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
          path: 'workDayManage',
          name: 'workDayManage',
          component: WorkDayManage
        },
      ]
    }
  ]
})


