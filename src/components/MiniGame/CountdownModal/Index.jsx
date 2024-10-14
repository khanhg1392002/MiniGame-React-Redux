import React, { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {  setIntervalId, startCountdown } from './CountdownSlice';
import './Index.css'

const CountdownModal = () => {
  const dispatch = useDispatch();
  const countdownTime = useSelector((state) => state.countdownModal.countdownTime);
  const showCountdownModal = useSelector((state) => state.countdownModal.showCountdownModal);
  const intervalIdRef = useRef(null);

  useEffect(() => {
    if (showCountdownModal) {
      dispatch(startCountdown());
    }
  }, [showCountdownModal, dispatch]);

  useEffect(() => {
    // Cập nhật biến tạm để giữ giá trị của intervalIdRef.current
    const intervalId = intervalIdRef.current;

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
        dispatch(setIntervalId(null));
      }
    };
  }, [dispatch]);

  if (!showCountdownModal) return null;

  return (
    <div className="modal-count-down">
      <span>Count Down Game</span>
      <h1 className="count-down-text">{countdownTime}</h1>
    </div>
  );
};

export default CountdownModal;
