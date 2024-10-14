import React from "react";
import bgStart from "../../../assets/img/general/bg-start.png";
import "./index.css";
import { useSelector, useDispatch } from "react-redux";
import { toggleSpinResult } from "./SpinResultSlice";
import {  restartSpin } from '../Wheel/WheelSlice';

const SpinReult = () => {
  const dispatch = useDispatch();

  const showSpinResult = useSelector(
    (state) => state.spinResult.showSpinResult
  );
  const indicatedSegment = useSelector(
    (state) => state.spinResult.indicatedSegment
  );

  const closeButtonHandler = () => {
    dispatch(toggleSpinResult(false));
  };

  const okButtonHandler = () => {
    dispatch(toggleSpinResult(false));
    dispatch(restartSpin());
  };

  return (
    <div
      className="modal-result-spin"
      style={{ display: showSpinResult ? "flex" : "none" }}
    >
      <div className="result-spin-wrapper">
        <div className="result-spin-header">
          <img src={bgStart} alt="Game result" />
          <button
            className="result-spin-button-close"
            onClick={closeButtonHandler}
          ></button>
          <div className="prize-text">
          <h2>Chúc mừng bạn quay trúng: {indicatedSegment ? indicatedSegment.text : "0"}</h2>
        </div>
        </div>

        {indicatedSegment && indicatedSegment.prize && (
          <>
            {indicatedSegment.prize.endsWith(".png") ? (
              <img
                className="prize"
                src={`/images/weel/${indicatedSegment.prize}`}
                alt="Prize"
              />
            ) : (
              <p className="prize-text">{indicatedSegment.prize}</p>
            )}
          </>
        )}

        {indicatedSegment && indicatedSegment.image && (
          <img
            className="prize-image"
            src={indicatedSegment.image}
            alt="Prize"
          />
        )}
        <button
          onClick={okButtonHandler}
          className="primary-button cancel-game-text"
        >
          Ok
        </button>
      </div>
    </div>
  );
};
export default SpinReult;
