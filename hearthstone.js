// load modules
var Hearthstone = {
    Logger: require('./build/logger'),
    Player: require('./build/player'),
    Game: require('./build/game'),
    Parser: require('./build/parser'),
    Reporter: require('./build/reporter'),
    Configurator: require('./build/configurator')
};

module.exports = Hearthstone;