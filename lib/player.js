class Player {
    constructor(id, name) {
        this.id = id;
        this.name = name;
        this.firstPlayer = false;
        this.result = null;
    }

    toObject() {
        return {id: this.id, name: this.name, first_player: this.firstPlayer, result: this.result}
    }
}

module.exports = Player;