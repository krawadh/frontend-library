import { createSlice } from "@reduxjs/toolkit";

const memberSlice = createSlice({
  name: "member",
  initialState: {
    allMembers: [],
    allAdminMembers: [],
    singleMember: null,
    searchMemberByText: "",
    allAppliedMembers: [],
    searchedQuery: "",
  },
  reducers: {
    // actions
    setAllMembers: (state, action) => {
      state.allMembers = action.payload;
    },
    setAllAdminMembers: (state, action) => {
      state.allAdminMembers = action.payload;
    },
    setSingleMember: (state, action) => {
      state.singleMember = action.payload;
    },

    setSearchMemberByText: (state, action) => {
      state.searchMemberByText = action.payload;
    },
    setAllAppliedMembers: (state, action) => {
      state.allAppliedMembers = action.payload;
    },
    setSearchedQuery: (state, action) => {
      state.searchedQuery = action.payload;
    },
  },
});
export const {
  setAllMembers,
  setSingleMember,
  setAllAdminMembers,
  setSearchMemberByText,
  setAllAppliedMembers,
  setSearchedQuery,
} = memberSlice.actions;
export default memberSlice.reducer;
