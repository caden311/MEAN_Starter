import {DB} from '../../db/db';

export abstract class BaseApi {
    public db: DB;
    public abstract registerRoutes(app);

    protected constructor(db) {
        this.db = db;
    }
}
