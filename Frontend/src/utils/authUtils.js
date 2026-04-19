// Authentication utility functions

export const getToken = () => {
  return localStorage.getItem("token");
};

export const getAuthHeaders = () => {
  const token = getToken();
  if (!token) return null;
  
  return {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`,
  };
};

export const getUserInfo = () => {
  return {
    token: localStorage.getItem("token"),
    email: localStorage.getItem("email"),
    name: localStorage.getItem("name"),
    userId: localStorage.getItem("userId"),
    isLoggedIn: localStorage.getItem("isLoggedIn") === "true",
  };
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("email");
  localStorage.removeItem("name");
  localStorage.removeItem("userId");
  localStorage.removeItem("isLoggedIn");
  console.log("User logged out, tokens cleared");
};

export const isAuthenticated = () => {
  return !!getToken() && localStorage.getItem("isLoggedIn") === "true";
};

export const setAuthData = (token, email, name, userId) => {
  localStorage.setItem("token", token);
  localStorage.setItem("email", email);
  localStorage.setItem("name", name);
  localStorage.setItem("userId", userId);
  localStorage.setItem("isLoggedIn", "true");
};
