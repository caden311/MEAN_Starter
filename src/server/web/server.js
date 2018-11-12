"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const Parser = require("body-parser");
const cors = require("cors");
const user_api_1 = require("./api/user.api");
const session_api_1 = require("./session/session.api");
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
//# sourceMappingURL=server.js.map