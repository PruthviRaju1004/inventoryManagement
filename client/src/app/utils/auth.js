export const isAuthenticated = () => {
    return !!localStorage.getItem("token");
  };
  
  export const loginUser = async (email, password) => {
    // Replace with actual API call
    if (email === "test@example.com" && password === "password") {
      localStorage.setItem("token", "mock-token");
      return true;
    }
    return false;
  };
  
  export const registerUser = async (email, password) => {
    // Replace with actual API call
    localStorage.setItem("token", "mock-token");
    return true;
  };
  
  export const logoutUser = () => {
    localStorage.removeItem("token");
  };
  