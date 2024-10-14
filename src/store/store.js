import { configureStore } from '@reduxjs/toolkit';
import countdownModalReducer from '../components/MiniGame/CountdownModal/CountdownSlice';
import errorModalReducer from '../components/MiniGame/ErrorModal/ErrorSlice';
import gameContentModalReducer from '../components/MiniGame/GameContentModal/GameContentSlice';
import headerReducer from '../components/MiniGame/Header/HeaderSlice';

import wheelReducer from '../components/SpinWheel/Wheel/WheelSlice';
import spinResulReducer from '../components/SpinWheel/SpinResult/SpinResultSlice';
import errorSpinReducer from '../components/SpinWheel/ErrorSpin/ErrorSpinSlice';
import prizeReducer from '../components/SpinWheel/Prize/PrizeSlice';

export const store = configureStore({
  reducer: {
    countdownModal: countdownModalReducer,
    errorModal: errorModalReducer,
    gameContentModal: gameContentModalReducer,
    header: headerReducer,

    wheelModal: wheelReducer,
    errorSpin: errorSpinReducer,
    spinResult: spinResulReducer,
    prize: prizeReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['wheelModal/setWheel'],
        ignoredPaths: ['wheelModal.wheel'],
      },
    }),
});

export default store;