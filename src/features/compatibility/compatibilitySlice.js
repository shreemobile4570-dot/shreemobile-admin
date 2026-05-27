import { createAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import compatibilityService from "./compatibilityService";

export const getCompatibility = createAsyncThunk(
  "compatibility/get-all",
  async (params, thunkAPI) => {
    try {
      return await compatibilityService.getCompatibility(params);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const createCompatibility = createAsyncThunk(
  "compatibility/create",
  async (data, thunkAPI) => {
    try {
      return await compatibilityService.createCompatibility(data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const getACompatibility = createAsyncThunk(
  "compatibility/get-one",
  async (id, thunkAPI) => {
    try {
      return await compatibilityService.getACompatibility(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const updateACompatibility = createAsyncThunk(
  "compatibility/update",
  async (data, thunkAPI) => {
    try {
      return await compatibilityService.updateCompatibility(data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const deleteACompatibility = createAsyncThunk(
  "compatibility/delete",
  async (id, thunkAPI) => {
    try {
      return await compatibilityService.deleteCompatibility(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const resetState = createAction("compatibility/reset");

const initialState = {
  compatibility: [],
  selectedCompatibility: null,
  isError: false,
  isLoading: false,
  isSuccess: false,
  message: "",
};

export const compatibilitySlice = createSlice({
  name: "compatibility",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getCompatibility.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getCompatibility.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.compatibility = action.payload;
      })
      .addCase(getCompatibility.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
      })
      .addCase(createCompatibility.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createCompatibility.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.createdCompatibility = action.payload;
      })
      .addCase(createCompatibility.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
      })
      .addCase(getACompatibility.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.selectedCompatibility = action.payload;
      })
      .addCase(updateACompatibility.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.updatedCompatibility = action.payload;
      })
      .addCase(deleteACompatibility.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.deletedCompatibility = action.payload;
      })
      .addCase(resetState, () => initialState);
  },
});

export default compatibilitySlice.reducer;
