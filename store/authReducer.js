import { createSlice } from '@reduxjs/toolkit'

const initialAuthState = {
  isAuthenticated: false,
  token: null
};

const authSlice = createSlice({
  name: 'authentication',
  initialState: initialAuthState,
  reducers: {
    login(state) {
      state.isAuthenticated = true;
    },
    logout(state) {
      localStorage.clear()
      state.isAuthenticated = false;
    },
    setToken(state, action) {
      // localStorage.setItem('token', JSON.stringify(token))
      state.token = action.payload
    }
  }
})

export const authActions = authSlice.actions

export default authSlice.reducer