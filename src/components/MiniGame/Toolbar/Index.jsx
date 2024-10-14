import React from "react";
import { useSelector } from 'react-redux';
import './Index.css';
import btnMute from '../../../assets/img/toolbar/btn-mute.png';
import btnMusic from '../../../assets/img/toolbar/btn-mucsic.png';
import btnPlay from '../../../assets/img/toolbar/btn-play.png';
import audioManager from '../../../utils/audioManager';

function Toolbar() {
    const showGameContent = useSelector((state) => state.gameContentModal.showGameContent);
  
    const stopSoundsHandler = () => {
        if (!showGameContent) {
            audioManager.audioBgWheel.pause();
        } else {
            audioManager.audioBackground.pause();
        }
    };
    
    const playSoundsHandler = () => {
        if (!showGameContent) {
            audioManager.audioBgWheel.play();
        } else {
            audioManager.audioBackground.play();
        }
    };

    return (
        <div className="button-container">
            <button onClick={stopSoundsHandler} className="icon-button">
                <img src={btnMute} alt="Mute Button" />
            </button>
            <button onClick={playSoundsHandler} className="icon-button">
                <img src={btnMusic} alt="Music Button" />
            </button>
            <button className="icon-button">
                <img src={btnPlay} alt="Play Button" />
            </button>
        </div>
    );
}

export default Toolbar;