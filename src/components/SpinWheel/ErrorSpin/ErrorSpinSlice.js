// headerSlice.js
import { createSlice } from '@reduxjs/toolkit';


const ErrorSpinSlice = createSlice({
  name: 'erroSpin',
  initialState: {
    showErrorSpin: false,
  },
  reducers: {
    toggleErrorSpin: (state, action) => {
        state.showErrorSpin = action.payload;
    },
  },
});


export const { toggleErrorSpin } = ErrorSpinSlice.actions;
export default ErrorSpinSlice.reducer;