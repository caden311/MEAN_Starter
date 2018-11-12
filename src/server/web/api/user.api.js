"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const base_api_1 = require("./base.api");
const authRouter_1 = require("../authRouter");
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
//# sourceMappingURL=user.api.js.map