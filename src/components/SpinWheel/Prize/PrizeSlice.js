// headerSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { addNumberTurns, decrementScore } from '../Wheel/WheelSlice';

const prizeSlice = createSlice({
  name: 'prize',
  initialState: {
    showPrize: false,
    showOption: false,
  },
  reducers: {
    togglePrize: (state, action) => {
        state.showPrize = action.payload;
    },
    toggleOption: (state, action) => {
        state.showOption = action.payload;
    }
  },
});

// Action creator cho spinwheel
export const moreTurns = () => (dispatch) => {
  dispatch(decrementScore(4));
  dispatch(togglePrize(false));
  dispatch(addNumberTurns());
};

// Action creator cho startGame
export const money = () => (dispatch) => {
  dispatch(decrementScore(5));
  dispatch(togglePrize(false));
  dispatch(toggleOption(true));
  setTimeout(() => {
    dispatch(toggleOption(false));
  }, 3000);
};

export const { togglePrize, toggleOption } = prizeSlice.actions;
export default prizeSlice.reducer;