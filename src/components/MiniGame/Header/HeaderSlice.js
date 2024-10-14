// headerSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { toggleCountdownModal, clearIntervalId } from '../CountdownModal/CountdownSlice';
import { toggleGameContent } from '../GameContentModal/GameContentSlice';
import { toggleWheel, resetWheel } from '../../SpinWheel/Wheel/WheelSlice';
import audioManager from '../../../utils/audioManager';

const headerSlice = createSlice({
  name: 'header',
  initialState: {},
  reducers: {},
});

// Action creator cho spinwheel
export const spinWheel = () => (dispatch) => {
  console.clear();
  dispatch(toggleGameContent(false));
  dispatch(toggleCountdownModal(false));
  dispatch(clearIntervalId());
  dispatch(toggleWheel(true));
  dispatch(resetWheel());
  audioManager.playSoundWheel();
};

// Action creator cho startGame
export const startGame = () => (dispatch, getState) => {
  const isSpinning = getState().wheelModal.isSpinning;
  if ( !isSpinning ) {
  audioManager.audioBgWheel.pause();
  dispatch(toggleWheel(false));
  dispatch(toggleCountdownModal(true));
  }
};

export default headerSlice.reducer;