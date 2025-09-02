// Authentication utility functions

export const isAuthenticated = () => {
  const token = localStorage.getItem("token");
  return !!token;
};

export const getToken = () => {
  return localStorage.getItem("token");
};

export const setToken = (token) => {
  localStorage.setItem("token", token);
};

export const removeToken = () => {
  localStorage.removeItem("token");
};

export const getUser = () => {
  const userStr = localStorage.getItem("user");
  return userStr ? JSON.parse(userStr) : null;
};

export const setUser = (user) => {
  localStorage.setItem("user", JSON.stringify(user));
};

export const removeUser = () => {
  localStorage.removeItem("user");
};

export const logout = () => {
  removeToken();
  removeUser();
  // Redirect to login
  window.location.href = "/login";
};

export const checkAuthStatus = async () => {
  try {
    const token = getToken();
    if (!token) {
      console.log("No token found in localStorage");
      return false;
    }

    console.log("Token found, checking validity...");

    // For now, use a simpler approach - just check if token exists and has user data
    // This avoids the problematic /api/me endpoint
    const user = getUser();
    if (token && user) {
      console.log("Using localStorage check - token and user exist");
      // Validate token silently in background to ensure it's still valid
      validateTokenSilently(token);
      return true;
    }

    // If no user data, try to validate token by making a simple API call
    try {
      // Test with a simple endpoint that doesn't require complex auth
      const response = await fetch("http://127.0.0.1:8000/api/test-auth", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        console.log("Token validation successful via test endpoint");
        return true;
      } else {
        console.log("Token validation failed, status:", response.status);
        // Token is invalid, clear it
        removeToken();
        removeUser();
        return false;
      }
    } catch (fetchError) {
      console.log("Backend call failed, using localStorage fallback:", fetchError.message);
      // If backend call fails, fall back to localStorage check
      // This handles cases where backend might be down
      if (token && user) {
        console.log("Using localStorage fallback - token and user exist");
        return true;
      }
      return false;
    }
  } catch (error) {
    console.error("Auth check failed:", error);
    // Don't clear tokens on general errors, just return false
    return false;
  }
};

// Silently validate token in background without affecting user experience
const validateTokenSilently = async (token) => {
  try {
    const response = await fetch("http://127.0.0.1:8000/api/test-auth", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      console.log("Silent token validation failed, attempting refresh");
      // Try to refresh the token silently
      refreshToken().catch(err => console.log("Silent refresh failed:", err));
    }
  } catch (error) {
    console.log("Silent validation error:", error);
  }
};

export const refreshToken = async () => {
  try {
    const token = getToken();
    if (!token) throw new Error("No token to refresh");

    const response = await fetch("http://127.0.0.1:8000/api/refresh", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      setToken(data.token);
      return data.token;
    } else {
      throw new Error("Token refresh failed");
    }
  } catch (error) {
    console.error("Token refresh failed:", error);
    logout();
    throw error;
  }
};
