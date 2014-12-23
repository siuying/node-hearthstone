// load traceur runtime
require('traceur/bin/traceur-runtime');

// load modules
var Hearthstone = {
    Logger: require('./build/logger'),
    Player: require('./build/player'),
    Game: require('./build/game'),
    Parser: require('./build/parser'),
    Configurator: require('./build/configurator')
};

module.exports = Hearthstone;