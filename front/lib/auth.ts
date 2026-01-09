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
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '';
        if (!API_BASE_URL) {
          throw new Error('API base URL is not configured');
        }

        // Validate the API base URL to prevent SSRF attacks
        if (!API_BASE_URL.startsWith('https://') && !API_BASE_URL.startsWith('http://')) {
          throw new Error('Invalid API base URL');
        }

        const userResponse = await fetch(`${API_BASE_URL}/auth/me`, {
          headers: {
            'Authorization': `Bearer ${authResult.access_token}`,
            'Content-Type': 'application/json',
          }
        });

        if (userResponse.ok) {
          const userInfo = await userResponse.json();
          localStorage.setItem('user_data', JSON.stringify(userInfo));
          return userInfo;
        } else {
          // If getting user info fails, use the user ID from the auth result
          const basicUserInfo = {
            id: authResult.user_id,
            email,
            name: email.split('@')[0] // Just for demo
          };
          localStorage.setItem('user_data', JSON.stringify(basicUserInfo));
          return basicUserInfo;
        }
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
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '';
        if (!API_BASE_URL) {
          throw new Error('API base URL is not configured');
        }

        // Validate the API base URL to prevent SSRF attacks
        if (!API_BASE_URL.startsWith('https://') && !API_BASE_URL.startsWith('http://')) {
          throw new Error('Invalid API base URL');
        }

        const userResponse = await fetch(`${API_BASE_URL}/auth/me`, {
          headers: {
            'Authorization': `Bearer ${authResult.access_token}`,
            'Content-Type': 'application/json',
          }
        });

        if (userResponse.ok) {
          const userInfo = await userResponse.json();
          localStorage.setItem('user_data', JSON.stringify(userInfo));
          return userInfo;
        } else {
          // If getting user info fails, use the user ID from the auth result
          const basicUserInfo = {
            id: authResult.user_id,
            email,
            name
          };
          localStorage.setItem('user_data', JSON.stringify(basicUserInfo));
          return basicUserInfo;
        }
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
    // Remove from localStorage (in a real app, this would be handled by Better Auth)
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