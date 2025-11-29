import { defineStore } from 'pinia'
import router from '../router'
import api from '@/api/axios'

export const useUserStore = defineStore('user', {
  state: () => ({
    token: localStorage.getItem('token') || null,
    currentUser: null,
    users: [],
    user: [],
  }),
  actions: {
    setToken(token) {
      this.token = token
      localStorage.setItem('token', token)
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
      router.push('/login')
    },
    async fetchUsers() {
      const res = await api.get('/users')
      this.users = res.data
    },
    async editUsers(id) {
      const existing = this.users.find((u) => u.id == id)
      if (existing) {
        this.user = existing
        return existing
      }

      const res = await api.get(`/edit/${id}`)
      this.user = res.data
      return res.data
    },

    async updateUser(id, data) {
      const formData = new FormData()
      for (let k in data) {
        formData.append(k, data[k])
      }
      const res = await api.post(`/update/${id}`, formData)
      this.user = res.data
      const index = this.users.findIndex((u) => u.id === id)
      if (index !== -1) {
        Object.assign(this.users[index], res.data)
      }
      return res.data
    },

    async deleteUser(id) {
      await api.delete(`/delete/${id}`)
      this.users = this.users.filter((u) => u.id !== id)
    },
  },
})
