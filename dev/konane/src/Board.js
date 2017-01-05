import {inRange} from "./utils"

// Data structure that stores the board state.
export default class Board extends Array {
    getPieceAt(row, col) {
        // getPieceAt returns the piece on the board at the given row and column. If only one
        // argument is given, we assume it's an array of [row, col]

        if (col === undefined) {
            [row, col] = row;
        }

        return {
            type: this[row][col],
            position: [row, col]
        };
    }

    get width() {
        return self[0].length;
    }

    get height() {
        return self.length;
    }

    get pieces() {
        return _getPieces();
    }

    * _getPieces() {
        for(var i=0; i<this.height; i++) {
            for(var j=0; j<this.width; j++) {
                if(this[i][j] !== -1){
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
                inRange(col + direction[1] * i 0, this.width - 1)
            )) {
                break;
            }
            yield this.getPieceAt(row + direction[0] * i, col + direction[1] * i);
        }
    }

    removePiece(location) {
        // Remove the piece at the given location
        this[location[0]][location[1]] = -1;
    }

    movePiece(from, to) {
        // Move th"e piece at 'from' to 'to'."
        this[to[0]][to[1]] = this.getPieceAt(from)
        this.removePiece(from);
    }
}