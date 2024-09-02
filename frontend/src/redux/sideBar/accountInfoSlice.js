// src/redux/businessAccountSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk to fetch business account data
export const fetchBusinessAccount = createAsyncThunk(
  'businessAccount/fetchBusinessAccount',
  async (businessAccountId, thunkAPI) => {
    try {
        const response = await axios.get(`http://localhost:3000/api/get/user/${businessAccountId}`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

const businessAccountSlice = createSlice({
  name: 'businessAccount',
  initialState: {
    data: null,
    loading: false,
    error: null,
  },
  reducers: {
    // Reducers for any synchronous actions can go here
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBusinessAccount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBusinessAccount.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchBusinessAccount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default businessAccountSlice.reducer;
