// Simple local storage utilities for auth tokens and user data
export const authStorage = {
  setToken(token) {
    if (typeof window !== "undefined") {
      localStorage.setItem("cms_token", token)
    }
  },

  getToken() {
    if (typeof window !== "undefined") {
      return localStorage.getItem("cms_token")
    }
    return null
  },

  removeToken() {
    if (typeof window !== "undefined") {
      localStorage.removeItem("cms_token")
    }
  },

  setUser(user) {
    if (typeof window !== "undefined") {
      localStorage.setItem("cms_user", JSON.stringify(user))
    }
  },

  getUser() {
    if (typeof window !== "undefined") {
      const user = localStorage.getItem("cms_user")
      return user ? JSON.parse(user) : null
    }
    return null
  },

  removeUser() {
    if (typeof window !== "undefined") {
      localStorage.removeItem("cms_user")
    }
  },

  clearAuth() {
    this.removeToken()
    this.removeUser()
  },
}
