//authentication logic and State Management
const STORAGE_KEY = 'currentUser';

export const authService = {
  login(userData) {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
  },


  logout() {
    sessionStorage.removeItem(STORAGE_KEY);
    window.location.href = '/login.html';
  },


  getCurrentUser() {
    const user = sessionStorage.getItem(STORAGE_KEY);
    return user ? JSON.parse(user) : null;
  },


  isAuthenticated() {
    return this.getCurrentUser() !== null;
  }
};