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
exports.DB_URL = '';
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL2luZGV4LndlYi50cyIsIndlYnBhY2s6Ly8vLi9zcmMvc2VydmVyL2RiL2RiLnRzIiwid2VicGFjazovLy8uL3NyYy9zZXJ2ZXIvZGIvc2VydmljZXMvdXNlci5zZXJ2aWNlLnRzIiwid2VicGFjazovLy8uL3NyYy9zZXJ2ZXIvd2ViL2FwaS9iYXNlLmFwaS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvc2VydmVyL3dlYi9hcGkvdXNlci5hcGkudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3NlcnZlci93ZWIvYXV0aFJvdXRlci50cyIsIndlYnBhY2s6Ly8vLi9zcmMvc2VydmVyL3dlYi9zZXJ2ZXIudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3NlcnZlci93ZWIvc2Vzc2lvbi9zZXNzaW9uLmFwaS50cyIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJib2R5LXBhcnNlclwiIiwid2VicGFjazovLy9leHRlcm5hbCBcImNvcnNcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJleHByZXNzXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwianNvbndlYnRva2VuXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwibG9kYXNoXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwibW9uZ29kYlwiIiwid2VicGFjazovLy9leHRlcm5hbCBcInBhc3N3b3JkLWhhc2hcIiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxrREFBMEMsZ0NBQWdDO0FBQzFFO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsZ0VBQXdELGtCQUFrQjtBQUMxRTtB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Ozs7O0FDcENELHdDOzs7Ozs7Ozs7OztBQ0FBLGlDOzs7Ozs7Ozs7OztBQ0FBLG9DOzs7Ozs7Ozs7OztBQ0FBLHlDOzs7Ozs7Ozs7OztBQ0FBLG1DOzs7Ozs7Ozs7OztBQ0FBLG9DOzs7Ozs7Ozs7OztBQ0FBLDBDIiwiZmlsZSI6IndlYi5idW5kbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBnZXR0ZXIgfSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uciA9IGZ1bmN0aW9uKGV4cG9ydHMpIHtcbiBcdFx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG4gXHRcdH1cbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbiBcdH07XG5cbiBcdC8vIGNyZWF0ZSBhIGZha2UgbmFtZXNwYWNlIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDE6IHZhbHVlIGlzIGEgbW9kdWxlIGlkLCByZXF1aXJlIGl0XG4gXHQvLyBtb2RlICYgMjogbWVyZ2UgYWxsIHByb3BlcnRpZXMgb2YgdmFsdWUgaW50byB0aGUgbnNcbiBcdC8vIG1vZGUgJiA0OiByZXR1cm4gdmFsdWUgd2hlbiBhbHJlYWR5IG5zIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDh8MTogYmVoYXZlIGxpa2UgcmVxdWlyZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy50ID0gZnVuY3Rpb24odmFsdWUsIG1vZGUpIHtcbiBcdFx0aWYobW9kZSAmIDEpIHZhbHVlID0gX193ZWJwYWNrX3JlcXVpcmVfXyh2YWx1ZSk7XG4gXHRcdGlmKG1vZGUgJiA4KSByZXR1cm4gdmFsdWU7XG4gXHRcdGlmKChtb2RlICYgNCkgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB2YWx1ZSAmJiB2YWx1ZS5fX2VzTW9kdWxlKSByZXR1cm4gdmFsdWU7XG4gXHRcdHZhciBucyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18ucihucyk7XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShucywgJ2RlZmF1bHQnLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2YWx1ZSB9KTtcbiBcdFx0aWYobW9kZSAmIDIgJiYgdHlwZW9mIHZhbHVlICE9ICdzdHJpbmcnKSBmb3IodmFyIGtleSBpbiB2YWx1ZSkgX193ZWJwYWNrX3JlcXVpcmVfXy5kKG5zLCBrZXksIGZ1bmN0aW9uKGtleSkgeyByZXR1cm4gdmFsdWVba2V5XTsgfS5iaW5kKG51bGwsIGtleSkpO1xuIFx0XHRyZXR1cm4gbnM7XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gXCIuL3NyYy9pbmRleC53ZWIudHNcIik7XG4iLCJpbXBvcnQge1NlcnZlcn0gZnJvbSAnLi9zZXJ2ZXIvd2ViL3NlcnZlcic7XG5pbXBvcnQge0RCfSBmcm9tICcuL3NlcnZlci9kYi9kYic7XG5cbkRCLmNyZWF0ZSgpXG4gICAgLnRoZW4oKGRiOiBEQikgPT4ge1xuXG4gICAgICAgIC8vIGRiLnVzZXJzLmluc2VydE9uZSh7X2lkOiAnYWFhYSd9KVxuICAgICAgICAvLyAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICAvLyAgICAgICAgY29uc29sZS5sb2coJ3VzZXIgY3JlYXRlZCcpO1xuICAgICAgICAvLyAgICAgfSk7XG5cbiAgICAgICAgY29uc3Qgc2VydmVyID0gbmV3IFNlcnZlcigpO1xuICAgICAgICBzZXJ2ZXIuaW5pdChkYik7XG4gICAgICAgIHNlcnZlci5zdGFydCgzMDAwKTtcbiAgICB9KTtcbiIsImltcG9ydCB7IE1vbmdvQ2xpZW50IH0gZnJvbSAnbW9uZ29kYic7XG5pbXBvcnQge1VzZXJTZXJ2aWNlfSBmcm9tICcuL3NlcnZpY2VzL3VzZXIuc2VydmljZSc7XG5pbXBvcnQgKiBhcyBfIGZyb20gJ2xvZGFzaCc7XG5cbmV4cG9ydCBjb25zdCBEQl9VUkwgPSAnJztcbmV4cG9ydCBjbGFzcyBEQiB7XG4gIHB1YmxpYyBzdGF0aWMgY3JlYXRlKHVybD86IHN0cmluZyk6IFByb21pc2U8YW55PiB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIE1vbmdvQ2xpZW50LmNvbm5lY3QodXJsIHx8IERCX1VSTCwge1xuICAgICAgICBwb29sU2l6ZTogMTAwLFxuICAgICAgICBjb25uZWN0VGltZW91dE1TOiAzMDAwMDAwLFxuICAgICAgICBzb2NrZXRUaW1lb3V0TVM6IDMwMDAwMDAsXG4gICAgICAgIGtlZXBBbGl2ZTogMzAwMDAwMCxcbiAgICAgICAgdXNlTmV3VXJsUGFyc2VyOiB0cnVlLFxuICAgICAgfSBhcyBhbnksIChlcnIsIGNsaWVudCkgPT4ge1xuICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgY29uc29sZS5sb2coZXJyKTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBkYiA9IG5ldyBEQihjbGllbnQsICdDbGVhblNwb3QnKTtcbiAgICAgICAgcmVzb2x2ZShkYik7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIHByb3RlY3RlZCBjbGllbnQ6IGFueTtcbiAgcHVibGljIGRiOiBhbnk7XG4gIHByaXZhdGUgcmVhZG9ubHkgY29sbGVjdGlvbnM7XG4gIHB1YmxpYyB1c2VyczogVXNlclNlcnZpY2UgPSBuZXcgVXNlclNlcnZpY2UoKTtcblxuICBjb25zdHJ1Y3RvcihjbGllbnQsIGRiTmFtZSA9ICdDbGVhblNwb3QnKSB7XG4gICAgdGhpcy5jbGllbnQgPSBjbGllbnQ7XG4gICAgdGhpcy5kYiA9IGNsaWVudC5kYihkYk5hbWUpO1xuICAgIHRoaXMuY29sbGVjdGlvbnMgPSB7XG4gICAgICAgIHVzZXJzOiB0aGlzLnVzZXJzLFxuICAgIH07XG4gICAgXy5mb3JFYWNoKHRoaXMuY29sbGVjdGlvbnMsIChzZXJ2aWNlLCBuYW1lKSA9PiB7XG4gICAgICAgIHRoaXMuaW5pdFNlcnZpY2Uoc2VydmljZSwgbmFtZSk7XG4gICAgfSk7XG4gIH1cblxuICBwdWJsaWMgY2xvc2UoKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG4gICAgICB0aGlzLmNsaWVudC5jbG9zZSh0cnVlLCAoKSA9PiByZXNvbHZlKCkpO1xuICAgIH0pO1xuICB9XG4gIHByaXZhdGUgaW5pdFNlcnZpY2Uoc2VydmljZSwgY29sbGVjdGlvbk5hbWUpIHtcbiAgICAgIHNlcnZpY2UuY29sbGVjdGlvbiA9IHRoaXMuZGIuY29sbGVjdGlvbihjb2xsZWN0aW9uTmFtZSk7XG4gICAgICBzZXJ2aWNlLmdldFNlcnZpY2UgPSAobmFtZSkgPT4ge1xuICAgICAgICAgIGlmICh0aGlzW25hbWVdICYmIHRoaXNbbmFtZV0uY29sbGVjdGlvbikge1xuICAgICAgICAgICAgICByZXR1cm4gdGhpc1tuYW1lXTtcbiAgICAgICAgICB9XG4gICAgICB9O1xuICB9XG59XG4iLCJpbXBvcnQge1VzZXJ9IGZyb20gJy4uLy4uLy4uL2NvbW1vbi9tb2RlbHMvdXNlcic7XG5pbXBvcnQge0lDcmVhdGVVc2VyT2JqfSBmcm9tICcuLi8uLi8uLi9jb21tb24vaW50ZXJmYWNlcy91c2VyLmludGVyZmFjZSc7XG5pbXBvcnQgKiBhcyBQYXNzd29yZEhhc2ggZnJvbSAncGFzc3dvcmQtaGFzaCc7XG5pbXBvcnQgKiBhcyBqd3QgZnJvbSAnanNvbndlYnRva2VuJztcbmltcG9ydCB7U0VDUkVUfSBmcm9tICcuLi8uLi93ZWIvYXV0aFJvdXRlcic7XG5leHBvcnQgY29uc3QgU2Vzc2lvblRva2VuRXhwaXJlc0luID0gMzYwMCAqIDI0OyAgICAvLyAyNCBob3Vyc1xuXG5leHBvcnQgY2xhc3MgVXNlclNlcnZpY2Uge1xuICAgIHB1YmxpYyBjb2xsZWN0aW9uO1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgfVxuXG4gICAgcHVibGljIGNyZWF0ZVVzZXIodXNlck9iajogSUNyZWF0ZVVzZXJPYmopIHtcbiAgICAgICAgY29uc3QgaGFzaCA9IFBhc3N3b3JkSGFzaC5nZW5lcmF0ZSh1c2VyT2JqLnBhc3N3b3JkKTtcbiAgICAgICAgY29uc3QgbmV3VXNlciA9IHtfaWQ6IHVzZXJPYmouX2lkLCBwYXNzd29yZEhhc2g6IGhhc2gsIGNyZWF0ZWRBdDogbmV3IERhdGUoKSwgdXBkYXRlZEF0OiBuZXcgRGF0ZSgpfTtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29sbGVjdGlvbi5pbnNlcnRPbmUobmV3VXNlcilcbiAgICAgICAgICAgIC50aGVuKChkYXRhKSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ld1VzZXI7XG4gICAgICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwdWJsaWMgbG9naW5Vc2VyKHVzZXI6IElDcmVhdGVVc2VyT2JqKSB7XG4gICAgICAgIGNvbnN0IHJlc09iaiA9IHtcbiAgICAgICAgICAgIHN1Y2Nlc3M6IGZhbHNlLFxuICAgICAgICAgICAgY29kZTogNDAzLFxuICAgICAgICAgICAgdG9rZW46IG51bGwsXG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiB0aGlzLmNvbGxlY3Rpb24uZmluZE9uZSh7X2lkOiB1c2VyLl9pZH0pXG4gICAgICAgICAgICAudGhlbigoZm91bmRVc2VyKSA9PiB7XG4gICAgICAgICAgICAgICBpZiAoUGFzc3dvcmRIYXNoLnZlcmlmeSh1c2VyLnBhc3N3b3JkLCBmb3VuZFVzZXIucGFzc3dvcmRIYXNoKSkge1xuICAgICAgICAgICAgICAgICAgIHJlc09iai5zdWNjZXNzID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICByZXNPYmouY29kZSA9IDIwMDtcbiAgICAgICAgICAgICAgICAgICByZXNPYmoudG9rZW4gPSBqd3Quc2lnbih7IHVzZXJJZDogdXNlci5faWQgfSwgU0VDUkVULCB7IGV4cGlyZXNJbjogU2Vzc2lvblRva2VuRXhwaXJlc0luIH0pO1xuICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgcmV0dXJuIHJlc09iajtcbiAgICAgICAgICAgIH0pO1xuICAgIH1cblxuICAgIHB1YmxpYyBmaW5kQnlJZChpZCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jb2xsZWN0aW9uLmZpbmRPbmUoe19pZDogaWR9KTtcbiAgICB9XG59XG4iLCJpbXBvcnQge0RCfSBmcm9tICcuLi8uLi9kYi9kYic7XG5cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBCYXNlQXBpIHtcbiAgICBwdWJsaWMgZGI6IERCO1xuICAgIHB1YmxpYyBhYnN0cmFjdCByZWdpc3RlclJvdXRlcyhhcHApO1xuXG4gICAgcHJvdGVjdGVkIGNvbnN0cnVjdG9yKGRiKSB7XG4gICAgICAgIHRoaXMuZGIgPSBkYjtcbiAgICB9XG59XG4iLCJpbXBvcnQge0Jhc2VBcGl9IGZyb20gJy4vYmFzZS5hcGknO1xuaW1wb3J0IHtBdXRoUm91dGVyfSBmcm9tICcuLi9hdXRoUm91dGVyJztcblxuZXhwb3J0IGNsYXNzIFVzZXJBcGkgZXh0ZW5kcyBCYXNlQXBpIHtcblxuICAgIGNvbnN0cnVjdG9yKGRiKSB7XG4gICAgICAgIHN1cGVyKGRiKTtcbiAgICB9XG4gICAgcHVibGljIHJlZ2lzdGVyUm91dGVzKGFwcCkge1xuXG4gICAgICAgIGFwcC5nZXQoJy9hcGkvdXNlcnMvOmlkJywgQXV0aFJvdXRlci5hdXRoZW50aWNhdGlvbk1pZGRsZXdhcmUodGhpcy5kYiksIHRoaXMuZ2V0VXNlci5iaW5kKHRoaXMpKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0VXNlcihyZXEsIHJlcykge1xuICAgICAgICByZXMuc2VuZCgnc3VjY2VzcycpO1xuICAgIH1cbn1cbiIsImltcG9ydCAqIGFzIGp3dCBmcm9tICdqc29ud2VidG9rZW4nO1xuZXhwb3J0IGNvbnN0IFNFQ1JFVCA9ICdiMjEyNWQzNDhlMDk0Y2U3YmQ0MzkyNWQ1ZjZiMTJmOGViZWYyNTdmYjBiOTQ1MTNhOWY1OGE3M2QxZjQ1OWQ4JztcblxuZXhwb3J0IGNsYXNzIEF1dGhSb3V0ZXIge1xuXG4gICAgcHVibGljIHN0YXRpYyBhdXRoZW50aWNhdGlvbk1pZGRsZXdhcmUoZGIpIHtcbiAgICAgICAgcmV0dXJuIChyZXEsIHJlcywgbmV4dCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgdG9rZW4gPSByZXEuaGVhZGVycy5hdXRob3JpemF0aW9uIHx8IHJlcS5oZWFkZXJzWyd4LWFjY2Vzcy10b2tlbiddIHx8IHJlcS5xdWVyeS50b2tlbiB8fFxuICAgICAgICAgICAgICAgIHJlcS5ib2R5LnRva2VuO1xuICAgICAgICAgICAgZGVsZXRlIHJlcS5xdWVyeS50b2tlbjtcblxuICAgICAgICAgICAgY29uc3QgcmVzcG9uc2UgPSB7XG4gICAgICAgICAgICAgICAgc3VjY2VzczogZmFsc2UsXG4gICAgICAgICAgICAgICAgbXNnOiAnRmFpbGVkIHRvIGF1dGhlbnRpY2F0ZSB0b2tlbi4nLFxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgLy8gZGVjb2RlIHRva2VuXG4gICAgICAgICAgICBpZiAoIXRva2VuKSB7XG4gICAgICAgICAgICAgICAgcmVzLnN0YXR1cyg0MDEpLnNlbmQocmVzcG9uc2UpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBqd3QudmVyaWZ5KHRva2VuLCBTRUNSRVQsIChlcnIsIGRlY29kZWQpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzLnN0YXR1cyg0MDEpLnNlbmQocmVzcG9uc2UpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gaWYgZXZlcnl0aGluZyBpcyBnb29kLCBzYXZlIHRvIHJlcXVlc3QgZm9yIHVzZSBpbiBvdGhlciByb3V0ZXNcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlcS5zZXNzaW9uID0gcmVxLnNlc3Npb24gfHwge307XG4gICAgICAgICAgICAgICAgICAgICAgICBkYi51c2Vycy5maW5kQnlJZChkZWNvZGVkLnVzZXJJZClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAudGhlbigodXNlcikgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXEuc2Vzc2lvbi51c2VyID0gdXNlcjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV4dCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfVxuXG5cbn1cbiIsImltcG9ydCAqIGFzIGV4cHJlc3MgZnJvbSAnZXhwcmVzcyc7XG5pbXBvcnQgKiBhcyBQYXJzZXIgZnJvbSAnYm9keS1wYXJzZXInO1xuaW1wb3J0ICogYXMgY29ycyBmcm9tICdjb3JzJztcbmltcG9ydCB7VXNlckFwaX0gZnJvbSAnLi9hcGkvdXNlci5hcGknO1xuaW1wb3J0IHtCYXNlQXBpfSBmcm9tICcuL2FwaS9iYXNlLmFwaSc7XG5pbXBvcnQge1Nlc3Npb25BcGl9IGZyb20gJy4vc2Vzc2lvbi9zZXNzaW9uLmFwaSc7XG5pbXBvcnQge0RCfSBmcm9tICcuLi9kYi9kYic7XG5cbmV4cG9ydCBjbGFzcyBTZXJ2ZXIge1xuXG4gICAgcHVibGljIGRiOiBEQjtcbiAgICBwdWJsaWMgYXBwO1xuICAgIHB1YmxpYyBzZXJ2ZXI7XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICB9XG4gICAgcHVibGljIGluaXQoZGIpIHtcbiAgICAgICAgdGhpcy5kYiA9IGRiO1xuICAgICAgICB0aGlzLmFwcCA9IGV4cHJlc3MoKTtcbiAgICAgICAgdGhpcy5hcHAudXNlKFBhcnNlci5qc29uKHsgbGltaXQ6ICc1MG1iJyB9KSk7XG4gICAgICAgIHRoaXMuYXBwLnVzZShQYXJzZXIudXJsZW5jb2RlZCh7IGxpbWl0OiAnNTBtYicsIGV4dGVuZGVkOiB0cnVlIH0pKTtcbiAgICAgICAgdGhpcy5hcHAudXNlKGNvcnMoKSk7XG5cbiAgICAgICAgdGhpcy5pbml0QXBpKHRoaXMuZGIpO1xuICAgIH1cblxuICAgIHB1YmxpYyBzdGFydChwb3J0OiBudW1iZXIgPSAzMDAwKTogUHJvbWlzZTxhbnk+IHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIHRoaXMuYXBwLmdldCgnLycsIChyZXEsIHJlcykgPT4gcmVzLnNlbmQoJ0hlbGxvIFdvcmxkIScpKVxuXG4gICAgICAgICAgICB0aGlzLnNlcnZlciA9IHRoaXMuYXBwLmxpc3Rlbihwb3J0LCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coYFdlYlNlcnZlciBsaXN0ZW5pbmcgb24gcG9ydCAke3BvcnR9YCk7XG4gICAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHB1YmxpYyBpbml0QXBpKGRiKSB7XG4gICAgICAgIGNvbnN0IGFwaXM6IEJhc2VBcGkgW10gPSBbXG4gICAgICAgICAgICBuZXcgVXNlckFwaShkYiksXG4gICAgICAgICAgICBuZXcgU2Vzc2lvbkFwaShkYiksXG4gICAgICAgIF07XG4gICAgICAgIHRoaXMucmVnaXN0ZXJSb3V0ZXMoYXBpcyk7XG4gICAgfVxuXG4gICAgcHVibGljIHJlZ2lzdGVyUm91dGVzKGFwaXM6IEJhc2VBcGkgW10pIHtcbiAgICAgICAgYXBpcy5mb3JFYWNoKChhcGkpID0+IHtcbiAgICAgICAgICAgYXBpLnJlZ2lzdGVyUm91dGVzKHRoaXMuYXBwKTtcbiAgICAgICAgfSk7XG4gICAgfVxufVxuIiwiaW1wb3J0IHtBdXRoUm91dGVyfSBmcm9tICcuLi9hdXRoUm91dGVyJztcbmltcG9ydCB7QmFzZUFwaX0gZnJvbSAnLi4vYXBpL2Jhc2UuYXBpJztcblxuZXhwb3J0IGNsYXNzIFNlc3Npb25BcGkgZXh0ZW5kcyBCYXNlQXBpIHtcblxuICAgIGNvbnN0cnVjdG9yKGRiKSB7XG4gICAgICAgIHN1cGVyKGRiKTtcbiAgICB9XG4gICAgcHVibGljIHJlZ2lzdGVyUm91dGVzKGFwcCkge1xuXG4gICAgICAgIGFwcC5wb3N0KCcvYXBpL3VzZXJzLzppZC9jcmVhdGUnLCB0aGlzLmNyZWF0ZVVzZXIuYmluZCh0aGlzKSk7XG4gICAgICAgIGFwcC5wb3N0KCcvYXBpL3VzZXJzLzppZC9sb2dpbicsIHRoaXMubG9naW4uYmluZCh0aGlzKSk7XG4gICAgfVxuXG4gICAgcHVibGljIGNyZWF0ZVVzZXIocmVxLCByZXMpIHtcbiAgICAgICAgaWYgKCFyZXEucGFyYW1zLmlkIHx8ICFyZXEuYm9keS5wYXNzd29yZCkge1xuICAgICAgICAgICAgcmVzLnNlbmRTdGF0dXMoNDAwKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmRiLnVzZXJzLmNyZWF0ZVVzZXIoe19pZDogcmVxLnBhcmFtcy5pZCwgcGFzc3dvcmQ6IHJlcS5ib2R5LnBhc3N3b3JkfSlcbiAgICAgICAgICAgIC50aGVuKCh1c2VyKSA9PiB7XG4gICAgICAgICAgICAgICAgcmVzLnNlbmQodXNlcik7XG4gICAgICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwdWJsaWMgbG9naW4ocmVxLCByZXMpIHtcbiAgICAgICAgaWYgKCFyZXEucGFyYW1zLmlkIHx8ICFyZXEuYm9keS5wYXNzd29yZCkge1xuICAgICAgICAgICAgcmVzLnNlbmRTdGF0dXMoNDAwKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmRiLnVzZXJzLmxvZ2luVXNlcih7X2lkOiByZXEucGFyYW1zLmlkLCBwYXNzd29yZDogcmVxLmJvZHkucGFzc3dvcmR9KVxuICAgICAgICAgICAgLnRoZW4oKHJlc3BvbnNlKSA9PiB7XG4gICAgICAgICAgICAgICAgcmVzLnN0YXR1cyhyZXNwb25zZS5jb2RlKS5zZW5kKHJlc3BvbnNlKTtcbiAgICAgICAgICAgIH0pO1xuICAgIH1cblxufVxuIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiYm9keS1wYXJzZXJcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiY29yc1wiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJleHByZXNzXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImpzb253ZWJ0b2tlblwiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJsb2Rhc2hcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwibW9uZ29kYlwiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJwYXNzd29yZC1oYXNoXCIpOyJdLCJzb3VyY2VSb290IjoiIn0=