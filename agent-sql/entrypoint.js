/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const http = __webpack_require__(1);
const url = __webpack_require__(2);
const query_1 = __webpack_require__(3);
const connect_1 = __webpack_require__(5);
const queryRequestListener = (f) => (q, p) => {
    const b = [];
    q.on('data', (chunk) => b.push(chunk));
    q.on('end', () => {
        const dbname = url.parse(q.url).path.split("/").pop();
        const args = JSON.parse(b.toString());
        const conn = connect_1.connects[dbname];
        f(conn, args[0], args[1]).then(result => {
            p.writeHead(200, { "Content-Type": "application/json" });
            p.write(JSON.stringify(result));
            p.end();
        }).catch(e => {
            p.writeHead(500);
            p.write(e);
            p.end();
        });
    });
};
function startService(port) {
    return http.createServer(queryRequestListener(query_1.queryFunc)).listen(port);
}
startService(9500);


/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = require("http");

/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = require("url");

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const oracledb = __webpack_require__(4);
function queryFunc(connect, sql, args) {
    return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
        let conn;
        try {
            conn = yield oracledb.getConnection(connect);
            let result = yield conn.execute(sql, args, { outFormat: oracledb.OBJECT });
            resolve(result.rows);
        }
        catch (err) {
            reject(err);
        }
        finally {
            if (conn) {
                try {
                    yield conn.release();
                }
                catch (e) {
                    console.error(e);
                }
            }
        }
    }));
}
exports.queryFunc = queryFunc;


/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = require("oracledb");

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.connects = {
    "yali2": { connectString: "10.65.193.25:1521/orayali2", user: "system", password: "oracle" }
};


/***/ })
/******/ ]);