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
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
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
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.web.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/index.web.ts":
/*!**************************!*\
  !*** ./src/index.web.ts ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = __webpack_require__(/*! ./server/web/server */ "./src/server/web/server.ts");
const db_1 = __webpack_require__(/*! ./server/db/db */ "./src/server/db/db.ts");
db_1.DB.create()
    .then((db) => {
    // db.users.insertOne({_id: 'aaaa'})
    //     .then(() => {
    //        console.log('user created');
    //     });
    const server = new server_1.Server();
    server.init(db);
    server.start(3000);
});


/***/ }),

/***/ "./src/server/db/db.ts":
/*!*****************************!*\
  !*** ./src/server/db/db.ts ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = __webpack_require__(/*! mongodb */ "mongodb");
const user_service_1 = __webpack_require__(/*! ./services/user.service */ "./src/server/db/services/user.service.ts");
const _ = __webpack_require__(/*! lodash */ "lodash");
exports.DB_URL = 'mongodb://cleanspot:WyXDVH24azgDJSd@cleanspot-shard-00-00-3vdga.mongodb.net:27017' +
    ',cleanspot-shard-00-01-3vdga.mongodb.net:27017,cleanspot-shard-00-02-3vdga.mongodb.net:27017/test?ssl' +
    '=true&replicaSet=CleanSpot-shard-0&authSource=admin&retryWrites=true';
class DB {
    constructor(client, dbName = 'CleanSpot') {
        this.users = new user_service_1.UserService();
        this.client = client;
        this.db = client.db(dbName);
        this.collections = {
            users: this.users,
        };
        _.forEach(this.collections, (service, name) => {
            this.initService(service, name);
        });
    }
    static create(url) {
        return new Promise((resolve, reject) => {
            mongodb_1.MongoClient.connect(url || exports.DB_URL, {
                poolSize: 100,
                connectTimeoutMS: 3000000,
                socketTimeoutMS: 3000000,
                keepAlive: 3000000,
                useNewUrlParser: true,
            }, (err, client) => {
                if (err) {
                    console.log(err);
                }
                const db = new DB(client, 'CleanSpot');
                resolve(db);
            });
        });
    }
    close() {
        return new Promise((resolve) => {
            this.client.close(true, () => resolve());
        });
    }
    initService(service, collectionName) {
        service.collection = this.db.collection(collectionName);
        service.getService = (name) => {
            if (this[name] && this[name].collection) {
                return this[name];
            }
        };
    }
}
exports.DB = DB;


/***/ }),

/***/ "./src/server/db/services/user.service.ts":
/*!************************************************!*\
  !*** ./src/server/db/services/user.service.ts ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const PasswordHash = __webpack_require__(/*! password-hash */ "password-hash");
const jwt = __webpack_require__(/*! jsonwebtoken */ "jsonwebtoken");
const authRouter_1 = __webpack_require__(/*! ../../web/authRouter */ "./src/server/web/authRouter.ts");
exports.SessionTokenExpiresIn = 3600 * 24; // 24 hours
class UserService {
    constructor() {
    }
    createUser(userObj) {
        const hash = PasswordHash.generate(userObj.password);
        const newUser = { _id: userObj._id, passwordHash: hash, createdAt: new Date(), updatedAt: new Date() };
        return this.collection.insertOne(newUser)
            .then((data) => {
            return newUser;
        });
    }
    loginUser(user) {
        const resObj = {
            success: false,
            code: 403,
            token: null,
        };
        return this.collection.findOne({ _id: user._id })
            .then((foundUser) => {
            if (PasswordHash.verify(user.password, foundUser.passwordHash)) {
                resObj.success = true;
                resObj.code = 200;
                resObj.token = jwt.sign({ userId: user._id }, authRouter_1.SECRET, { expiresIn: exports.SessionTokenExpiresIn });
            }
            return resObj;
        });
    }
    findById(id) {
        return this.collection.findOne({ _id: id });
    }
}
exports.UserService = UserService;


/***/ }),

/***/ "./src/server/web/api/base.api.ts":
/*!****************************************!*\
  !*** ./src/server/web/api/base.api.ts ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class BaseApi {
    constructor(db) {
        this.db = db;
    }
}
exports.BaseApi = BaseApi;


/***/ }),

/***/ "./src/server/web/api/user.api.ts":
/*!****************************************!*\
  !*** ./src/server/web/api/user.api.ts ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const base_api_1 = __webpack_require__(/*! ./base.api */ "./src/server/web/api/base.api.ts");
const authRouter_1 = __webpack_require__(/*! ../authRouter */ "./src/server/web/authRouter.ts");
class UserApi extends base_api_1.BaseApi {
    constructor(db) {
        super(db);
    }
    registerRoutes(app) {
        app.get('/api/users/:id', authRouter_1.AuthRouter.authenticationMiddleware(this.db), this.getUser.bind(this));
    }
    getUser(req, res) {
        res.send('success');
    }
}
exports.UserApi = UserApi;


/***/ }),

/***/ "./src/server/web/authRouter.ts":
/*!**************************************!*\
  !*** ./src/server/web/authRouter.ts ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const jwt = __webpack_require__(/*! jsonwebtoken */ "jsonwebtoken");
exports.SECRET = 'b2125d348e094ce7bd43925d5f6b12f8ebef257fb0b94513a9f58a73d1f459d8';
class AuthRouter {
    static authenticationMiddleware(db) {
        return (req, res, next) => {
            const token = req.headers.authorization || req.headers['x-access-token'] || req.query.token ||
                req.body.token;
            delete req.query.token;
            const response = {
                success: false,
                msg: 'Failed to authenticate token.',
            };
            // decode token
            if (!token) {
                res.status(401).send(response);
            }
            else {
                jwt.verify(token, exports.SECRET, (err, decoded) => {
                    if (err) {
                        res.status(401).send(response);
                    }
                    else {
                        // if everything is good, save to request for use in other routes
                        req.session = req.session || {};
                        db.users.findById(decoded.userId)
                            .then((user) => {
                            req.session.user = user;
                            next();
                        });
                    }
                });
            }
        };
    }
}
exports.AuthRouter = AuthRouter;


/***/ }),

/***/ "./src/server/web/server.ts":
/*!**********************************!*\
  !*** ./src/server/web/server.ts ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const express = __webpack_require__(/*! express */ "express");
const Parser = __webpack_require__(/*! body-parser */ "body-parser");
const cors = __webpack_require__(/*! cors */ "cors");
const user_api_1 = __webpack_require__(/*! ./api/user.api */ "./src/server/web/api/user.api.ts");
const session_api_1 = __webpack_require__(/*! ./session/session.api */ "./src/server/web/session/session.api.ts");
class Server {
    constructor() {
    }
    init(db) {
        this.db = db;
        this.app = express();
        this.app.use(Parser.json({ limit: '50mb' }));
        this.app.use(Parser.urlencoded({ limit: '50mb', extended: true }));
        this.app.use(cors());
        this.initApi(this.db);
    }
    start(port = 3000) {
        return new Promise((resolve, reject) => {
            this.app.get('/', (req, res) => res.send('Hello World!'));
            this.server = this.app.listen(port, () => {
                console.log(`WebServer listening on port ${port}`);
                resolve();
            });
        });
    }
    initApi(db) {
        const apis = [
            new user_api_1.UserApi(db),
            new session_api_1.SessionApi(db),
        ];
        this.registerRoutes(apis);
    }
    registerRoutes(apis) {
        apis.forEach((api) => {
            api.registerRoutes(this.app);
        });
    }
}
exports.Server = Server;


/***/ }),

/***/ "./src/server/web/session/session.api.ts":
/*!***********************************************!*\
  !*** ./src/server/web/session/session.api.ts ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const base_api_1 = __webpack_require__(/*! ../api/base.api */ "./src/server/web/api/base.api.ts");
class SessionApi extends base_api_1.BaseApi {
    constructor(db) {
        super(db);
    }
    registerRoutes(app) {
        app.post('/api/users/:id/create', this.createUser.bind(this));
        app.post('/api/users/:id/login', this.login.bind(this));
    }
    createUser(req, res) {
        if (!req.params.id || !req.body.password) {
            res.sendStatus(400);
            return;
        }
        this.db.users.createUser({ _id: req.params.id, password: req.body.password })
            .then((user) => {
            res.send(user);
        });
    }
    login(req, res) {
        if (!req.params.id || !req.body.password) {
            res.sendStatus(400);
            return;
        }
        this.db.users.loginUser({ _id: req.params.id, password: req.body.password })
            .then((response) => {
            res.status(response.code).send(response);
        });
    }
}
exports.SessionApi = SessionApi;


/***/ }),

/***/ "body-parser":
/*!******************************!*\
  !*** external "body-parser" ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("body-parser");

/***/ }),

/***/ "cors":
/*!***********************!*\
  !*** external "cors" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("cors");

/***/ }),

/***/ "express":
/*!**************************!*\
  !*** external "express" ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("express");

/***/ }),

/***/ "jsonwebtoken":
/*!*******************************!*\
  !*** external "jsonwebtoken" ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("jsonwebtoken");

/***/ }),

/***/ "lodash":
/*!*************************!*\
  !*** external "lodash" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("lodash");

/***/ }),

/***/ "mongodb":
/*!**************************!*\
  !*** external "mongodb" ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("mongodb");

/***/ }),

/***/ "password-hash":
/*!********************************!*\
  !*** external "password-hash" ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("password-hash");

/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL2luZGV4LndlYi50cyIsIndlYnBhY2s6Ly8vLi9zcmMvc2VydmVyL2RiL2RiLnRzIiwid2VicGFjazovLy8uL3NyYy9zZXJ2ZXIvZGIvc2VydmljZXMvdXNlci5zZXJ2aWNlLnRzIiwid2VicGFjazovLy8uL3NyYy9zZXJ2ZXIvd2ViL2FwaS9iYXNlLmFwaS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvc2VydmVyL3dlYi9hcGkvdXNlci5hcGkudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3NlcnZlci93ZWIvYXV0aFJvdXRlci50cyIsIndlYnBhY2s6Ly8vLi9zcmMvc2VydmVyL3dlYi9zZXJ2ZXIudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3NlcnZlci93ZWIvc2Vzc2lvbi9zZXNzaW9uLmFwaS50cyIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJib2R5LXBhcnNlclwiIiwid2VicGFjazovLy9leHRlcm5hbCBcImNvcnNcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJleHByZXNzXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwianNvbndlYnRva2VuXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwibG9kYXNoXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwibW9uZ29kYlwiIiwid2VicGFjazovLy9leHRlcm5hbCBcInBhc3N3b3JkLWhhc2hcIiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxrREFBMEMsZ0NBQWdDO0FBQzFFO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsZ0VBQXdELGtCQUFrQjtBQUMxRTtB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QUM7Q0FFSjtBQWpDRCxnQ0FpQ0M7Ozs7Ozs7Ozs7OztBQ3BDRCx3Qzs7Ozs7Ozs7Ozs7QUNBQSxpQzs7Ozs7Ozs7Ozs7QUNBQSxvQzs7Ozs7Ozs7Ozs7QUNBQSx5Qzs7Ozs7Ozs7Ozs7QUNBQSxtQzs7Ozs7Ozs7Ozs7QUNBQSxvQzs7Ozs7Ozs7Ozs7QUNBQSwwQyIsImZpbGUiOiJ3ZWIuYnVuZGxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZ2V0dGVyIH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSBmdW5jdGlvbihleHBvcnRzKSB7XG4gXHRcdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuIFx0XHR9XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG4gXHR9O1xuXG4gXHQvLyBjcmVhdGUgYSBmYWtlIG5hbWVzcGFjZSBvYmplY3RcbiBcdC8vIG1vZGUgJiAxOiB2YWx1ZSBpcyBhIG1vZHVsZSBpZCwgcmVxdWlyZSBpdFxuIFx0Ly8gbW9kZSAmIDI6IG1lcmdlIGFsbCBwcm9wZXJ0aWVzIG9mIHZhbHVlIGludG8gdGhlIG5zXG4gXHQvLyBtb2RlICYgNDogcmV0dXJuIHZhbHVlIHdoZW4gYWxyZWFkeSBucyBvYmplY3RcbiBcdC8vIG1vZGUgJiA4fDE6IGJlaGF2ZSBsaWtlIHJlcXVpcmVcbiBcdF9fd2VicGFja19yZXF1aXJlX18udCA9IGZ1bmN0aW9uKHZhbHVlLCBtb2RlKSB7XG4gXHRcdGlmKG1vZGUgJiAxKSB2YWx1ZSA9IF9fd2VicGFja19yZXF1aXJlX18odmFsdWUpO1xuIFx0XHRpZihtb2RlICYgOCkgcmV0dXJuIHZhbHVlO1xuIFx0XHRpZigobW9kZSAmIDQpICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUgJiYgdmFsdWUuX19lc01vZHVsZSkgcmV0dXJuIHZhbHVlO1xuIFx0XHR2YXIgbnMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIobnMpO1xuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkobnMsICdkZWZhdWx0JywgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdmFsdWUgfSk7XG4gXHRcdGlmKG1vZGUgJiAyICYmIHR5cGVvZiB2YWx1ZSAhPSAnc3RyaW5nJykgZm9yKHZhciBrZXkgaW4gdmFsdWUpIF9fd2VicGFja19yZXF1aXJlX18uZChucywga2V5LCBmdW5jdGlvbihrZXkpIHsgcmV0dXJuIHZhbHVlW2tleV07IH0uYmluZChudWxsLCBrZXkpKTtcbiBcdFx0cmV0dXJuIG5zO1xuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IFwiLi9zcmMvaW5kZXgud2ViLnRzXCIpO1xuIiwiaW1wb3J0IHtTZXJ2ZXJ9IGZyb20gJy4vc2VydmVyL3dlYi9zZXJ2ZXInO1xuaW1wb3J0IHtEQn0gZnJvbSAnLi9zZXJ2ZXIvZGIvZGInO1xuXG5EQi5jcmVhdGUoKVxuICAgIC50aGVuKChkYjogREIpID0+IHtcblxuICAgICAgICAvLyBkYi51c2Vycy5pbnNlcnRPbmUoe19pZDogJ2FhYWEnfSlcbiAgICAgICAgLy8gICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgLy8gICAgICAgIGNvbnNvbGUubG9nKCd1c2VyIGNyZWF0ZWQnKTtcbiAgICAgICAgLy8gICAgIH0pO1xuXG4gICAgICAgIGNvbnN0IHNlcnZlciA9IG5ldyBTZXJ2ZXIoKTtcbiAgICAgICAgc2VydmVyLmluaXQoZGIpO1xuICAgICAgICBzZXJ2ZXIuc3RhcnQoMzAwMCk7XG4gICAgfSk7XG4iLCJpbXBvcnQgeyBNb25nb0NsaWVudCB9IGZyb20gJ21vbmdvZGInO1xuaW1wb3J0IHtVc2VyU2VydmljZX0gZnJvbSAnLi9zZXJ2aWNlcy91c2VyLnNlcnZpY2UnO1xuaW1wb3J0ICogYXMgXyBmcm9tICdsb2Rhc2gnO1xuXG5leHBvcnQgY29uc3QgREJfVVJMID0gJ21vbmdvZGI6Ly9jbGVhbnNwb3Q6V3lYRFZIMjRhemdESlNkQGNsZWFuc3BvdC1zaGFyZC0wMC0wMC0zdmRnYS5tb25nb2RiLm5ldDoyNzAxNycgK1xuICAgICcsY2xlYW5zcG90LXNoYXJkLTAwLTAxLTN2ZGdhLm1vbmdvZGIubmV0OjI3MDE3LGNsZWFuc3BvdC1zaGFyZC0wMC0wMi0zdmRnYS5tb25nb2RiLm5ldDoyNzAxNy90ZXN0P3NzbCcgK1xuICAgICc9dHJ1ZSZyZXBsaWNhU2V0PUNsZWFuU3BvdC1zaGFyZC0wJmF1dGhTb3VyY2U9YWRtaW4mcmV0cnlXcml0ZXM9dHJ1ZSc7XG5cbmV4cG9ydCBjbGFzcyBEQiB7XG4gIHB1YmxpYyBzdGF0aWMgY3JlYXRlKHVybD86IHN0cmluZyk6IFByb21pc2U8YW55PiB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIE1vbmdvQ2xpZW50LmNvbm5lY3QodXJsIHx8IERCX1VSTCwge1xuICAgICAgICBwb29sU2l6ZTogMTAwLFxuICAgICAgICBjb25uZWN0VGltZW91dE1TOiAzMDAwMDAwLFxuICAgICAgICBzb2NrZXRUaW1lb3V0TVM6IDMwMDAwMDAsXG4gICAgICAgIGtlZXBBbGl2ZTogMzAwMDAwMCxcbiAgICAgICAgdXNlTmV3VXJsUGFyc2VyOiB0cnVlLFxuICAgICAgfSBhcyBhbnksIChlcnIsIGNsaWVudCkgPT4ge1xuICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgY29uc29sZS5sb2coZXJyKTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBkYiA9IG5ldyBEQihjbGllbnQsICdDbGVhblNwb3QnKTtcbiAgICAgICAgcmVzb2x2ZShkYik7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIHByb3RlY3RlZCBjbGllbnQ6IGFueTtcbiAgcHVibGljIGRiOiBhbnk7XG4gIHByaXZhdGUgcmVhZG9ubHkgY29sbGVjdGlvbnM7XG4gIHB1YmxpYyB1c2VyczogVXNlclNlcnZpY2UgPSBuZXcgVXNlclNlcnZpY2UoKTtcblxuICBjb25zdHJ1Y3RvcihjbGllbnQsIGRiTmFtZSA9ICdDbGVhblNwb3QnKSB7XG4gICAgdGhpcy5jbGllbnQgPSBjbGllbnQ7XG4gICAgdGhpcy5kYiA9IGNsaWVudC5kYihkYk5hbWUpO1xuICAgIHRoaXMuY29sbGVjdGlvbnMgPSB7XG4gICAgICAgIHVzZXJzOiB0aGlzLnVzZXJzLFxuICAgIH07XG4gICAgXy5mb3JFYWNoKHRoaXMuY29sbGVjdGlvbnMsIChzZXJ2aWNlLCBuYW1lKSA9PiB7XG4gICAgICAgIHRoaXMuaW5pdFNlcnZpY2Uoc2VydmljZSwgbmFtZSk7XG4gICAgfSk7XG4gIH1cblxuICBwdWJsaWMgY2xvc2UoKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG4gICAgICB0aGlzLmNsaWVudC5jbG9zZSh0cnVlLCAoKSA9PiByZXNvbHZlKCkpO1xuICAgIH0pO1xuICB9XG4gIHByaXZhdGUgaW5pdFNlcnZpY2Uoc2VydmljZSwgY29sbGVjdGlvbk5hbWUpIHtcbiAgICAgIHNlcnZpY2UuY29sbGVjdGlvbiA9IHRoaXMuZGIuY29sbGVjdGlvbihjb2xsZWN0aW9uTmFtZSk7XG4gICAgICBzZXJ2aWNlLmdldFNlcnZpY2UgPSAobmFtZSkgPT4ge1xuICAgICAgICAgIGlmICh0aGlzW25hbWVdICYmIHRoaXNbbmFtZV0uY29sbGVjdGlvbikge1xuICAgICAgICAgICAgICByZXR1cm4gdGhpc1tuYW1lXTtcbiAgICAgICAgICB9XG4gICAgICB9O1xuICB9XG59XG4iLCJpbXBvcnQge1VzZXJ9IGZyb20gJy4uLy4uLy4uL2NvbW1vbi9tb2RlbHMvdXNlcic7XG5pbXBvcnQge0lDcmVhdGVVc2VyT2JqfSBmcm9tICcuLi8uLi8uLi9jb21tb24vaW50ZXJmYWNlcy91c2VyLmludGVyZmFjZSc7XG5pbXBvcnQgKiBhcyBQYXNzd29yZEhhc2ggZnJvbSAncGFzc3dvcmQtaGFzaCc7XG5pbXBvcnQgKiBhcyBqd3QgZnJvbSAnanNvbndlYnRva2VuJztcbmltcG9ydCB7U0VDUkVUfSBmcm9tICcuLi8uLi93ZWIvYXV0aFJvdXRlcic7XG5leHBvcnQgY29uc3QgU2Vzc2lvblRva2VuRXhwaXJlc0luID0gMzYwMCAqIDI0OyAgICAvLyAyNCBob3Vyc1xuXG5leHBvcnQgY2xhc3MgVXNlclNlcnZpY2Uge1xuICAgIHB1YmxpYyBjb2xsZWN0aW9uO1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgfVxuXG4gICAgcHVibGljIGNyZWF0ZVVzZXIodXNlck9iajogSUNyZWF0ZVVzZXJPYmopIHtcbiAgICAgICAgY29uc3QgaGFzaCA9IFBhc3N3b3JkSGFzaC5nZW5lcmF0ZSh1c2VyT2JqLnBhc3N3b3JkKTtcbiAgICAgICAgY29uc3QgbmV3VXNlciA9IHtfaWQ6IHVzZXJPYmouX2lkLCBwYXNzd29yZEhhc2g6IGhhc2gsIGNyZWF0ZWRBdDogbmV3IERhdGUoKSwgdXBkYXRlZEF0OiBuZXcgRGF0ZSgpfTtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29sbGVjdGlvbi5pbnNlcnRPbmUobmV3VXNlcilcbiAgICAgICAgICAgIC50aGVuKChkYXRhKSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ld1VzZXI7XG4gICAgICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwdWJsaWMgbG9naW5Vc2VyKHVzZXI6IElDcmVhdGVVc2VyT2JqKSB7XG4gICAgICAgIGNvbnN0IHJlc09iaiA9IHtcbiAgICAgICAgICAgIHN1Y2Nlc3M6IGZhbHNlLFxuICAgICAgICAgICAgY29kZTogNDAzLFxuICAgICAgICAgICAgdG9rZW46IG51bGwsXG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiB0aGlzLmNvbGxlY3Rpb24uZmluZE9uZSh7X2lkOiB1c2VyLl9pZH0pXG4gICAgICAgICAgICAudGhlbigoZm91bmRVc2VyKSA9PiB7XG4gICAgICAgICAgICAgICBpZiAoUGFzc3dvcmRIYXNoLnZlcmlmeSh1c2VyLnBhc3N3b3JkLCBmb3VuZFVzZXIucGFzc3dvcmRIYXNoKSkge1xuICAgICAgICAgICAgICAgICAgIHJlc09iai5zdWNjZXNzID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICByZXNPYmouY29kZSA9IDIwMDtcbiAgICAgICAgICAgICAgICAgICByZXNPYmoudG9rZW4gPSBqd3Quc2lnbih7IHVzZXJJZDogdXNlci5faWQgfSwgU0VDUkVULCB7IGV4cGlyZXNJbjogU2Vzc2lvblRva2VuRXhwaXJlc0luIH0pO1xuICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgcmV0dXJuIHJlc09iajtcbiAgICAgICAgICAgIH0pO1xuICAgIH1cblxuICAgIHB1YmxpYyBmaW5kQnlJZChpZCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jb2xsZWN0aW9uLmZpbmRPbmUoe19pZDogaWR9KTtcbiAgICB9XG59XG4iLCJpbXBvcnQge0RCfSBmcm9tICcuLi8uLi9kYi9kYic7XG5cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBCYXNlQXBpIHtcbiAgICBwdWJsaWMgZGI6IERCO1xuICAgIHB1YmxpYyBhYnN0cmFjdCByZWdpc3RlclJvdXRlcyhhcHApO1xuXG4gICAgcHJvdGVjdGVkIGNvbnN0cnVjdG9yKGRiKSB7XG4gICAgICAgIHRoaXMuZGIgPSBkYjtcbiAgICB9XG59XG4iLCJpbXBvcnQge0Jhc2VBcGl9IGZyb20gJy4vYmFzZS5hcGknO1xuaW1wb3J0IHtBdXRoUm91dGVyfSBmcm9tICcuLi9hdXRoUm91dGVyJztcblxuZXhwb3J0IGNsYXNzIFVzZXJBcGkgZXh0ZW5kcyBCYXNlQXBpIHtcblxuICAgIGNvbnN0cnVjdG9yKGRiKSB7XG4gICAgICAgIHN1cGVyKGRiKTtcbiAgICB9XG4gICAgcHVibGljIHJlZ2lzdGVyUm91dGVzKGFwcCkge1xuXG4gICAgICAgIGFwcC5nZXQoJy9hcGkvdXNlcnMvOmlkJywgQXV0aFJvdXRlci5hdXRoZW50aWNhdGlvbk1pZGRsZXdhcmUodGhpcy5kYiksIHRoaXMuZ2V0VXNlci5iaW5kKHRoaXMpKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0VXNlcihyZXEsIHJlcykge1xuICAgICAgICByZXMuc2VuZCgnc3VjY2VzcycpO1xuICAgIH1cbn1cbiIsImltcG9ydCAqIGFzIGp3dCBmcm9tICdqc29ud2VidG9rZW4nO1xuZXhwb3J0IGNvbnN0IFNFQ1JFVCA9ICdiMjEyNWQzNDhlMDk0Y2U3YmQ0MzkyNWQ1ZjZiMTJmOGViZWYyNTdmYjBiOTQ1MTNhOWY1OGE3M2QxZjQ1OWQ4JztcblxuZXhwb3J0IGNsYXNzIEF1dGhSb3V0ZXIge1xuXG4gICAgcHVibGljIHN0YXRpYyBhdXRoZW50aWNhdGlvbk1pZGRsZXdhcmUoZGIpIHtcbiAgICAgICAgcmV0dXJuIChyZXEsIHJlcywgbmV4dCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgdG9rZW4gPSByZXEuaGVhZGVycy5hdXRob3JpemF0aW9uIHx8IHJlcS5oZWFkZXJzWyd4LWFjY2Vzcy10b2tlbiddIHx8IHJlcS5xdWVyeS50b2tlbiB8fFxuICAgICAgICAgICAgICAgIHJlcS5ib2R5LnRva2VuO1xuICAgICAgICAgICAgZGVsZXRlIHJlcS5xdWVyeS50b2tlbjtcblxuICAgICAgICAgICAgY29uc3QgcmVzcG9uc2UgPSB7XG4gICAgICAgICAgICAgICAgc3VjY2VzczogZmFsc2UsXG4gICAgICAgICAgICAgICAgbXNnOiAnRmFpbGVkIHRvIGF1dGhlbnRpY2F0ZSB0b2tlbi4nLFxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgLy8gZGVjb2RlIHRva2VuXG4gICAgICAgICAgICBpZiAoIXRva2VuKSB7XG4gICAgICAgICAgICAgICAgcmVzLnN0YXR1cyg0MDEpLnNlbmQocmVzcG9uc2UpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBqd3QudmVyaWZ5KHRva2VuLCBTRUNSRVQsIChlcnIsIGRlY29kZWQpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzLnN0YXR1cyg0MDEpLnNlbmQocmVzcG9uc2UpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gaWYgZXZlcnl0aGluZyBpcyBnb29kLCBzYXZlIHRvIHJlcXVlc3QgZm9yIHVzZSBpbiBvdGhlciByb3V0ZXNcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlcS5zZXNzaW9uID0gcmVxLnNlc3Npb24gfHwge307XG4gICAgICAgICAgICAgICAgICAgICAgICBkYi51c2Vycy5maW5kQnlJZChkZWNvZGVkLnVzZXJJZClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAudGhlbigodXNlcikgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXEuc2Vzc2lvbi51c2VyID0gdXNlcjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV4dCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfVxuXG5cbn1cbiIsImltcG9ydCAqIGFzIGV4cHJlc3MgZnJvbSAnZXhwcmVzcyc7XG5pbXBvcnQgKiBhcyBQYXJzZXIgZnJvbSAnYm9keS1wYXJzZXInO1xuaW1wb3J0ICogYXMgY29ycyBmcm9tICdjb3JzJztcbmltcG9ydCB7REJ9IGZyb20gJy4uL2RiL0RCJztcbmltcG9ydCB7VXNlckFwaX0gZnJvbSAnLi9hcGkvdXNlci5hcGknO1xuaW1wb3J0IHtCYXNlQXBpfSBmcm9tICcuL2FwaS9iYXNlLmFwaSc7XG5pbXBvcnQge1Nlc3Npb25BcGl9IGZyb20gJy4vc2Vzc2lvbi9zZXNzaW9uLmFwaSc7XG5cbmV4cG9ydCBjbGFzcyBTZXJ2ZXIge1xuXG4gICAgcHVibGljIGRiOiBEQjtcbiAgICBwdWJsaWMgYXBwO1xuICAgIHB1YmxpYyBzZXJ2ZXI7XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICB9XG4gICAgcHVibGljIGluaXQoZGIpIHtcbiAgICAgICAgdGhpcy5kYiA9IGRiO1xuICAgICAgICB0aGlzLmFwcCA9IGV4cHJlc3MoKTtcbiAgICAgICAgdGhpcy5hcHAudXNlKFBhcnNlci5qc29uKHsgbGltaXQ6ICc1MG1iJyB9KSk7XG4gICAgICAgIHRoaXMuYXBwLnVzZShQYXJzZXIudXJsZW5jb2RlZCh7IGxpbWl0OiAnNTBtYicsIGV4dGVuZGVkOiB0cnVlIH0pKTtcbiAgICAgICAgdGhpcy5hcHAudXNlKGNvcnMoKSk7XG5cbiAgICAgICAgdGhpcy5pbml0QXBpKHRoaXMuZGIpO1xuICAgIH1cblxuICAgIHB1YmxpYyBzdGFydChwb3J0OiBudW1iZXIgPSAzMDAwKTogUHJvbWlzZTxhbnk+IHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIHRoaXMuYXBwLmdldCgnLycsIChyZXEsIHJlcykgPT4gcmVzLnNlbmQoJ0hlbGxvIFdvcmxkIScpKVxuXG4gICAgICAgICAgICB0aGlzLnNlcnZlciA9IHRoaXMuYXBwLmxpc3Rlbihwb3J0LCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coYFdlYlNlcnZlciBsaXN0ZW5pbmcgb24gcG9ydCAke3BvcnR9YCk7XG4gICAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHB1YmxpYyBpbml0QXBpKGRiKSB7XG4gICAgICAgIGNvbnN0IGFwaXM6IEJhc2VBcGkgW10gPSBbXG4gICAgICAgICAgICBuZXcgVXNlckFwaShkYiksXG4gICAgICAgICAgICBuZXcgU2Vzc2lvbkFwaShkYiksXG4gICAgICAgIF07XG4gICAgICAgIHRoaXMucmVnaXN0ZXJSb3V0ZXMoYXBpcyk7XG4gICAgfVxuXG4gICAgcHVibGljIHJlZ2lzdGVyUm91dGVzKGFwaXM6IEJhc2VBcGkgW10pIHtcbiAgICAgICAgYXBpcy5mb3JFYWNoKChhcGkpID0+IHtcbiAgICAgICAgICAgYXBpLnJlZ2lzdGVyUm91dGVzKHRoaXMuYXBwKTtcbiAgICAgICAgfSk7XG4gICAgfVxufVxuIiwiaW1wb3J0IHtBdXRoUm91dGVyfSBmcm9tICcuLi9hdXRoUm91dGVyJztcbmltcG9ydCB7QmFzZUFwaX0gZnJvbSAnLi4vYXBpL2Jhc2UuYXBpJztcblxuZXhwb3J0IGNsYXNzIFNlc3Npb25BcGkgZXh0ZW5kcyBCYXNlQXBpIHtcblxuICAgIGNvbnN0cnVjdG9yKGRiKSB7XG4gICAgICAgIHN1cGVyKGRiKTtcbiAgICB9XG4gICAgcHVibGljIHJlZ2lzdGVyUm91dGVzKGFwcCkge1xuXG4gICAgICAgIGFwcC5wb3N0KCcvYXBpL3VzZXJzLzppZC9jcmVhdGUnLCB0aGlzLmNyZWF0ZVVzZXIuYmluZCh0aGlzKSk7XG4gICAgICAgIGFwcC5wb3N0KCcvYXBpL3VzZXJzLzppZC9sb2dpbicsIHRoaXMubG9naW4uYmluZCh0aGlzKSk7XG4gICAgfVxuXG4gICAgcHVibGljIGNyZWF0ZVVzZXIocmVxLCByZXMpIHtcbiAgICAgICAgaWYgKCFyZXEucGFyYW1zLmlkIHx8ICFyZXEuYm9keS5wYXNzd29yZCkge1xuICAgICAgICAgICAgcmVzLnNlbmRTdGF0dXMoNDAwKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmRiLnVzZXJzLmNyZWF0ZVVzZXIoe19pZDogcmVxLnBhcmFtcy5pZCwgcGFzc3dvcmQ6IHJlcS5ib2R5LnBhc3N3b3JkfSlcbiAgICAgICAgICAgIC50aGVuKCh1c2VyKSA9PiB7XG4gICAgICAgICAgICAgICAgcmVzLnNlbmQodXNlcik7XG4gICAgICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwdWJsaWMgbG9naW4ocmVxLCByZXMpIHtcbiAgICAgICAgaWYgKCFyZXEucGFyYW1zLmlkIHx8ICFyZXEuYm9keS5wYXNzd29yZCkge1xuICAgICAgICAgICAgcmVzLnNlbmRTdGF0dXMoNDAwKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmRiLnVzZXJzLmxvZ2luVXNlcih7X2lkOiByZXEucGFyYW1zLmlkLCBwYXNzd29yZDogcmVxLmJvZHkucGFzc3dvcmR9KVxuICAgICAgICAgICAgLnRoZW4oKHJlc3BvbnNlKSA9PiB7XG4gICAgICAgICAgICAgICAgcmVzLnN0YXR1cyhyZXNwb25zZS5jb2RlKS5zZW5kKHJlc3BvbnNlKTtcbiAgICAgICAgICAgIH0pO1xuICAgIH1cblxufVxuIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiYm9keS1wYXJzZXJcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiY29yc1wiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJleHByZXNzXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImpzb253ZWJ0b2tlblwiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJsb2Rhc2hcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwibW9uZ29kYlwiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJwYXNzd29yZC1oYXNoXCIpOyJdLCJzb3VyY2VSb290IjoiIn0=