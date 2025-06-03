import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from "axios"
import { store } from "@/store/store"
import { logout } from "@/store/slices/authSlice"
import { setLoading } from "@/store/slices/uiSlice"
import Cookies from "js-cookie"

// Base API URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.moneymanager.com"

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Get token from Redux store
    const { auth } = store.getState()

    // Set loading state
    store.dispatch(setLoading(true))

    // Get token from cookies
    const token = Cookies.get("auth_token")

    // Add auth token to headers if available
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => {
    store.dispatch(setLoading(false))
    return Promise.reject(error)
  },
)

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    store.dispatch(setLoading(false))
    return response
  },
  (error) => {
    store.dispatch(setLoading(false))

    // Handle 401 Unauthorized errors
    if (error.response && error.response.status === 401) {
      // Logout user
      store.dispatch(logout())
    }

    return Promise.reject(error)
  },
)

// API wrapper functions
export const api = {
  get: <T = any>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    return apiClient.get<T, AxiosResponse<T>>(url, config).then((response) => response.data)
  },

  post: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
    return apiClient.post<T, AxiosResponse<T>>(url, data, config).then((response) => response.data)
  },

  put: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
    return apiClient.put<T, AxiosResponse<T>>(url, data, config).then((response) => response.data)
  },

  patch: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
    return apiClient.patch<T, AxiosResponse<T>>(url, data, config).then((response) => response.data)
  },

  delete: <T = any>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    return apiClient.delete<T, AxiosResponse<T>>(url, config).then((response) => response.data)
  },
}

export default apiClient
