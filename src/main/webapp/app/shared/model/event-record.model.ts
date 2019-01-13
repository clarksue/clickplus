import { IUser } from 'app/core/user/user.model';
import { IEventType } from 'app/shared/model//event-type.model';

export interface IEventRecord {
    id?: number;
    user?: IUser;
    eventType?: IEventType;
}

export class EventRecord implements IEventRecord {
    constructor(public id?: number, public user?: IUser, public eventType?: IEventType) {}
}
