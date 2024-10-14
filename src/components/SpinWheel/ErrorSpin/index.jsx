import React from "react";
import "./index.css";
import { useSelector, useDispatch } from "react-redux";
import { toggleErrorSpin } from './ErrorSpinSlice';
import error from '../../../assets/img/weel/Error.png';

const SpinReult = () => {
  const dispatch = useDispatch();

  const showErrorSpin = useSelector(
    (state) => state.errorSpin.showErrorSpin
  );


  const okButtonHandler = () => {
    dispatch(toggleErrorSpin(false));
  };

  return (
    <div
      className="modal-error-spin"
      style={{ display: showErrorSpin ? "flex" : "none" }}
    >
      <div className="error-spin-wrapper">
        <div className="error-spin-header">
        <img src={error} alt="Game result" />
          <h2>Bạn đã hết lượt quay, hãy quay lại vào lần sau!</h2>
        </div>
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
