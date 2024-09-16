import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  loading: false,
  user: null,
};
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // actions
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
    resetAuth: (state) => initialState, // Reset action
  },
});
export const { setLoading, setUser, resetAuth } = authSlice.actions;
export default authSlice.reducer;
