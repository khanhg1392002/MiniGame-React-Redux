import React, { useEffect, useState, useCallback } from 'react';
import './Index.css';
import coin from '../../../assets/img/play-page/coin.png';
import { useSelector, useDispatch } from 'react-redux';
import { fetchData } from '../../../utils/api';
import { showGameOver } from '../ErrorModal/ErrorSlice';
import {
  setGameData,
  showRandomNameCorrect,
  setTimerInterval,
  resetAnswerAndShowRandom,
  showCountdownTime,
  trueCorrect
} from './GameContentSlice';

const GameContent = () => {
  const dispatch = useDispatch();

  const timeRemainder = useSelector(state => state.gameContentModal.gameTime.timeRemainder);
  const numberCorrectDisplay = useSelector(state => state.gameContentModal.numberCorrectDisplay);
  const showGameContent = useSelector((state) => state.gameContentModal.showGameContent);
  const nameCorrectIndex = useSelector((state) => state.gameContentModal.nameCorrectIndex);
  const randomNameCorrect = useSelector((state) => state.gameContentModal.randomNameCorrect);
  const requiredNumberProducts = useSelector((state) => state.gameContentModal.requiredNumberProducts);
  const audioRatio = useSelector((state) => state.gameContentModal.gameSound.audioRatio);
  const score = useSelector((state) => state.gameContentModal.currentScore);
  const gameLevel = useSelector((state) => state.gameContentModal.currentLevel);
  const gameTime = useSelector((state) => state.gameContentModal.gameTime);
  const [characters, setCharacters] = useState([]);
  const [products, setProducts] = useState([]);
  const [dataLoaded, setDataLoaded] = useState(false);

  const shuffleCharacterCards = useCallback(() => {
    const cardList = document.querySelector('.character-card-list');
    const cards = Array.from(cardList.children);
    for (let i = cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      cardList.appendChild(cards[j]);
    }
    if (cardList) {
      cardList.scrollIntoView({
        behavior: "smooth",
        inline: "center",
      });
    }
  }, []);

  const resetAnswer = useCallback(() => {
    document.querySelectorAll('.number-correct span:last-child').forEach(span => {
      span.innerText = '0';
    });
    document.querySelectorAll('.name-correct-desc').forEach(desc => {
      desc.innerText = '';
    });
    document.querySelectorAll('.number-correct').forEach(correct => {
      correct.style.display = 'none';
    });
    if (gameTime.timerInterval) {
      clearInterval(gameTime.timerInterval);
    }
    dispatch(resetAnswerAndShowRandom());
    shuffleCharacterCards();
  }, [dispatch, gameTime.timerInterval, shuffleCharacterCards]);

  const handleCorrectAnswer = useCallback((productCard) => {
    const numberCorrectElement = productCard.querySelector('.number-correct span:last-child');
    const newValue = Number(numberCorrectElement.innerText) + 1;
    const click = document.querySelector('.name-correct-number').innerText.toLowerCase();
    numberCorrectElement.innerText = newValue;
    productCard.querySelector('.number-correct').style.display = "flex";
    const clickNumber = parseInt(click, 10);

    if (newValue > clickNumber) {
      setTimeout(() => {
        dispatch(showGameOver());
      }, 300);
      console.log('Bạn đã chọn quá số lượng!');
    } else if (newValue === clickNumber) {
      setTimeout(() => {
        dispatch(trueCorrect());
        resetAnswer();
      }, 300);
      console.log('Bạn đã chọn đúng');
    }
  }, [dispatch, resetAnswer]);

  const handleIncorrectAnswer = useCallback(() => {
    dispatch(showGameOver());
    console.log('Bạn đã chọn sai!');
  }, [dispatch]);

  useEffect(() => {
    if (showGameContent) {
      dispatch(showCountdownTime());
      const timerInterval = setInterval(() => {
        dispatch(showCountdownTime());
      }, 1000);

      dispatch(setTimerInterval(timerInterval));
      return () => {
        clearInterval(timerInterval);
        // dispatch(setTimerInterval(null));
        // dispatch(clearGameInterval());
      };
    }
  }, [showGameContent, dispatch]);

  useEffect(() => {
    if (showGameContent) {
      fetchData(process.env.PUBLIC_URL + '/data.json')
        .then((data) => {
          const processedData = {
            products: data.products.map(product => ({
              ...product,
              url: data.productsAssetsPath + product.url,
            })),
            characters: data.characters.map(character => ({
              ...character,
              url: data.charactersAssetsPath + character.url,
              activeUrl: data.charactersAssetsPath + character.activeUrl,
            })),
            levels: data.levels || [],
          };

          if (processedData.products.length > 0) {
            dispatch(setGameData(processedData));
            setCharacters(processedData.characters);
            setProducts(processedData.products);
            setDataLoaded(true);
            dispatch(showRandomNameCorrect());
          } else {
            console.error('Products data is empty');
          }
        })
        .catch((error) => {
          console.error('Error fetching data:', error);
        });
    }
  }, [showGameContent, dispatch]);

  useEffect(() => {
    if (dataLoaded) {
      console.log('Random Name Correct:', randomNameCorrect);
      console.log('Required Number Products:', requiredNumberProducts);
      console.log('audioRatio', audioRatio);

    }
  }, [dataLoaded, products, randomNameCorrect, requiredNumberProducts, audioRatio]);

  useEffect(() => {
    const getAnswer = () => {
      document.querySelectorAll('.product-card').forEach(card => {
        card.addEventListener('click', (event) => {
          const productCard = event.currentTarget;
          const requireProduct = cleanString(document.querySelector('.name-correct-desc').innerText.toLowerCase());
          const productTitle = cleanString(productCard.querySelector('.product-card-name').innerText.toLowerCase());
          if (productTitle === requireProduct) {
            handleCorrectAnswer(productCard);
          } else {
            setTimeout(() => {
              handleIncorrectAnswer();
            }, 300);
          }
        });
      });
    };

    const cleanString = (str) => {
      return str.replace(/[^a-z0-9]/gi, '').trim();
    };

    if (products.length > 0) {
      getAnswer();
    }
  }, [products, handleCorrectAnswer, handleIncorrectAnswer]);

  useEffect(() => {
    if (timeRemainder <= 0) {
      dispatch(showGameOver());
    }
  }, [timeRemainder, dispatch]);

  if (!showGameContent) return null;

  return (
    <div className="game-content-modal">
      <div className="game-content" style={{ display: showGameContent ? 'flex' : 'none' }}>
        <div className="play-top-site row">
          <div className="play-top-site-left col-xl-6 col-lg-6 col-sm-6">
            <div className="timer-site">
              <div className="timer-range" style={{ width: gameTime.timeRemainder + '%' }}></div>
              <div className="level-site">
                Level: <span id="level">{gameLevel}</span>
              </div>
            </div>
          </div>
          <div className="play-top-site-right col-xl-6 col-lg-6">
            <div className="score-site">
              <img className="crown-img" src={coin} alt="coin" />
              <div className="current-score">{score}</div>
            </div>
          </div>
        </div>

        <div className="row product-card-list" style={{ marginLeft: '0', marginRight: '0' }}>
          {products.map((product, index) => (
            <div key={index} className="col-xl-3 col-lg-3 col-md-6 col-sm-6 col-xs-6 product-list-content">
              <div className="product-card">
                <img src={`${process.env.PUBLIC_URL}${product.url}`} alt={product.title} className="product-card-img" />
                <div className="number-correct" style={{ display: numberCorrectDisplay }}>
                  <span>x</span>
                  <span>0</span>
                </div>
                <span className="product-card-name">{product.title}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="row character-card-list" style={{ marginLeft: '0', marginRight: '0' }}>
          {characters.map((character, index) => (
            <div key={index} className="col-xl-3 col-lg-3 col-md-4 col-sm-6 col-xs-6 character-list-content">
              <img
                src={character.url}
                alt={`character-${index + 1}-card`}
                className={`character-card character-${index + 1}-card`}
                style={{ display: index === nameCorrectIndex ? 'none' : 'block' }}
              />
              <img
                src={character.activeUrl}
                alt={`character-${index + 1}-card-active`}
                className={`character-card character-${index + 1}-card-active`}
                style={{ display: index === nameCorrectIndex ? 'block' : 'none' }}
              />
              {index === nameCorrectIndex && (
                <div className="name-correct">
                  <span className="name-correct-number" style={{ marginRight: '5px' }}>{requiredNumberProducts}</span>
                  <span className="name-correct-desc">{randomNameCorrect}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GameContent;
