import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(), // hash模式：createWebHashHistory，history模式：createWebHistory
  routes: [
    {
      path: '/',
      redirect: '/introduce'
    },
    {
      path: '/introduce',
      name: 'introduce',
      component: () => import(/* webpackChunkName: "introduce" */ '../views/Introduce.vue')
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import(/* webpackChunkName: "dashboard" */ '../views/Index.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import(/* webpackChunkName: "login" */ '../views/Login.vue')
    },
    {
      path: '/add',
      name: 'add',
      component: () => import(/* webpackChunkName: "add" */ '../views/AddGood.vue')
    },

    {
      path: '/hot',
      name: 'hot',
      component: () => import(/* webpackChunkName: "hot" */ '../views/IndexConfig.vue')
    },
    {
      path: '/new',
      name: 'new',
      component: () => import(/* webpackChunkName: "new" */ '../views/IndexConfig.vue')
    },
    {
      path: '/recommend',
      name: 'recommend',
      component: () => import(/* webpackChunkName: "recommend" */ '../views/IndexConfig.vue')
    },
    {
      path: '/category',
      name: 'category',
      component: () => import(/* webpackChunkName: "category" */ '../views/Category.vue'),
      children: [
        {
          path: '/category/level2',
          name: 'level2',
          component: () => import(/* webpackChunkName: "level2" */ '../views/Category.vue'),
        },
        {
          path: '/category/level3',
          name: 'level3',
          component: () => import(/* webpackChunkName: "level3" */ '../views/Category.vue'),
        }
      ]
    },
    {
      path: '/good',
      name: 'good',
      component: () => import(/* webpackChunkName: "new" */ '../views/Good.vue')
    },

    {
      path: '/order',
      name: 'order',
      component: () => import(/* webpackChunkName: "order" */ '../views/Order.vue')
    },
    {
      path: '/order_detail',
      name: 'order_detail',
      component: () => import(/* webpackChunkName: "order_detail" */ '../views/OrderDetail.vue')
    },
    {
      path: '/warehouse_detail',
      name: 'warehouse_detail',
      component: () => import(/* webpackChunkName: "order_detail" */ '../views/WarehouseDetail.vue')
    },
    {
      path: '/transport',
      name: 'transport',
      component: () => import(/* webpackChunkName: "order_detail" */ '../views/Transport.vue')
    },
    {
      path: '/warehouse',
      name: 'warehouse',
      component: () => import(/* webpackChunkName: "order_detail" */ '../views/Warehouse.vue')
    },
    {
      path: '/shelf_detail',
      name: 'shelf_detail',
      component: () => import(/* webpackChunkName: "order_detail" */ '../views/ShelfDetail.vue')
    },
    {
      path: '/shelf',
      name: 'shelf',
      component: () => import(/* webpackChunkName: "order_detail" */ '../views/Shelf.vue')
    },
    {
      path: '/account',
      name: 'account',
      component: () => import(/* webpackChunkName: "account" */ '../views/Account.vue')
    },
    {
      path: '/addorder',
      name: 'addorder',
      component: () => import(/* webpackChunkName: "account" */ '../views/AddOrder.vue')
    },
    {
      path: '/car',
      name: 'car',
      component: () => import(/* webpackChunkName: "account" */ '../views/Car.vue')
    },
    {
      path: '/updategood',
      name: 'updategood',
      component: () => import(/* webpackChunkName: "account" */ '../views/UpdateGood.vue')
    },
    {
      path: '/insertcar',
      name: 'insertcar',
      component: () => import(/* webpackChunkName: "account" */ '../views/InsertCar.vue')
    }
  ]
})

export default router