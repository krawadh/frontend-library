import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  allAdminMemberships: [],
  singleMembership: null,
  searchMembershipByText: "",
  allAppliedMemberships: [],
  searchedQuery: "",
};
const membershipSlice = createSlice({
  name: "Membership",
  initialState,
  reducers: {
    // actions
    setAllAdminMemberships: (state, action) => {
      state.allAdminMemberships = action.payload;
    },
    setSingleMembership: (state, action) => {
      state.singleMembership = action.payload;
    },

    setSearchMembershipByText: (state, action) => {
      state.searchMembershipByText = action.payload;
    },
    setAllAppliedMemberships: (state, action) => {
      state.allAppliedMemberships = action.payload;
    },
    setSearchedQuery: (state, action) => {
      state.searchedQuery = action.payload;
    },
    resetMembership: (state) => initialState, // Reset action
  },
});
export const {
  setSingleMembership,
  setAllAdminMemberships,
  setSearchMembershipByText,
  setAllAppliedMemberships,
  setSearchedQuery,
  resetMembership,
} = membershipSlice.actions;
export default membershipSlice.reducer;
