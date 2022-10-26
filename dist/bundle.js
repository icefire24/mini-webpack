(function (graph) {
    function require(file) {
      function absRequire(relPath) {
        return require(graph[file].dep[relPath]);
      }
      var exports = {};
      (function (require, exports, code) {
        eval(code);
      })(absRequire, exports, graph[file].code);
      return exports;
    }
    require('./src/index.js');
  })({"./src/index.js":{"dep":{"./add.js":"./src\\add.js","./minus.js":"./src\\minus.js"},"code":"\"use strict\";\n\nvar _add = _interopRequireDefault(require(\"./add.js\"));\nvar _minus = require(\"./minus.js\");\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { \"default\": obj }; }\n// index.js\n\nconsole.log((0, _add[\"default\"])(1, 2));\nvar sum = (0, _add[\"default\"])(1, 2);\nvar division = (0, _minus.minus)(2, 1);\nconsole.log(division);"},"./src\\add.js":{"dep":{"./minus.js":"./src\\minus.js","./c.js":"./src\\c.js"},"code":"\"use strict\";\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports[\"default\"] = void 0;\nvar _minus = require(\"./minus.js\");\nvar _c = require(\"./c.js\");\nconsole.log(\"minus:\", (0, _minus.minus)(20, 1));\nconsole.log(\"c:\", _c.c);\nvar _default = function _default(a, b) {\n  return a + b;\n};\nexports[\"default\"] = _default;"},"./src\\minus.js":{"dep":{},"code":"\"use strict\";\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.minus = void 0;\nvar minus = function minus(a, b) {\n  return a - b;\n};\nexports.minus = minus;"},"./src\\c.js":{"dep":{},"code":"\"use strict\";\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.c = void 0;\nvar c = 888;\nexports.c = c;"}});