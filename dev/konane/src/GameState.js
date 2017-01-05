export default class GameState {
    constructor(rules){
        this.rules = rules;
        this.board = rules.board;
        this.currentTurn = 0;
    }

    

    getValidMoves() {
        return this.rules.getValidMoves(this.currentTurn);
    }

    applyMove(move) {
        this.applyMoveToBoard(move, this.board);
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
}