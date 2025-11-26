import { defineStore } from 'pinia'
// import axios from 'axios'
import router from '../router'
import api from '@/api/axios'

export const useUserStore = defineStore('user', {
  state: () => ({
    token: localStorage.getItem('token') || null,
    currentUser: null,
    users: [],
  }),
  actions: {
    setToken(token) {
      this.token = token
      localStorage.setItem('token', token)
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
    },
    async register(data) {
      const formData = new FormData()
      for (let k in data) formData.append(k, data[k])
      await api.post('/register', formData)
      router.push('/login')
    },
    async login(data) {
      const res = await api.post('/login', data)
      this.setToken(res.data.token)
      this.currentUser = res.data.user
      router.push('/dashboard')
    },
    async logout() {
      await api.post('/logout')
      this.token = null
      this.currentUser = null
      localStorage.removeItem('token')
      delete api.defaults.headers.common['Authorization']
      router.push('/login')
    },
    async fetchUsers() {
      const res = await api.get('/users')
      this.users = res.data
    },
    async deleteUser(id) {
      await api.delete(`/delete/${id}`)
      this.users = this.users.filter((u) => u.id !== id)
    },
  },
})
