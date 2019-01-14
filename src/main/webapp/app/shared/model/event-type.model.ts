import { Moment } from 'moment';
import { IUser } from 'app/core/user/user.model';

export interface IEventType {
    id?: number;
    name?: string;
    description?: string;
    createdAt?: Moment;
    updatedAt?: Moment;
    user?: IUser;
}

export class EventType implements IEventType {
    constructor(
        public id?: number,
        public name?: string,
        public description?: string,
        public createdAt?: Moment,
        public updatedAt?: Moment,
        public user?: IUser
    ) {}
}
