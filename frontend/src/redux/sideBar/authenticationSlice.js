import { createSlice } from '@reduxjs/toolkit';

// Initial state for the user
const initialState = {
  id: null,
  designation: '',
  name: "",
  isLoggedIn: false,
  isAdmin: false,  // Added isAdmin field
};

// Create the user slice
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // Action to set user data
    setUser(state, action) {
      const { id, designation, isAdmin, name } = action.payload;
      state.id = id;
      state.designation = designation;
      state.isAdmin = isAdmin;  // Set isAdmin based on payload
      state.isLoggedIn = true;
      state.name = name;
    },
    // Action to log out the user
    logout(state) {
      state.id = null;
      state.designation = '';
      state.isAdmin = false;  // Reset isAdmin on logout
      state.isLoggedIn = false;
      state.name = "";
    },
    // Action to update user designation
    updateDesignation(state, action) {
      state.designation = action.payload;
    },
    // Action to toggle admin status
    toggleAdmin(state) {
      state.isAdmin = !state.isAdmin;
    },
  },
});

// Export actions for use in components
export const { setUser, logout, updateDesignation, toggleAdmin } = userSlice.actions;

// Export reducer to be used in the store
export default userSlice.reducer;
