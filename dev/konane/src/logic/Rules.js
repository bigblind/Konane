import Board from "./Board";
import {flatmap} from "../utils";

export default class {
    constructor(width, height) {
        this._board = null;
        this.width = width;
        this.height = height;
    }

    // Accessor for the board, creates it if it doesn't exist.
    get board() {
        if(this._board === null){
            this._board = this._getInitialBoard(this.width, this.height);
        }
        return this._board;
    }

    _getInitialBoard(width, height){
        var board = new Board();
        
        for(var i=0; i<height; i++) {
            var row = [];
            // p0 will be the first piece in the row, p1 the second, and they'll alternate.
            var [p0, p1] = (i % 2 === 0) ? [0, 1] : [1, 0];

            for (var j=0; j < width; j++){
                row.push(j % 2 === 0 ? p0 : p1);
            }

            board.push(row)
        }

        return board
    }

    getDirections() {
        return [
            [-1, 0], // up
            [1,  0], // down
            [0, -1], // left
            [0,  1], // down
        ]
    }

    getValidMoves(turn) {
        // Returns valid moves for the current plaayer.

        // In the first turn, black must remove a stone
        if(turn === 0) {
            return this.getBlackPieceRemovalMoves();
        }

        // In the second turn, white must remove a stone
        if(turn === 1) {
            return this.getWhitePieceRemovalMoves();
        }

        // All other moves must be jumps.
        return this.getValidMovesForPlayer(turn % 2);
    }

    getBlackPieceRemovalMoves(){
        // Returns an Array of moves representing stones the black player can take away in his first turn.
        var [w, h] = [this.board.width, this.board.height]
        return [[0, 0], [w-1, h-1], [w/2 - 1, h/2 - 1], [w/2, h/2]].map((pos) => {
            return {
                "type": "remove",
                "from": pos
            }
        });
    }

    getWhitePieceRemovalMoves() {
        // Returns an Array of moves representing stones the white player can take away in his first turn

        // Get the position of the stone black has removed
        var blackRemoved = this.getBlackPieceRemovalMoves();
        console.log(blackRemoved);
        blackRemoved = blackRemoved.filter((move) => {
            return this.board.getPieceAt(move.from).type === -1;
        });

        // Just a sanity check, this method shouldn't be called if black hasn't removed
        // a stone yet. Also
        if (blackRemoved.length == 0){
            throw Error("Black hasn't removed a piece yet.");
        }

        var blackpos = blackRemoved[0].from;
        var positions = []; // the positions white could remove

        // If the piece black removed is not next to the top edge, white can remove the piece above.
        if (blackpos[0] > 0) {
            positions.push([blackpos[0] - 1, blackpos[1]]);
        }

        // If the piece black removed is not next to the bottom edge, white can remove the piece below.
        if (blackpos[0] < this.board.height - 1) {
            positions.push([blackpos[0] + 1, blackpos[1]])
        }

        // If the piece black removed is not next to the left edge, white can remove the piece to the left.
        if (blackpos[1] > 0) {
            positions.push([blackpos[0], blackpos[1] - 1])
        }

        // If the piece black removed is not next to the right edge, white can remove the to th right.
        if (blackpos[1] < this.board.width - 1) {
            positions.push([blackpos[0], blackpos[1] + 1])
        }

        // Make all of these positions into move objects.
        return positions.map((pos) => {
            return {
                "type": "remove",
                "from": pos
            }
        })
    }

    getValidMovesForPlayer(player){
        var pieces = this.board.getPiecesForPlayer(player);
        return flatmap(pieces, this.getMovesForPiece.bind(this));
    }

    getMovesForPiece(piece){
        return flatmap(this.getMoveDirections(), (direction) => this._getMovesforPieceInDirection(piece, direction));
    }

    getMoveDirections() {
        return [[1, 0], [-1, 0], [0, 1], [0, -1]];
    }

    _getMovesforPieceInDirection(currentPiece, direction) {
        console.log("currentPiece: ", currentPiece);
        let moves = [];
        let prevPiece = null;
        let captured = []
        for(let piece of this.board.getPiecesInLineFrom(currentPiece.position, direction)) {
            if(piece.type === currentPiece.type) {
                return moves;
            }
            
            if(piece.type === -1){
                if(prevPiece === null || prevPiece.type === -1) {
                    return moves;
                } else {
                    moves.push({
                        type: "move",
                        from: currentPiece.position,
                        to: piece.position,
                        captured
                    });
                    // There can be multiple possible moves in one line.
                    // We wan ttheir 'captured' array to reflect the pieces captured so far.
                    // Calling .slice() on an array with no arguments, makes a copy of the array.
                    captured = captured.slice();
                }
            } else {
                captured.push(piece);
            }
            prevPiece = piece;
        }
        return moves;
    }
}