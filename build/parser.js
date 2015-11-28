'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var EventEmitter = require('events').EventEmitter;
var Tail = require('file-tail');
var ls = require('ls');

var Power = require('./parsers/Power');
var Zone = require('./parsers/Zone');
var Party = require('./parsers/Party');

var Parser = (function (_EventEmitter) {
    _inherits(Parser, _EventEmitter);

    function Parser() {
        _classCallCheck(this, Parser);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(Parser).apply(this, arguments));
    }

    _createClass(Parser, [{
        key: 'parse',
        value: function parse(path) {
            var parser = this;
            var parsers = [Power, Zone, Party];

            if (!path.match(/\/$/)) {
                path = path + "/";
            }

            ls(path + "*.log", function () {
                // find a parser for the file, if found, watch it
                var file = this.file;
                var logParser = parsers.filter(function (f) {
                    return f.filename == file;
                })[0];
                var fullpath = this.full;
                if (logParser) {
                    var tail = new Tail.startTailing(fullpath);
                    tail.on("line", function (line) {
                        parser.parseLine(logParser.parsers, line);
                    });
                    tail.on('error', function (data) {
                        console.error("error:", data);
                    });
                } else {
                    console.log("ignore", fullpath);
                }
            });
        }
    }, {
        key: 'parseLine',
        value: function parseLine(parsers, line) {
            var match = null;
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = parsers[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var parser = _step.value;

                    var result = parser.bind(this)(line);
                    if (result) {
                        this.emit.apply(this, result);
                        return result;
                    }
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }
        }
    }]);

    return Parser;
})(EventEmitter);

module.exports = Parser;