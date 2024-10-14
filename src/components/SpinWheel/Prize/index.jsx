import React from "react";
import "./index.css";
import luckymoney from '../../../assets/img/weel/luckymoney.png';
import { useSelector, useDispatch } from "react-redux";
import { 
  togglePrize,
  moreTurns,
  money
 } from '../Prize/PrizeSlice';

const SpinReult = () => {
  const dispatch = useDispatch();
  const showPrize = useSelector((state) => state.prize.showPrize);  
  const showOption = useSelector((state) => state.prize.showOption);
  const scoreSpinUser = useSelector((state) => state.wheelModal.scoreSpin);


  const okButtonHandler = () => {
    dispatch(togglePrize(false));
  };

  const closeButtonHandler = () => {
    dispatch(togglePrize(false));
  };

  const prizes = [
    { id: 1, image: "/images/weel/weel.png", name: "4 điểm" },
    { id: 2, image: "/images/weel/luckymoney.png", name: "5 điểm" },
  ];

  const getSelect = (scoreSpin) => {
    if(scoreSpinUser < scoreSpin)
        return
    if (scoreSpin === 4) {
        dispatch(moreTurns());
      } else if (scoreSpin === 5) {
        dispatch(money());
      }
  };

  return (
    <div>
    <div className="show-option"
    style={{ display: showOption ? "flex" : "none" }}
    >
        <img src={luckymoney} alt="lì xì"/>
    </div>
    <div
      className="modal-prize"
      style={{ display: showPrize ? "flex" : "none" }}
    >
      <div className="prize-wrapper">
        <div className="prize-header">
          <h1>Phần thưởng</h1>
          <h2>Điểm sở hữu: {scoreSpinUser}</h2>
          <div className="prize-grid">
            {prizes.map((prize) => (
              <div key={prize.id} className="prize-item" onClick={()=>getSelect(parseInt(prize.name.split(' ')[0]))}>
                <img src={prize.image} alt={prize.name} />
                <p className="prize-name">{prize.name}</p>
              </div>
            ))}
          </div>
        </div>
        <button
            className="result-spin-button-close"
            onClick={closeButtonHandler}
          ></button>
        <button
          onClick={okButtonHandler}
          className="primary-button cancel-game-text"
        >
          Ok
        </button>
      </div>
    </div>
    </div>
  );
};
export default SpinReult;
