import {BaseApi} from './base.api';
import {AuthRouter} from '../authRouter';

export class UserApi extends BaseApi {

    constructor(db) {
        super(db);
    }
    public registerRoutes(app) {

        app.get('/api/users/:id', AuthRouter.authenticationMiddleware(this.db), this.getUser.bind(this));
    }

    public getUser(req, res) {
        res.send('success');
    }
}
