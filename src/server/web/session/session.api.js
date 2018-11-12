"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const base_api_1 = require("../api/base.api");
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
//# sourceMappingURL=session.api.js.map