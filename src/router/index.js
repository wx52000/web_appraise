import Vue from 'vue'
import "../assets/js/directives/permission";
import Router from 'vue-router'
import Login from '../components/login/Login'
import store from '@/store'
import { Message } from 'element-ui'
import  storage  from  "../store/index"
import {getRouter} from "./permission";
import Error from "../components/other/Error";
import AppraiseMain from "../components/navbar/AppraiseMain";
import Self from "../components/Self";
import OtherCheck from "../components/other/OtherCheck";

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

export const constantRoutes = [
    {
      path: '/login',
      name: 'login',
      component: Login
    },
  {
    path: '/',
    name: 'main',
    component: AppraiseMain,
    children: [
      {path: '',
        name: 'main',
        component: Self,
      }
    ]
  },
  {
    path: '/otherCheck',
    name: 'OtherCheck',
    component: OtherCheck,
  },
    ]


const createRouter = () => new Router({
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

export function resetRouter() {
  oneRun = true
  const newRouter = createRouter()
  router.options = newRouter.options
  router.matcher = newRouter.matcher
}

let oneRun  = true
let load = 0

router.beforeEach((to, from, next) => {
  if (to.path === '/login') {
    next();
  } else {
    let token = storage.get('Authorization');
    if (token === null || token === '') {
      storage.removeAll()
      next({
        path: "/login",
        // query: {
        //   redirect: to.fullPath
        // } // 将刚刚要去的路由path（却无权限）作为参数，方便登录成功后直接跳转到该路由
      });
    } else {
      if (storage.get("role") === "外部门") {
        if (to.path === "/otherCheck") {
          next();
        }else {
          next(
            {path: "/otherCheck"} )
        }
      } else {
        if (oneRun) {
          try {
            let newRouter = getRouter(storage.get("menus"))
            router.options.routes = router.options.routes.concat(newRouter)
            router.addRoutes(newRouter)
            oneRun = false
            next({...to, replace: true})
          } catch (error) {
            next({
              path: "/login",
            });
          }
        } else {
          next();
        }
      }
    }
  }
});

export default router;


