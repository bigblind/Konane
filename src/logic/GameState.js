export default class GameState {
    constructor(rules){
        this.rules = rules;
        this.board = rules.board;
        this.currentTurn = 0;
    }

    

    getValidMoves() {
        console.log("getting valid moves in round " + this.currentTurn);
        return this.rules.getValidMoves(this.currentTurn);
    }

    isGameOver() {
        return this.getValidMoves().length === 0;
    }

    applyMove(move) {
        console.log("ApplyMove called");
        console.log(move);
        this.applyMoveToBoard(move, this.board);
        this.currentTurn += 1;
    }

    applyMoveToBoard(move, board) {
        switch(move.type) {
            case "remove":
                board.removePiece(move.from);
                break;
            case "move":
                board.movePiece(move.from, move.to);
                move.captured.forEach((piece) => board.removePiece(piece.position));
                break;
            default:
                throw new Error("Unknown move type: " + move.type);
        }
    }

    getPhase() {
        if(this.currentTurn < 2) {
            return "remove";
        } else {
            return "move";
        }
    }
}