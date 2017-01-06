const React = require("react");
const range = require("../utils").range;

export default class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            from: null
        }
        this.props.game.on("update", this.forceUpdate.bind(this));
    }

    render() {
        const g = this.props.game;
        const moves = g.state.getValidMoves();
    return <table style={{margin: "auto"}}>
        <tbody>
            {range(g.state.board.height).map((y) => {
                return <tr key={"tr" + y}>
                    {range(g.state.board.width).map((x) => {
                        const t = g.state.board.getPieceAt(y, x).type;
                        let content = this.getMoveTag(x, y, (t === -1) ? "\u25A0" : t === 0 ? "b" : "w", g, moves);
                        return <td key={"td" + x}>
                            {content}
                        </td>
                    })}
                </tr>
            })}
        </tbody>
        </table>
    }

    shouldDisplayMoves(g) {
        g = this.props.game;
        return g.getCurrentPlayer().local;
    }

    getMoveTag(x, y, type, game, moves) {
        if(!this.shouldDisplayMoves(game)){
            return <span>{type}</span>
        }
        
        if(game.state.getPhase() === "remove" || !this.state.from) {
            moves = moves.filter((move) => move.from[0] === y && move.from[1] === x);
        } else {
            moves = moves.filter((move) => move.from[0] === this.state.from[0] && move.from[1] === this.state.from[1] && move.to[0] === y && move.to[1] === x);
        }

        if(moves.length > 0){
            return <a style={{color:"blue", border: "1px solid blue"}} onClick={this.makeMove.bind(this, moves[0], game)}>{type}</a>
        } else {
            return <span>{type}</span>
        }
    }

    makeMove(move, game) {
        if(game.state.getPhase() === "remove" || this.state.from) {
            game.getCurrentPlayer().doMove(move);
            console.log(game.getCurrentPlayer());
            this.setState({from: null});
        } else {
            this.setState({from: move.from})
        }
    }
}