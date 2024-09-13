import { createSlice } from "@reduxjs/toolkit";

const membershipSlice = createSlice({
  name: "Membership",
  initialState: {
    allAdminMemberships: [],
    singleMembership: null,
    searchMembershipByText: "",
    allAppliedMemberships: [],
    searchedQuery: "",
  },
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
  },
});
export const {
  setSingleMembership,
  setAllAdminMemberships,
  setSearchMembershipByText,
  setAllAppliedMemberships,
  setSearchedQuery,
} = membershipSlice.actions;
export default membershipSlice.reducer;
