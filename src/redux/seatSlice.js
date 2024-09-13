import { createSlice } from "@reduxjs/toolkit";

const seatSlice = createSlice({
  name: "seat",
  initialState: {
    allSeats: [],
    allAdminSeats: [],
    singleSeat: null,
    searchSeatByText: "",
    allAppliedSeats: [],
    searchedQuery: "",
  },
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
  },
});
export const {
  setAllSeats,
  setSingleSeat,
  setAllAdminSeats,
  setSearchSeatByText,
  setAllAppliedSeats,
  setSearchedQuery,
} = seatSlice.actions;
export default seatSlice.reducer;
