import { configureStore, createSlice } from '@reduxjs/toolkit';

// Tạo slice cho app state
const appSlice = createSlice({
  name: 'app',
  initialState: {
    inputText: '',
    previewText: '',
    font: 'Arial, sans-serif',
    changefont: 'Arial, sans-serif',
    showBefore: false,
    showAfter: false,
    decoration: '',
    multipleLine: true,
    history: []
  },
  reducers: {
    setInputText: (state, action) => {
      state.inputText = action.payload;
    },
    setPreviewText: (state, action) => {
      state.previewText = action.payload;
    },
    setFont: (state, action) => {
      state.font = action.payload;
    },
    setChangeFont: (state, action) => {
      state.font = action.payload;
    },
    setShowBefore: (state, action) => {
      state.showBefore = action.payload;
    },
    setShowAfter: (state, action) => {
      state.showAfter = action.payload;
    },
    setDecoration: (state, action) => {
      state.decoration = action.payload;
    },
    setMultipleLine: (state, action) => {
      state.multipleLine = action.payload;
    },
    addHistory: (state, action) => {
      state.history.push({ text: action.payload, font: state.font }); // Thêm font vào lịch sử
    },
    clearHistory: (state) => {
      state.history = [];
    },
    setHistory: (state, action) => {
      state.history = action.payload;
    },
    setStoredTexts: (state, action) => {
      const { inputText, previewText } = action.payload;
      state.inputText = inputText;
      state.previewText = previewText;
    }
  }
});

export const {
  setInputText, setPreviewText, setFont,setChangeFont, setShowBefore, setShowAfter,
  setDecoration, setMultipleLine, addHistory, clearHistory, setHistory, setStoredTexts
} = appSlice.actions;

export const store = configureStore({
  reducer: {
    app: appSlice.reducer
  }
});
