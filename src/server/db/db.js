"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
const user_service_1 = require("./services/user.service");
const _ = require("lodash");
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
//# sourceMappingURL=DB.js.map