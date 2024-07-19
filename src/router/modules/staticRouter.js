import { HOME_URL, LOGIN_URL } from '@/config'

/**
 * staticRouter (静态路由)
 */
export const staticRouter = [
  {
    path: '/',
    redirect: HOME_URL
  },
  {
    path: LOGIN_URL,
    name: 'login',
    component: () => import('@/views/login/index.vue'),
    meta: {
      title: 'login'
    }
  },
  {
    path: '/layout',
    name: 'layout',
    component: () => import('@/layouts/index.vue'),
    // component: () => import("@/layouts/indexAsync.vue"),
    redirect: HOME_URL,
    children: []
  }
]

/**
 * errorRouter (错误页面路由)
 */
export const errorRouter = [
  {
    path: '/403',
    name: '403',
    component: () => import('@/components/ErrorMessage/403.vue'),
    meta: {
      title: 'page403'
    }
  },
  {
    path: '/404',
    name: '404',
    component: () => import('@/components/ErrorMessage/404.vue'),
    meta: {
      title: 'page404'
    }
  },
  {
    path: '/500',
    name: '500',
    component: () => import('@/components/ErrorMessage/500.vue'),
    meta: {
      title: 'page500'
    }
  },
  // Resolve refresh page, route warnings
  {
    path: '/:pathMatch(.*)*',
    component: () => import('@/components/ErrorMessage/404.vue')
  }
]
