import {AuthRouter} from '../authRouter';
import {BaseApi} from '../api/base.api';

export class SessionApi extends BaseApi {

    constructor(db) {
        super(db);
    }
    public registerRoutes(app) {

        app.post('/api/users/:id/create', this.createUser.bind(this));
        app.post('/api/users/:id/login', this.login.bind(this));
    }

    public createUser(req, res) {
        if (!req.params.id || !req.body.password) {
            res.sendStatus(400);
            return;
        }
        this.db.users.createUser({_id: req.params.id, password: req.body.password})
            .then((user) => {
                res.send(user);
            });
    }

    public login(req, res) {
        if (!req.params.id || !req.body.password) {
            res.sendStatus(400);
            return;
        }
        this.db.users.loginUser({_id: req.params.id, password: req.body.password})
            .then((response) => {
                res.status(response.code).send(response);
            });
    }

}
