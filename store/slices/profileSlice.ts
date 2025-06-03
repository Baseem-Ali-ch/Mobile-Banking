import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import { profileApi } from "@/api/profile"
import type { User } from "@/types"

interface ProfileState {
  user: User | null
  isLoading: boolean
  isUpdating: boolean
  error: string | null
}

const initialState: ProfileState = {
  user: null,
  isLoading: false,
  isUpdating: false,
  error: null,
}

// Async thunks
export const fetchUserProfile = createAsyncThunk("profile/fetchUserProfile", async (_, { rejectWithValue }) => {
  try {
    const response = await profileApi.getUserProfile()
    return response
  } catch (error) {
    return rejectWithValue("Failed to fetch user profile")
  }
})

export const updateUserProfile = createAsyncThunk(
  "profile/updateUserProfile",
  async (userData: FormData, { rejectWithValue }) => {
    try {
      const response = await profileApi.updateUserProfile(userData)
      return response
    } catch (error) {
      return rejectWithValue("Failed to update user profile")
    }
  },
)

export const updateSecuritySettings = createAsyncThunk(
  "profile/updateSecuritySettings",
  async (data: { type: string; data: any }, { rejectWithValue }) => {
    try {
      const response = await profileApi.updateSecuritySettings(data)
      return response
    } catch (error) {
      return rejectWithValue(`Failed to update ${data.type} settings`)
    }
  },
)

export const updatePreferences = createAsyncThunk(
  "profile/updatePreferences",
  async (preferences: any, { rejectWithValue }) => {
    try {
      const response = await profileApi.updatePreferences(preferences)
      return response
    } catch (error) {
      return rejectWithValue("Failed to update preferences")
    }
  },
)

export const uploadVerificationDocuments = createAsyncThunk(
  "profile/uploadVerificationDocuments",
  async (formData: FormData, { rejectWithValue }) => {
    try {
      const response = await profileApi.uploadVerificationDocuments(formData)
      return response
    } catch (error) {
      return rejectWithValue("Failed to upload verification documents")
    }
  },
)

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload
    },
    clearUser: (state) => {
      state.user = null
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    // Fetch user profile
    builder.addCase(fetchUserProfile.pending, (state) => {
      state.isLoading = true
      state.error = null
    })
    builder.addCase(fetchUserProfile.fulfilled, (state, action) => {
      state.isLoading = false
      state.user = action.payload
    })
    builder.addCase(fetchUserProfile.rejected, (state, action) => {
      state.isLoading = false
      state.error = action.payload as string
    })

    // Update user profile
    builder.addCase(updateUserProfile.pending, (state) => {
      state.isUpdating = true
      state.error = null
    })
    builder.addCase(updateUserProfile.fulfilled, (state, action) => {
      state.isUpdating = false
      state.user = action.payload
    })
    builder.addCase(updateUserProfile.rejected, (state, action) => {
      state.isUpdating = false
      state.error = action.payload as string
    })

    // Update security settings
    builder.addCase(updateSecuritySettings.pending, (state) => {
      state.isUpdating = true
      state.error = null
    })
    builder.addCase(updateSecuritySettings.fulfilled, (state, action) => {
      state.isUpdating = false
      // Update user if needed
      if (action.payload.user) {
        state.user = action.payload.user
      }
    })
    builder.addCase(updateSecuritySettings.rejected, (state, action) => {
      state.isUpdating = false
      state.error = action.payload as string
    })

    // Update preferences
    builder.addCase(updatePreferences.pending, (state) => {
      state.isUpdating = true
      state.error = null
    })
    builder.addCase(updatePreferences.fulfilled, (state, action) => {
      state.isUpdating = false
      // Update user if needed
      if (action.payload.user) {
        state.user = action.payload.user
      }
    })
    builder.addCase(updatePreferences.rejected, (state, action) => {
      state.isUpdating = false
      state.error = action.payload as string
    })

    // Upload verification documents
    builder.addCase(uploadVerificationDocuments.pending, (state) => {
      state.isUpdating = true
      state.error = null
    })
    builder.addCase(uploadVerificationDocuments.fulfilled, (state, action) => {
      state.isUpdating = false
      // Update user if needed
      if (action.payload.user) {
        state.user = action.payload.user
      }
    })
    builder.addCase(uploadVerificationDocuments.rejected, (state, action) => {
      state.isUpdating = false
      state.error = action.payload as string
    })
  },
})

export const { setUser, clearUser, setError, clearError } = profileSlice.actions

export default profileSlice.reducer
