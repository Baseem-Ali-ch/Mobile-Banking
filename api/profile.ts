// Mock data for development
const mockUser = {
  id: "user123",
  firstName: "John",
  lastName: "Doe",
  email: "john.doe@example.com",
  phoneNumber: "1234567890",
  profileImage: "/diverse-group-profile.png",
  address: "123 Main St",
  city: "New York",
  state: "NY",
  zipCode: "10001",
  country: "USA",
  dateOfBirth: "1990-01-01",
  createdAt: "2022-01-01T00:00:00.000Z",
  lastLogin: new Date().toISOString(),
  twoFactorEnabled: false,
  notificationPreferences: {
    transactions: true,
    balanceUpdates: true,
    securityAlerts: true,
    marketing: false,
  },
  appPreferences: {
    language: "en",
    theme: "light",
    defaultCurrency: "USD",
    defaultAccountId: "acc123",
  },
  verificationStatus: "pending",
  verificationDocuments: [
    {
      type: "id",
      status: "pending",
      uploadedAt: "2023-01-01T00:00:00.000Z",
    },
    {
      type: "address",
      status: "pending",
      uploadedAt: "2023-01-01T00:00:00.000Z",
    },
  ],
}

export const profileApi = {
  getUserProfile: async () => {
    try {
      // In a real app, this would be an API call
      // const response = await apiClient.get('/profile')
      // return response.data

      // For development, return mock data
      return mockUser
    } catch (error) {
      console.error("Error fetching user profile:", error)
      throw error
    }
  },

  updateUserProfile: async (userData: FormData) => {
    try {
      // In a real app, this would be an API call
      // const response = await apiClient.put('/profile', userData)
      // return response.data

      // For development, return mock data with updates
      return {
        ...mockUser,
        firstName: (userData.get("firstName") as string) || mockUser.firstName,
        lastName: (userData.get("lastName") as string) || mockUser.lastName,
        // Add other fields as needed
      }
    } catch (error) {
      console.error("Error updating user profile:", error)
      throw error
    }
  },

  updateSecuritySettings: async (data: { type: string; data: any }) => {
    try {
      // In a real app, this would be an API call
      // const response = await apiClient.put('/profile/security', data)
      // return response.data

      // For development, return mock data
      return {
        success: true,
        message: `${data.type} updated successfully`,
        user: mockUser,
      }
    } catch (error) {
      console.error("Error updating security settings:", error)
      throw error
    }
  },

  updatePreferences: async (preferences: any) => {
    try {
      // In a real app, this would be an API call
      // const response = await apiClient.put('/profile/preferences', preferences)
      // return response.data

      // For development, return mock data
      return {
        success: true,
        message: "Preferences updated successfully",
        user: {
          ...mockUser,
          notificationPreferences: {
            ...mockUser.notificationPreferences,
            ...preferences.notificationPreferences,
          },
          appPreferences: {
            ...mockUser.appPreferences,
            ...preferences.appPreferences,
          },
        },
      }
    } catch (error) {
      console.error("Error updating preferences:", error)
      throw error
    }
  },

  uploadVerificationDocuments: async (formData: FormData) => {
    try {
      // In a real app, this would be an API call
      // const response = await apiClient.post('/profile/verification', formData)
      // return response.data

      // For development, return mock data
      return {
        success: true,
        message: "Documents uploaded successfully",
        user: {
          ...mockUser,
          verificationStatus: "under_review",
          verificationDocuments: [
            {
              type: (formData.get("documentType") as string) || "id",
              status: "under_review",
              uploadedAt: new Date().toISOString(),
            },
            ...mockUser.verificationDocuments.filter((doc) => doc.type !== (formData.get("documentType") as string)),
          ],
        },
      }
    } catch (error) {
      console.error("Error uploading verification documents:", error)
      throw error
    }
  },
}
