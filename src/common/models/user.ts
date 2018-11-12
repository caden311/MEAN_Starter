import * as _ from 'lodash';

export class User {

    constructor(data = {}) {
        _.assign(this, data);
    }

    public _id: string;
    public username?: string;
    public firstname?: string;
    public lastname?: string;
    public phone?: string;
    public passwordHash?: string;
    public activatedOn?: Date;
    public lastLogon?: Date;
    public lastLogoff?: Date;
    public createdAt?: Date;
    public updatedAt?: Date;

}
