import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import audioManager from '../../../utils/audioManager';
import { toggleSpinResult } from '../SpinResult/SpinResultSlice';

export const fetchWheelData = createAsyncThunk(
  'wheelModal/fetchWheelData',
  async () => {
    const response = await fetch('/data.json');
    const data = await response.json();
    return data.wheelImg;
  }
);

const initialState = {
  // audioTick: new Audio("/music/tick.mp3"),
  audioTick: new Audio("/music/wrong.mp3"),
  numberTurns: 3,
  scoreSpin: 0,
  wheel: null,
  isSpinning: false,
  lastTickAngle: 0,
  winwheelOptions: {
    canvasId: 'wheelCanvas',
    numSegments: 8,
    outerRadius: 194,
    textFontSize: 12,       // Kích thước chữ nhỏ
    textFontFamily: 'Arial', // Phông chữ mảnh
    textFontWeight: 'normal', // Độ mảnh của chữ
    textFillStyle: '#000000',
    rotationAngle: 0,

    // Viền ngoài
    outerBorderColor: '#FFF380',
    outerBorderWidth: 44,
    outerBorderShadowColor: 'rgba(0,0,0,0.5)',
    outerBorderShadowBlur: 5,
    outerBorderShadowOffsetX: 0,
    outerBorderShadowOffsetY: 0,

    // Viền giữa đỏ
    innerBorderColor: 'red',
    innerBorderFillStyle: '#FFD700',
    innerRadius: 30,
    innerBorderWidth: 4,
    innerBorderShadowColor: 'rgba(0,0,0,0.5)',
    innerBorderShadowBlur: 5,
    innerBorderShadowOffsetX: 0,
    innerBorderShadowOffsetY: 0,

    // Tâm
    additionalBorderColor: 'red',
    additionalBorderWidth: 26,
    additionalBorderMargin: -13,
    additionalBorderShadowColor: 'rgba(0,0,0,0.5)',
    additionalBorderShadowBlur: 5,
    additionalBorderShadowOffsetX: 0,
    additionalBorderShadowOffsetY: 0,

    textOrientation: 'curved',
    textMargin: 30,
    buttonText: 'Spin',
    primaryColor: 'black',

    selectedSegment: null,

    drawMode: 'code',
    wheelImage: null,
    imageWidth: 50,
    imageHeight: 50,

    pointer: {
      display: true,
      pointerWidth: 40,
      pointerLength: 40,
      pointerColor: '#FFF380',
      pointerBorderWidth: 0,
      pointerBorderColor: '#FFF380',
      pointerRadius: 10,
      pointerMargin: 46,
      pointerShadow: {
        color: 'rgba(0, 0, 0, 0.5)',
        offsetX: 1,
        offsetY: 5,
        blur: 5
      }
    },

    // Cấu hình cho animation của vòng quay
    animation: {
      type: 'spinToStop',
      duration: 15,
      spins: 8,
      soundTrigger: 'pin',
      callbackFinished: null,
      callbackSound: () => playTickSound(),
    },

    // Cấu hình cho các pin trên vòng quay
    pins: {
      number: 16,
      fillStyle: '#FFF380',
      outerRadius: 8,
      margin: -21,
      strokeStyle: 'red',
    },
    centerCircle: {
      radius: 20,
      fillStyle: '#FFD700',
      strokeStyle: 'red',
      strokeWidth: 3,
      text: '高',
      textFontFamily: 'Arial',
      textFontSize: 30,
      textFillStyle: 'red'
    }
  }
};

// Hàm playTickSound
const playTickSound = () => {
  const audioTick = audioManager.audioTick;
  audioTick.currentTime = 0;
  audioTick.play().catch(error => {
    console.error('Audio play failed:', error);
  });
};



const wheelSlice = createSlice({
  name: 'wheelModal',
  initialState,
  reducers: {
    toggleWheel: (state, action) => {
      state.showWheel = action.payload;
      audioManager.audioBackground.pause();
    },
    setWheel: (state, action) => {
      state.wheel = action.payload;
    },
    startSpin: (state) => {
      state.isSpinning = true;
      state.numberTurns -= 1;
      state.scoreSpin += 1;

    },
    stopSpin: (state) => {
      state.isSpinning = false;
    },
    addScore: (state) => {
      state.scoreSpin += 1;
    },
    decrementScore: (state, action) => {
      state.scoreSpin -= action.payload;
    },
    addNumberTurns: (state) => {
      state.numberTurns += 1;
    },
    resetWheel: (state) => {
      if (state.wheel) {
        if (state.wheel.animation && typeof state.wheel.animation.kill === 'function') {
          state.wheel.stopAnimation(false);
        }
        state.wheel.rotationAngle = 0;
        state.numberTurns = 3;
        state.scoreSpin = 0;
        state.wheel.draw();
      }
      state.isSpinning = false;
    },

    restartSpin: (state) => {
      if (state.wheel) {
        state.wheel.stopAnimation(false);
        state.wheel.rotationAngle = 0;
        state.wheel.draw();
      }
      state.isSpinning = false;
    },
    setCallbackFinished: (state, action) => {
      if (state.wheel) {
        state.winwheelOptions.animation.callbackFinished = action.payload;
      }
    },
    updateLastTickAngle: (state, action) => {
      state.lastTickAngle = action.payload;
    },
    setIsSpinning: (state, action) => {
      state.isSpinning = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchWheelData.fulfilled, (state, action) => {
      state.winwheelOptions.segments = action.payload.map(item => ({
        fillStyle: item.color,
        text: item.title,
        image: `/images/weel/${item.url}`,
        prize: item.prize
      }));
    });
  },
});

export const SpinThunk = () => async (dispatch, getState) => {
  dispatch(addHandleThunk());
  setTimeout(() => {
    dispatch(toggleSpinResult(true));
    audioManager.playSoundGameWin();
  }, 1000);
};

export const addHandleThunk = () => (dispatch, getState) => {
  const { wheel } = getState().wheelModal;
  if (wheel) {
    const indicatedSegment = wheel.getIndicatedSegment();
    if (indicatedSegment.text === "Thêm Lượt") {
      dispatch(addNumberTurns());
    }
    if (indicatedSegment.text === "Lời Chúc") {
      dispatch(addScore());
    }
  }
};

// Xuất các action và reducer của slice
export const {
  setWheel,
  startSpin,
  stopSpin,
  resetWheel,
  setCallbackFinished,
  toggleWheel,
  restartSpin,
  addScore,
  addNumberTurns,
  decrementScore,
  updateLastTickAngle,
  setIsSpinning
} = wheelSlice.actions;
export default wheelSlice.reducer;
