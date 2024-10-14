import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { spinWheel, startGame } from './HeaderSlice';
import './Index.css';
import takashimayaLogo from '../../../assets/img/general/logo.png';
import { togglePrize } from '../../SpinWheel/Prize/PrizeSlice';

const Header = () => {
  const dispatch = useDispatch();
  const showWheel = useSelector((state) => state.wheelModal.showWheel);
  const numberTurns = useSelector((state) => state.wheelModal.numberTurns);

  const reload = () => {
    window.location.reload();
  };

  const handlePrize = () => {
    if (showWheel && numberTurns === 0) {
    dispatch(togglePrize(true));
    }
  };

  const handleSpinWheel = () => {
    dispatch(spinWheel());
  };

  const handleStartGame = () => {
    dispatch(startGame());
  };
  
  return (
    <header className="header-site">
      <nav className="navbar">
        <div className="container header-item-list">
          <a href="#home-page" className="takashimaya-header-logo">
            <img src={takashimayaLogo} alt="Takashimaya-logo" onClick={reload}/>
          </a>
          <ul className="nav" id="header-navbar">
            <li className="nav-item">
              <a className="nav-link" onClick={handleStartGame} href="#play-page">Play game</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" onClick={handleSpinWheel} href="#spin-page">Spin</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" onClick={handlePrize} href="#prize-page">Prize</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#rank-page">Rank</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#setting-page">Setting</a>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
}
export default Header;


