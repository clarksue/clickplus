import { Moment } from 'moment';

export interface IEventType {
    id?: number;
    name?: string;
    description?: string;
    createdAt?: Moment;
    updatedAt?: Moment;
}

export class EventType implements IEventType {
    constructor(
        public id?: number,
        public name?: string,
        public description?: string,
        public createdAt?: Moment,
        public updatedAt?: Moment
    ) {}
}
