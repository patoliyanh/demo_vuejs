import { createRouter, createWebHistory } from 'vue-router'
import LoginUser from '@/pages/LoginUser.vue'
import Register from '@/pages/RegisterUser.vue'
import DashboardUser from '@/pages/DashboardUser.vue'
import UpdateUser from '@/pages/UpdateUser.vue'

const routes = [
  { path: '/', component: LoginUser, name: 'login' },
  { path: '/register', component: Register, name: 'register' },
  { path: '/dashboard', component: DashboardUser, name: 'dashboard', meta: { requiresAuth: true } },
  {
    path: '/users/:id',
    component: UpdateUser,
    name: 'updateUser',
    meta: { requiresAuth: true },
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
