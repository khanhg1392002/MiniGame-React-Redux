// headerSlice.js
import { createSlice } from '@reduxjs/toolkit';

const SpinResultSlice = createSlice({
  name: 'spinResult',
  initialState: {
    showSpinResult: false,
    indicatedSegment: null,
  },
  reducers: {
    toggleSpinResult: (state, action) => {
        state.showSpinResult = action.payload;
        
    },
    setIndicatedSegment: (state, action) => {
        state.indicatedSegment = action.payload;
      },
  },
});


export const { toggleSpinResult,setIndicatedSegment } = SpinResultSlice.actions;
export default SpinResultSlice.reducer;