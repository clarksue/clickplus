import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IEventRecord } from 'app/shared/model/event-record.model';

@Component({
    selector: 'jhi-event-record-detail',
    templateUrl: './event-record-detail.component.html'
})
export class EventRecordDetailComponent implements OnInit {
    eventRecord: IEventRecord;

    constructor(protected activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ eventRecord }) => {
            this.eventRecord = eventRecord;
        });
    }

    previousState() {
        window.history.back();
    }
}
