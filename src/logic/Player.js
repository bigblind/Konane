export default class Player {
    constructor(local) {
        this.local = local;
        this.resolver = null;
    }

    getMove(state) {
        return new Promise((resolve, reject) => {
            this.resolver = resolve;
        })
    }

    doMove(move) {
        this.resolver(move);
        this.resolver = null;
    }
}