"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const PasswordHash = require("password-hash");
const jwt = require("jsonwebtoken");
const authRouter_1 = require("../../web/authRouter");
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
//# sourceMappingURL=user.service.js.map