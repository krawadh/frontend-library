import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  allSeats: [],
  allAdminSeats: [],
  singleSeat: null,
  searchSeatByText: "",
  allAppliedSeats: [],
  searchedQuery: "",
};
const seatSlice = createSlice({
  name: "seat",
  initialState,
  reducers: {
    // actions
    setAllSeats: (state, action) => {
      state.allSeats = action.payload;
    },
    setAllAdminSeats: (state, action) => {
      state.allAdminSeats = action.payload;
    },
    setSingleSeat: (state, action) => {
      state.singleSeat = action.payload;
    },

    setSearchSeatByText: (state, action) => {
      state.searchSeatByText = action.payload;
    },
    setAllAppliedSeats: (state, action) => {
      state.allAppliedSeats = action.payload;
    },
    setSearchedQuery: (state, action) => {
      state.searchedQuery = action.payload;
    },
    resetSeat: (state) => initialState, // Reset action
  },
});
export const {
  setAllSeats,
  setSingleSeat,
  setAllAdminSeats,
  setSearchSeatByText,
  setAllAppliedSeats,
  setSearchedQuery,
  resetSeat,
} = seatSlice.actions;
export default seatSlice.reducer;
