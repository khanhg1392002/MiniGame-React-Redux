import React, { useEffect } from 'react';
import bgStart from '../../../assets/img/general/bg-start.png';
import './Index.css';
import { useSelector, useDispatch } from 'react-redux';
import { toggleCountdownModal } from '../CountdownModal/CountdownSlice';

const ResultGameModal = () => {
    const dispatch = useDispatch();

    const showResultGameModal = useSelector(state => state.gameContentModal.showResultGameModal);
    const finalScore = useSelector(state => state.gameContentModal.finalScore);

    // Result Game
    useEffect(() => {
        if (showResultGameModal) {

            document.querySelector('.modal-result-game').style.display = 'flex';
            document.querySelector('.final-score-text').innerText = finalScore;

            document.querySelector('.restart-game-text').addEventListener('click', () => {
                document.querySelector('.modal-result-game').style.display = 'none';
                dispatch(toggleCountdownModal(true));
            });

            document.querySelector('.result-game-button-close').addEventListener('click', () => {
                document.querySelector('.modal-result-game').style.display = 'none';
                document.querySelector('.modal-result-game').style.display = 'none';
                const productCardLists = document.querySelectorAll('.product-card-list');
                const characterCardLists = document.querySelectorAll('.character-card-list');
                productCardLists.forEach(card => {
                    card.style.pointerEvents = 'none';
                    card.style.opacity = '0.5'; // làm mờ
                });
                characterCardLists.forEach(card => {
                    card.style.pointerEvents = 'none';
                    card.style.opacity = '0.5'; // làm mờ
                });
            });

            document.querySelector('.cancel-game-text').addEventListener('click', () => {
                document.querySelector('.modal-result-game').style.display = 'none';
                const productCardLists = document.querySelectorAll('.product-card-list');
                const characterCardLists = document.querySelectorAll('.character-card-list');
                productCardLists.forEach(card => {
                    card.style.pointerEvents = 'none';
                    card.style.opacity = '0.5'; // làm mờ
                });
                characterCardLists.forEach(card => {
                    card.style.pointerEvents = 'none';
                    card.style.opacity = '0.5'; // làm mờ
                });
            });
        }
    }, [showResultGameModal, finalScore, dispatch]);


    return (
        <div className="modal-result-game">
            <div className="result-game-wrapper">
                <div className="result-game-header">
                    <img src={bgStart} alt="Game result" />
                    <button className="result-game-button-close"></button>
                    <h2 id="your-own-score">Your Own Score</h2>
                </div>
                <h1 className="final-score-text">0</h1>
                <div className="choices-group">
                    <button className="primary-button cancel-game-text">Cancel game</button>
                    <button className="primary-button restart-game-text">Restart game</button>
                </div>
                <div className="register-toggle-label">
                    <p>Register</p>
                </div>
            </div>
        </div>
    );
}
export default ResultGameModal;