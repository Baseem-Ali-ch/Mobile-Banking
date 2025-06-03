import { configureStore } from "@reduxjs/toolkit"
import authReducer from "./slices/authSlice"
import uiReducer from "./slices/uiSlice"
import accountsReducer from "./slices/accountsSlice"
import transactionsReducer from "./slices/transactionsSlice"
import dashboardReducer from "./slices/dashboardSlice"
import profileReducer from "./slices/profileSlice"
import reportsReducer from "./slices/reportsSlice"
import settingsReducer from "./slices/settingsSlice"
import userManagementReducer from "./slices/userManagementSlice"
import adminTransactionsReducer from "./slices/adminTransactionsSlice"
import walletReducer from "./slices/walletSlice"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    ui: uiReducer,
    accounts: accountsReducer,
    transactions: transactionsReducer,
    dashboard: dashboardReducer,
    profile: profileReducer,
    reports: reportsReducer,
    settings: settingsReducer,
    userManagement: userManagementReducer,
    adminTransactions: adminTransactionsReducer,
    wallet: walletReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
