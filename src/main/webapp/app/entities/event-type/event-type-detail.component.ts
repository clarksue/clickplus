import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IEventType } from 'app/shared/model/event-type.model';

@Component({
    selector: 'jhi-event-type-detail',
    templateUrl: './event-type-detail.component.html'
})
export class EventTypeDetailComponent implements OnInit {
    eventType: IEventType;

    constructor(protected activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ eventType }) => {
            this.eventType = eventType;
        });
    }

    previousState() {
        window.history.back();
    }
}
