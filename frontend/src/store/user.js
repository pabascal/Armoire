import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState: {
    user: null,
    token: null,
    isAuthenticated: false,
  },
  reducers: {
    login: (state, action) => {
      
      if (action.payload.user && action.payload.token) {
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;

        try {
          localStorage.setItem('user', JSON.stringify(action.payload.user));
          localStorage.setItem('token', action.payload.token);
        } catch (e) {
          console.error('Failed to save to localStorage:', e);
        }
      }
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    },
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
    },
  },
});

export const loginUser = async (email, password) => {
    const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
    }
    return response.json();
};

export const registerUser = async (name, email, password) => {
  const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
  });
  
  const data = await response.json();
  
  if (!response.ok) {
      throw new Error(data.message || 'Registration failed');
  }
  return data;
};

export const { login, logout, updateUser } = userSlice.actions;
export default userSlice.reducer;