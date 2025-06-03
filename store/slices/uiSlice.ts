import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

interface Notification {
  id: string
  type: "success" | "error" | "info" | "warning"
  message: string
  title?: string
  autoClose?: boolean
  duration?: number
}

interface UiState {
  isLoading: boolean
  currentScreen: string
  notifications: Notification[]
  theme: "light" | "dark" | "system"
}

const initialState: UiState = {
  isLoading: false,
  currentScreen: "",
  notifications: [],
  theme: "system",
}

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    setCurrentScreen: (state, action: PayloadAction<string>) => {
      state.currentScreen = action.payload
    },
    addNotification: (state, action: PayloadAction<Omit<Notification, "id">>) => {
      const id = Date.now().toString()
      state.notifications.push({
        ...action.payload,
        id,
        autoClose: action.payload.autoClose ?? true,
        duration: action.payload.duration ?? 5000,
      })
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter((notification) => notification.id !== action.payload)
    },
    clearNotifications: (state) => {
      state.notifications = []
    },
    setTheme: (state, action: PayloadAction<"light" | "dark" | "system">) => {
      state.theme = action.payload
    },
  },
})

export const { setLoading, setCurrentScreen, addNotification, removeNotification, clearNotifications, setTheme } =
  uiSlice.actions

export default uiSlice.reducer
