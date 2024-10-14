import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import coin from "../../../assets/img/play-page/coin.png";
import ExtendedWinwheel from "../../../utils/ExtendedWinwheel";
import { gsap } from "gsap";
import "./index.css";
import { 
  fetchWheelData,  
  SpinThunk,
  setWheel,
  startSpin
} from "./WheelSlice";
import {setIndicatedSegment} from '../SpinResult/SpinResultSlice';
import {toggleErrorSpin} from '../ErrorSpin/ErrorSpinSlice';

window.TweenMax = gsap;

const Wheel = () => {
  const dispatch = useDispatch();
  // const wheel = useSelector((state) => state.wheelModal.wheel);
  const numberTurns = useSelector((state) => state.wheelModal.numberTurns);
  const scoreSpin = useSelector((state) => state.wheelModal.scoreSpin);
  const isSpinning = useSelector((state) => state.wheelModal.isSpinning);
  const winwheelOptions = useSelector(
    (state) => state.wheelModal.winwheelOptions
  );
  const showWheel = useSelector((state) => state.wheelModal.showWheel);
  const wheelRef = useRef(null);


  useEffect(() => {
    const newWheel = new ExtendedWinwheel({
      ...winwheelOptions,
      animation: {
        ...winwheelOptions.animation,
        callbackFinished: function() {
          const indicatedSegment = this.getIndicatedSegment();
          dispatch(setIndicatedSegment(indicatedSegment));
          dispatch(SpinThunk());
        },
      },
    });

    wheelRef.current = newWheel;
    dispatch(setWheel(newWheel));

    return () => {
      if (newWheel) {
        newWheel.draw();
      }
    };
  }, [dispatch, winwheelOptions]);

  useEffect(() => {
    dispatch(fetchWheelData());
  }, [dispatch]);

  
  const startSpinHandler = () => {
    if (wheelRef.current && !isSpinning && numberTurns > 0) {
      wheelRef.current.startAnimation();
      dispatch(startSpin());
    } else {
      dispatch(toggleErrorSpin(true));
    }
  };

  return (
    <div
      className="game-content"
      style={{ display: showWheel ? "flex" : "none" }}
    >
      <div className="play-top-site row">
        <div className="play-top-site-left col-xl-6 col-lg-6 col-sm-6">
          <div className="score-site2">
            <img className="crown-img" src={coin} alt="coin" />
            <div className="current-score">{numberTurns}</div>
          </div>
        </div>
        <div className="play-top-site-right col-xl-6 col-lg-6">
          <div className="score-site">
            <img className="crown-img" src={coin} alt="coin" />
            <div className="current-score">{scoreSpin}</div>
          </div>
        </div>
      </div>
      <div className="center-container">
        <div style={{ textAlign: "center" }}>
          <canvas id="wheelCanvas" width="442" height="442"></canvas>
          <div>
            <button
              className="primary-button2"
              onClick={startSpinHandler}
              disabled={isSpinning}
            >
              Quay ngay
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Wheel;
