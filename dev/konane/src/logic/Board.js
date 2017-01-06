import {inRange} from "../utils"

// Data structure that stores the board state.
class Board{
    constructor(){
        this._board = []
    }

    push(row) {
        this._board.push(row);
    }

    getPieceAt(row, col) {
        // getPieceAt returns the piece on the board at the given row and column. If only one
        // argument is given, we assume it's an array of [row, col]

        if (col === undefined) {
            try {
                [row, col] = row;
            } catch(e) {
                throw new Error(row + " is not a valid co-ordinate pair.")
            }
        }

        return {
            type: this._board[row][col],
            position: [row, col]
        };
    }

    get width() {
        return this._board[0].length;
    }

    get height() {
        return this._board.length;
    }

    get pieces() {
        return this._getPieces();
    }

    * _getPieces() {
        for(var i=0; i<this.height; i++) {
            for(var j=0; j<this.width; j++) {
                if(this._board[i][j] !== -1){
                    yield this.getPieceAt(i, j)
                }
            }
        }
    }

    getPiecesForPlayer(player){
        return [...this.pieces].filter((p) => p.type === player);
    }

    * getPiecesInLineFrom(position, direction) {
        var i = 0;
        var [row, col] = position
        while(true) {
            i += 1;  
            if(!(
                inRange(row + direction[0] * i, 0, this.height - 1) &&
                inRange(col + direction[1] * i, 0, this.width - 1)
            )) {
                break;
            }
            yield this.getPieceAt(row + direction[0] * i, col + direction[1] * i);
        }
    }

    removePiece(location) {
        // Remove the piece at the given location
        console.log("removing piece at: " + location)
        this._board[location[0]][location[1]] = -1;
    }

    movePiece(from, to) {
        // Move th"e piece at 'from' to 'to'."
        this._board[to[0]][to[1]] = this.getPieceAt(from).type;
        this.removePiece(from);
    }
}

export default Board;