import React, { Suspense, lazy } from 'react';
import './styles/App.css';

// Lazy load các component
const Header = lazy(() => import('./components/MiniGame/Header/Index'));
const PlayPage = lazy(() => import('./components/MiniGame/PlayPage/Index'));
const ErrorModal = lazy(() => import('./components/MiniGame/ErrorModal/Index'));
const Toolbar = lazy(() => import('./components/MiniGame/Toolbar/Index'));


const Game = () => {
  return (
    <div className="wrapper">
      <Suspense fallback={<div>Loading...</div>}>
        <Header />
        <PlayPage />
        <ErrorModal />
        <Toolbar /> 
      </Suspense>
    </div>
  );
}

export default Game;
