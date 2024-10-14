import { createSlice } from '@reduxjs/toolkit';
import audioManager from '../../../utils/audioManager';


const gameContentModalInitialState = {
    nameCorrectIndex: null,
    requiredNumberProducts: 0,
    randomNameCorrect: '',
    listProducts: [],
    listCharacters: [],
    levels: [],
    timeStepPercentage: [],
    currentScore: 0,
    currentLevel: 1,
    requiredProductNumber: 0,
    numberCorrect: 0,
    numberCorrectDisplay: 'none',
    initTimeRemainder: 100,
    score: 0,
    timerInterval: null, // Hợp nhất timerInterval và intervalId
    showGameContent: false,
    showErrorModal: false,
    showResultGameModal: false,
    gameTime: {
        timeRemainder: 100,
        timerRangeWidth: '100%',
        timeStep: 10,
    },
    gameSound: {
        maxVolume: 1,
        audioRatio: 1,
    },
};

const gameContentModalSlice = createSlice({
    name: 'gameContentModal',
    initialState: gameContentModalInitialState,
    reducers: {
        updateProducts(state, action) {
            state.listProducts = action.payload;
        },
        updateCharacters(state, action) {
            state.listCharacters = action.payload;
        },
        updateLevels(state, action) {
            state.levels = action.payload;
        },
        updateTimeStepPercentage(state, action) {
            state.timeStepPercentage = action.payload;
        },
        showRandomNameCorrect(state) {
            const maxRequiredProducts = 5;
            let randomIndex;
            if (state.nameCorrectIndex !== undefined) {
                do {
                    randomIndex = Math.floor(Math.random() * state.listProducts.length);
                } while (randomIndex === state.nameCorrectIndex);
            } else {
                randomIndex = Math.floor(Math.random() * state.listProducts.length);
            }
            state.nameCorrectIndex = randomIndex;
            state.requiredNumberProducts = Math.floor(Math.random() * maxRequiredProducts) + 1;
            state.randomNameCorrect = state.listProducts[randomIndex]?.title || state.listProducts[0]?.title || '';
        },
        incrementScore(state) {
            state.currentScore += 1;
        },
        updateGameLevel(state) {
            state.currentLevel = Math.floor(state.currentScore / 3) + 1;
            const levelData = state.levels.find(level => level.level === state.currentLevel);
            if (levelData) {
                state.timeStepDenominator = levelData.timeStepPercentage;
                state.gameTime.timeStep = state.initTimeRemainder / (100 / state.timeStepDenominator);
            }
            if (state.currentLevel > state.previousLevel) {
                const newPlaybackRate = state.gameSound.audioRatio + 0.1;
                state.gameSound.audioRatio = newPlaybackRate;
                audioManager.setBackgroundPlaybackRate(newPlaybackRate);
            }
            state.previousLevel = state.currentLevel;
        },
        setRandomProductNumber(state, action) {
            state.requiredProductNumber = action.payload;
        },
        setGameData(state, action) {
            state.listProducts = action.payload.products;
            state.listCharacters = action.payload.characters;
            state.levels = action.payload.levels;
        },
        playBackgroundSound(state) {
            audioManager.playBackgroundSound();
        },
        playSoundGameOver(state) {
            audioManager.playSoundGameOver();
        },
        resetGame() {
            return gameContentModalInitialState;
        },
        toggleGameContent(state, action) {
            state.showGameContent = action.payload;
            audioManager.playBackgroundSound();
        },
        setTimerInterval(state, action) {
            state.timerInterval = action.payload;
        },
        showCountdownTime(state) {
            state.gameTime.timeRemainder -= state.gameTime.timeStep;
            if (state.gameTime.timeRemainder <= 0) {
                clearInterval(state.timerInterval);
                state.timerInterval = null;
                state.gameTime.timeRemainder = 0;
            }
            state.gameTime.timerRangeWidth = Math.min(state.gameTime.timeRemainder / state.gameTime.timeStep * 100, 100) + '%';
        },
        resetCountdownTime(state) {
            state.gameTime.timeRemainder = state.initTimeRemainder;
            state.gameTime.timerRangeWidth = '100%';
        },
        clearGameInterval(state) {
            clearInterval(state.timerInterval);
            state.timerInterval = null;
        },
        showResultGame(state) {
            state.showResultGameModal = true;
            state.finalScore = state.currentScore;
        },
        hideResultGame(state) {
            state.showResultGameModal = false;
        },
    },
});

export const resetAnswerAndShowRandom = () => (dispatch) => {
    dispatch(resetCountdownTime());
    dispatch(showRandomNameCorrect());
};

export const trueCorrect = () => (dispatch) => {
    dispatch(incrementScore());
    dispatch(updateGameLevel());
};

export const {
    updateProducts,
    updateCharacters,
    updateLevels,
    updateTimeStepPercentage,
    showRandomNameCorrect,
    incrementScore,
    updateGameLevel,
    setRandomProductNumber,
    setGameData,
    playBackgroundSound,
    playSoundGameOver,
    resetGame,
    toggleGameContent,
    setTimerInterval,
    showCountdownTime,
    resetCountdownTime,
    clearGameInterval,
    showResultGame,
    hideResultGame
} = gameContentModalSlice.actions;

export default gameContentModalSlice.reducer;
