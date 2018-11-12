"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("./server/web/server");
const db_1 = require("./server/db/db");
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
//# sourceMappingURL=index.web.js.map