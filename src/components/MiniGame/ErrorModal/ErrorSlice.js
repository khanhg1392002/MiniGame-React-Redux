import { createSlice } from '@reduxjs/toolkit';
import audioManager from '../../../utils/audioManager';
import { showResultGame } from '../GameContentModal/GameContentSlice';

const errorModalInitialState = {
    showErrorModal: false,
};

const errorModalSlice = createSlice({
    name: 'errorModal',
    initialState: errorModalInitialState,
    reducers: {
        showGameOver(state) {
            state.showErrorModal = true;
            audioManager.getAudioBackground().pause();
            audioManager.getAudioFail().play();
        },
        hideErrorModal(state) {
            state.showErrorModal = false;
        },
    },
});

export const showErrorAndResult = () => (dispatch) => {
    dispatch(hideErrorModal());
    dispatch(showResultGame(true));
};

export const { showGameOver, hideErrorModal } = errorModalSlice.actions;

export default errorModalSlice.reducer;
