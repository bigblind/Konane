const EventEmitter = require("eventemitter3");

const GameState = require("./GameState");

export default class Game extends EventEmitter {
    constructor(rules, player1, player2) {
        super();
        this.state = new GameState(rules);
        this.player1 = player1;
        this.player2 = player2;
        this.playTurn();
    }

    playTurn() {
        if(this.state.isGameOver()) {
            this.emit("gameOver", this.state.getWinner())
        }
        return this.getCurrentPlayer().getMove().then((move) => {
            this.state.applyMove(move);
        }).then(this.playTurn, this.emitInvalidMoveAndContinue);
    }

    emitInvalidMoveAndContinue(message){
        this.emit("invalidMove", message);
        this.playTurn();
    }
}