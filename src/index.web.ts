import {Server} from './server/web/server';
import {DB} from './server/db/db';

DB.create()
    .then((db: DB) => {

        // db.users.insertOne({_id: 'aaaa'})
        //     .then(() => {
        //        console.log('user created');
        //     });

        const server = new Server();
        server.init(db);
        server.start(3000);
    });
