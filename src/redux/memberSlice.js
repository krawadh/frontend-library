import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  loading: true,
  errmessage: "",
  allAdminMembers: [],
  singleMember: null,
  searchMemberByText: "",
  allAppliedMembers: [],
  searchedQuery: "",
};
const memberSlice = createSlice({
  name: "member",
  initialState,
  reducers: {
    // actions
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setErrmessage: (state, action) => {
      state.errmessage = action.payload;
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
    setSearchedQuery: (state, action) => {
      state.searchedQuery = action.payload;
    },
    addMember: (state, action) => {
      return {
        ...state,
        allAdminMembers: [...state.allAdminMembers, action.payload], // Create a new array with the existing items and new item
      };
    },
    resetMember: (state) => initialState, // Reset action
  },
});
export const {
  resetMember,
  setLoading,
  setErrmessage,
  setSingleMember,
  setAllAdminMembers,
  setSearchMemberByText,
  setSearchedQuery,
  addMember,
} = memberSlice.actions;
export default memberSlice.reducer;
