$traceurRuntime.ModuleStore.getAnonymousModule(function() {
  "use strict";
  var fs = require('fs');
  var Configurator = function Configurator(path) {
    this.path = path ? path : $Configurator.defaultConfigPath();
  };
  var $Configurator = Configurator;
  ($traceurRuntime.createClass)(Configurator, {
    configNeeded: function() {
      if (!this.path) {
        throw "Path cannot be nil";
      }
      if (!fs.existsSync(this.path)) {
        return true;
      }
      var data = fs.readFileSync(this.path).toString();
      return !data.match(/\[Zone\]/) && !data.match(/\[Power\]/) && !data.match(/\[LoadingScreen\]/);
    },
    config: function() {
      if (!this.path) {
        throw "Path cannot be nil";
      }
      var config = "[ZONE]\n" + "LogLevel=1\n" + "FilePrinting=false\n" + "ConsolePrinting=true\n" + "ScreenPrinting=false\n\n" + "[Power]\n" + "LogLevel=1\n" + "ConsolePrinting=true\n" + "[LoadingScreen]\n" + "LogLevel=1\n" + "FilePrinting=false\n" + "ConsolePrinting=true\n" + "ScreenPrinting=false";
      var mode = "w";
      if (fs.existsSync(this.path)) {
        mode = "a";
      }
      fs.writeFileSync(this.path, config, {flag: mode});
    }
  }, {
    getUserHome: function() {
      var isWindows = process.platform === 'win32';
      return isWindows ? process.env.USERPROFILE : process.env.HOME;
    },
    defaultConfigPath: function() {
      var home = this.getUserHome();
      return (home + "/Library/Preferences/Blizzard/Hearthstone/log.config");
    },
    defaultInputPath: function() {
      var home = this.getUserHome();
      return (home + "/Library/Logs/Unity/Player.log");
    },
    defaultOutputPath: function() {
      var home = this.getUserHome();
      return (home + "/Documents/hearthstone");
    }
  });
  ;
  module.exports = Configurator;
  return {};
});
