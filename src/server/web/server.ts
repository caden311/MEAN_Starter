import * as express from 'express';
import * as Parser from 'body-parser';
import * as cors from 'cors';
import {DB} from '../db/DB';
import {UserApi} from './api/user.api';
import {BaseApi} from './api/base.api';
import {SessionApi} from './session/session.api';

export class Server {

    public db: DB;
    public app;
    public server;

    constructor() {
    }
    public init(db) {
        this.db = db;
        this.app = express();
        this.app.use(Parser.json({ limit: '50mb' }));
        this.app.use(Parser.urlencoded({ limit: '50mb', extended: true }));
        this.app.use(cors());

        this.initApi(this.db);
    }

    public start(port: number = 3000): Promise<any> {
        return new Promise((resolve, reject) => {
            this.app.get('/', (req, res) => res.send('Hello World!'))

            this.server = this.app.listen(port, () => {
                console.log(`WebServer listening on port ${port}`);
                resolve();
            });
        });
    }

    public initApi(db) {
        const apis: BaseApi [] = [
            new UserApi(db),
            new SessionApi(db),
        ];
        this.registerRoutes(apis);
    }

    public registerRoutes(apis: BaseApi []) {
        apis.forEach((api) => {
           api.registerRoutes(this.app);
        });
    }
}
