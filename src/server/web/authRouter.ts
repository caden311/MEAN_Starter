import * as jwt from 'jsonwebtoken';
export const SECRET = 'b2125d348e094ce7bd43925d5f6b12f8ebef257fb0b94513a9f58a73d1f459d8';

export class AuthRouter {

    public static authenticationMiddleware(db) {
        return (req, res, next) => {
            const token = req.headers.authorization || req.headers['x-access-token'] || req.query.token ||
                req.body.token;
            delete req.query.token;

            const response = {
                success: false,
                msg: 'Failed to authenticate token.',
            };

            // decode token
            if (!token) {
                res.status(401).send(response);
            } else {
                jwt.verify(token, SECRET, (err, decoded) => {
                    if (err) {
                        res.status(401).send(response);
                    } else {
                        // if everything is good, save to request for use in other routes
                        req.session = req.session || {};
                        db.users.findById(decoded.userId)
                            .then((user) => {
                                req.session.user = user;
                                next();
                            });
                    }
                });
            }
        };
    }


}
