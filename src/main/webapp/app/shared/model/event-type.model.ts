export interface IEventType {
    id?: number;
    name?: string;
    description?: string;
}

export class EventType implements IEventType {
    constructor(public id?: number, public name?: string, public description?: string) {}
}
