
import { defineStore } from 'pinia'
import type {
  User,
  SignInCredentials,
  SignUpData,
} from '~/types/user'

import {
  signInUser,
  signUpUser,
  signOutUser,
} from '~/services/authServices'

interface UserState {
  user: User | null
  isLoading: boolean
  error: string | null
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    user: null,
    isLoading: false,
    error: null,
  }),

  getters: {
    isAuthenticated: (state) => state.user !== null,
  },

  actions: {
    async signIn(credentials: SignInCredentials) {
      this.isLoading = true
      this.error = null

      try {
        this.user = await signInUser(credentials)
      } catch (error) {
        this.error = 'Unable to sign in. Please check your details.'
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async signUp(data: SignUpData) {
      this.isLoading = true
      this.error = null

      try {
        this.user = await signUpUser(data)
      } catch (error) {
        this.error = 'Unable to create your account.'
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async signOut() {
      this.isLoading = true

      try {
        await signOutUser()
      } finally {
        this.user = null
        this.isLoading = false
      }
    },

    setUser(user: User | null) {
      this.user = user
    },
  },
})
