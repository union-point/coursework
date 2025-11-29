import { authService } from './auth.js';
import { apiService } from './api.js';

if (!authService.isAuthenticated()) {
  window.location.href = '/login.html';
}