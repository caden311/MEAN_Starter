import {User} from '../../../common/models/user';
import {ICreateUserObj} from '../../../common/interfaces/user.interface';
import * as PasswordHash from 'password-hash';
import * as jwt from 'jsonwebtoken';
import {SECRET} from '../../web/authRouter';
export const SessionTokenExpiresIn = 3600 * 24;    // 24 hours

export class UserService {
    public collection;

    constructor() {
    }

    public createUser(userObj: ICreateUserObj) {
        const hash = PasswordHash.generate(userObj.password);
        const newUser = {_id: userObj._id, passwordHash: hash, createdAt: new Date(), updatedAt: new Date()};
        return this.collection.insertOne(newUser)
            .then((data) => {
                return newUser;
            });
    }

    public loginUser(user: ICreateUserObj) {
        const resObj = {
            success: false,
            code: 403,
            token: null,
        };
        return this.collection.findOne({_id: user._id})
            .then((foundUser) => {
               if (PasswordHash.verify(user.password, foundUser.passwordHash)) {
                   resObj.success = true;
                   resObj.code = 200;
                   resObj.token = jwt.sign({ userId: user._id }, SECRET, { expiresIn: SessionTokenExpiresIn });
               }
               return resObj;
            });
    }

    public findById(id) {
        return this.collection.findOne({_id: id});
    }
}
