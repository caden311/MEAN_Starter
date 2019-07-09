import { MongoClient } from 'mongodb';
import {UserService} from './services/user.service';
import * as _ from 'lodash';

export const DB_URL = '';
export class DB {
  public static create(url?: string): Promise<any> {
    return new Promise((resolve, reject) => {
      MongoClient.connect(url || DB_URL, {
        poolSize: 100,
        connectTimeoutMS: 3000000,
        socketTimeoutMS: 3000000,
        keepAlive: 3000000,
        useNewUrlParser: true,
      } as any, (err, client) => {
        if (err) {
          console.log(err);
        }
        const db = new DB(client, 'CleanSpot');
        resolve(db);
      });
    });
  }

  protected client: any;
  public db: any;
  private readonly collections;
  public users: UserService = new UserService();

  constructor(client, dbName = 'CleanSpot') {
    this.client = client;
    this.db = client.db(dbName);
    this.collections = {
        users: this.users,
    };
    _.forEach(this.collections, (service, name) => {
        this.initService(service, name);
    });
  }

  public close() {
    return new Promise((resolve) => {
      this.client.close(true, () => resolve());
    });
  }
  private initService(service, collectionName) {
      service.collection = this.db.collection(collectionName);
      service.getService = (name) => {
          if (this[name] && this[name].collection) {
              return this[name];
          }
      };
  }
}
