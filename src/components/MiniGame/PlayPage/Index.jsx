// import React from 'react';
import React from 'react';
import './Index.css';
import GamecontentModal from '../GameContentModal/Index';
import ResultGameModal from '../ResultGameModal/Index';
import CountdownModal from '../CountdownModal/Index';
import Wheel from '../../SpinWheel/Wheel/index';
import SpinResult from '../../SpinWheel/SpinResult/index';
import ErrorSpin from '../../SpinWheel/ErrorSpin/index';
import Prize from '../../SpinWheel/Prize/index';
import bgPageContent from '../../../assets/img/general/bg-page-content.png';

function PlayPage() {

  return (
    <div className="main-bottom-site">
      <div className="play-page-main-bottom-site">
        <div className="container main-bottom-content-row">
          <h2 className="playgame-text">Chơi Game</h2>
          <div className="play-page-content" id="play-page" style={{
            height: '100%',
            minHeight: '82vh',
            overflow: 'hidden',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            backgroundImage: `url(${bgPageContent})`, 
            borderRadius: '20px'
          }}>
            <audio className="audio-background"></audio>
            <audio className="audio-fail"></audio>
            <ResultGameModal />
            <CountdownModal />
            <GamecontentModal />
            <Wheel />
            <SpinResult />
            <ErrorSpin />
            <Prize />
          </div>
        </div>
      </div>
    </div>
  );
}

export default PlayPage;
