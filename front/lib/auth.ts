// Simple Auth Context for now - will be replaced with Better Auth later
import { authApi } from './api';

// Helper function to get current user from session
export async function getCurrentUser() {
  try {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('auth_token');

      if (token) {
        // Try to get user info from the backend
        try {
          const userInfo = await authApi.getUserInfo();
          // Update local storage with fresh user data
          localStorage.setItem('user_data', JSON.stringify(userInfo));
          return userInfo;
        } catch (error) {
          // If backend call fails, try to get from local storage
          const userData = localStorage.getItem('user_data');
          if (userData) {
            return JSON.parse(userData);
          }
        }
      }
    }

    throw new Error('Not authenticated');
  } catch (error) {
    console.error('Error getting current user:', error);
    throw error;
  }
}

// Sign in function - Updated to call the backend API
export async function authenticateUser(email: string, password: string) {
  try {
    // Call the backend API for authentication
    const authResult = await authApi.signIn({ email, password });

    // Store the token and user data
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', authResult.access_token);

      // Get user info separately since the login response might not include full user details
      try {
        const userInfo = await authApi.getUserInfo();
        localStorage.setItem('user_data', JSON.stringify(userInfo));
        return userInfo;
      } catch (userInfoError) {
        // Fallback to basic user info if fetching user info fails
        const basicUserInfo = {
          id: authResult.user_id,
          email,
          name: email.split('@')[0] // Just for demo
        };
        localStorage.setItem('user_data', JSON.stringify(basicUserInfo));
        return basicUserInfo;
      }
    }

    return authResult;
  } catch (error) {
    console.error('Authentication error:', error);
    throw error;
  }
}

// Sign up function - Updated to call the backend API
export async function registerUser(email: string, password: string, name: string) {
  try {
    // Call the backend API for registration
    const authResult = await authApi.signUp({ email, password, name });

    // Store the token and user data
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', authResult.access_token);

      // Get user info separately since the signup response might not include full user details
      try {
        const userInfo = await authApi.getUserInfo();
        localStorage.setItem('user_data', JSON.stringify(userInfo));
        return userInfo;
      } catch (userInfoError) {
        // Fallback to basic user info if fetching user info fails
        const basicUserInfo = {
          id: authResult.user_id,
          email,
          name
        };
        localStorage.setItem('user_data', JSON.stringify(basicUserInfo));
        return basicUserInfo;
      }
    }

    return authResult;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
}

// Sign out function
export async function deauthenticateUser() {
  try {
    // Call the backend API for logout (to invalidate the token server-side)
    await authApi.signOut();

    // Remove from localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
    }
  } catch (error) {
    console.error('Deauthentication error:', error);
    // Clear local data even if there's an error
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
    }
  }
}