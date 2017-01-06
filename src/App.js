import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import GameView from "./components/Game";
import Game from "./logic/Game";

const g = Game.defaultLocalSetup();

class App extends Component {
  render() {
    return (
      <div className="App">
          <GameView game={g} />
      </div>
    );
  }
}

export default App;
