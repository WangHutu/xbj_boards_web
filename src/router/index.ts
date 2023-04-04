import { createRouter, createWebHistory } from 'vue-router'
import Layout from '@/components/layout/index.vue'
import { LocalVue } from '@/common/utils'
import { ElMessage } from 'element-plus'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      // component: HomeView,
      component: Layout,
      children: [
        { path: 'home', name: 'home', component: () => import('@/views/HomePage/index.vue') }
      ]
    },
    {
      path: '/type',
      component: Layout,
      children: [
        {
          path: 'Type',
          name: 'type',
          component: () => import('@/views/TypePage/index.vue')
        }
      ]
    },
    {
      path: '/admin',
      component: Layout,
      children: [
        {
          path: 'Admin',
          name: 'admin',
          component: () => import('@/views/adminPage/index.vue')
        }
      ]
    },
    {
      path: '/logs',
      component: Layout,
      children: [
        {
          path: 'Logs',
          name: 'logs',
          component: () => import('@/views/log.vue')
        }
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/Login.vue'),
      meta: {
        index: 1
      }
    }
  ]
})
// 路由拦截
// router.beforeEach((to, from, next) => {
//   if (to.path == '/login') {
//     localStorage.clear()
//     next()
//   } else {
//     // 获取 token
//     const token = LocalVue.getLocal('Authorization')
//     // token 不存在
//     if (token === null || token === '') {
//       ElMessage.error('Token不存在，请登录')
//       next('/login')
//     } else {
//       next()
//     }
//   }
// })
export default router
