const EventEmitter = require("eventemitter3");

import GameState from "./GameState";
import Player from "./Player";
import Rules from "./Rules";

export default class Game extends EventEmitter {
    constructor(rules, player1, player2) {
        super();
        this.state = new GameState(rules);
        this.player1 = player1;
        this.player2 = player2;
        this.playTurn();
        console.log(this);
        window.game = this;
    }

    playTurn() {
        if(this.state.isGameOver()) {
            this.emit("gameOver", this.state.getWinner())
        }
        return this.getCurrentPlayer().getMove(this.state).then((move) => {
            this.state.applyMove(move);
            this.emit("update");
        }).then(this.playTurn.bind(this), this.emitInvalidMoveAndContinue.bind(this));
    }

    emitInvalidMoveAndContinue(message){
        console.error(message);
        this.emit("invalidMove", message);
        this.playTurn();
    }

    getCurrentPlayer() {
        return (this.state.currentTurn % 2 === 0) ? this.player1 : this.player2;
    }

    static defaultLocalSetup(){
        return new Game(new Rules(6, 6), new Player(true), new Player(true));
    }
}