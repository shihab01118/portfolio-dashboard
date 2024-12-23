import { create } from 'zustand';
import axios from 'axios';

const API_URL =
  import.meta.env.MODE === 'developement'
    ? 'http://localhost:5000/api/auth'
    : '/api/auth';
axios.defaults.withCredentials = true;

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  error: null,
  isLoading: false,
  isCheckingAuth: true,
  message: null,

  signup: async (name, email, password) => {
    set({ isLoading: true, error: null });

    try {
      const { data } = await axios.post(`${API_URL}/signup`, {
        name,
        email,
        password
      });
      set({ user: data?.user, isAuthenticated: true, isLoading: false });
      console.log('sign up response: ', data);
    } catch (error) {
      set({
        error: error?.response?.data?.message || 'Error in signup!',
        isLoading: false
      });
      console.log('sign up error: ', error);
      throw error;
    }
  },

  login: async (email, password) => {
    set({ isLoading: true, error: null });

    try {
      const { data } = await axios.post(`${API_URL}/login`, {
        email,
        password
      });
      set({ user: data?.user, isAuthenticated: true, isLoading: false });
      console.log('login response: ', data);
    } catch (error) {
      set({
        error: error?.response?.data?.message || 'Error in login!',
        isLoading: false
      });
      console.log('login error: ', error);
      throw error;
    }
  },

  verifyEmail: async (verificationCode) => {
    set({ isLoading: true, error: null });

    try {
      const { data } = await axios.post(`${API_URL}/verify-email`, {
        verificationCode
      });
      set({ user: data?.user, isAuthenticated: true, isLoading: false });
      console.log('verify email response: ', data);
      return data;
    } catch (error) {
      set({
        error: error?.response?.data?.message || 'Error verifying email!',
        isLoading: false
      });
      console.log('verify email error: ', error);
      throw error;
    }
  },

  checkAuth: async () => {
    set({ isCheckingAuth: true, error: null });

    try {
      const { data } = await axios.get(`${API_URL}/check-auth`);
      set({ user: data?.user, isAuthenticated: true, isCheckingAuth: false });
      console.log('check auth response: ', data);
    } catch (error) {
      set({
        error: null,
        isCheckingAuth: false
      });
      console.log('check auth error: ', error);
      throw error;
    }
  },

  logout: async () => {
    set({ isLoading: true, error: null });

    try {
      const { data } = await axios.post(`${API_URL}/logout`);
      set({ user: null, isAuthenticated: false, isLoading: false });
      console.log('logout response: ', data);
    } catch (error) {
      set({
        error: 'Logout failed!',
        isLoading: false,
        isAuthenticated: false
      });
      console.log('logout error: ', error);
      throw error;
    }
  },

  forgotPassword: async (email) => {
    set({ isLoading: true, error: null, message: null });

    try {
      const { data } = await axios.post(`${API_URL}/forgot-password`, {
        email
      });
      set({ isLoading: false, message: data?.message });
      console.log('forgot password response: ', data);
    } catch (error) {
      set({
        isLoading: false,
        error:
          error?.response?.data?.message || 'Error sending reset password email'
      });
      console.log('forgot password error: ', error);
      throw error;
    }
  },

  resetPassword: async (token, password) => {
    set({ isLoading: true, error: null, message: null });

    try {
      const { data } = await axios.post(`${API_URL}/reset-password/${token}`, {
        password
      });
      set({ isLoading: false, message: data?.message });
      console.log('reset password response', data);
    } catch (error) {
      set({
        isLoading: false,
        error: error?.response?.data?.message || 'Error resetting password!'
      });
      console.log('reset password error', error);
      throw error;
    }
  }
}));
