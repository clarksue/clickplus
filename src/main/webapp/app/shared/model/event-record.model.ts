import { Moment } from 'moment';
import { IUser } from 'app/core/user/user.model';
import { IEventType } from 'app/shared/model//event-type.model';

export interface IEventRecord {
    id?: number;
    createdAt?: Moment;
    updatedAt?: Moment;
    user?: IUser;
    eventType?: IEventType;
}

export class EventRecord implements IEventRecord {
    constructor(
        public id?: number,
        public createdAt?: Moment,
        public updatedAt?: Moment,
        public user?: IUser,
        public eventType?: IEventType
    ) {}
}
