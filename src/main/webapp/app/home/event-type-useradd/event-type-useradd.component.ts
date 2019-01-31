import { Component, OnInit } from '@angular/core';
import { IEventType } from 'app/shared/model/event-type.model';
import { EventTypeService } from 'app/entities/event-type';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

@Component({
    selector: 'jhi-event-type-useradd',
    templateUrl: './event-type-useradd.component.html',
    styles: []
})
export class EventTypeUseraddComponent implements OnInit {
    eventTypeName: string;
    eventType: IEventType;

    constructor(protected eventTypeService: EventTypeService) {}

    ngOnInit() {}

    save() {
        this.eventTypeService
            .createByName(this.eventTypeName)
            .subscribe((res: HttpResponse<IEventType>) => {}, (res: HttpErrorResponse) => {});
    }
}
