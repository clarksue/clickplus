import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';

import { IEventType } from 'app/shared/model/event-type.model';
import { EventTypeService } from './event-type.service';

@Component({
    selector: 'jhi-event-type-update',
    templateUrl: './event-type-update.component.html'
})
export class EventTypeUpdateComponent implements OnInit {
    eventType: IEventType;
    isSaving: boolean;
    createdAt: string;
    updatedAt: string;

    constructor(protected eventTypeService: EventTypeService, protected activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ eventType }) => {
            this.eventType = eventType;
            this.createdAt = this.eventType.createdAt != null ? this.eventType.createdAt.format(DATE_TIME_FORMAT) : null;
            this.updatedAt = this.eventType.updatedAt != null ? this.eventType.updatedAt.format(DATE_TIME_FORMAT) : null;
        });
    }

    previousState() {
        window.history.back();
    }

    save() {
        this.isSaving = true;
        this.eventType.createdAt = this.createdAt != null ? moment(this.createdAt, DATE_TIME_FORMAT) : null;
        this.eventType.updatedAt = this.updatedAt != null ? moment(this.updatedAt, DATE_TIME_FORMAT) : null;
        if (this.eventType.id !== undefined) {
            this.subscribeToSaveResponse(this.eventTypeService.update(this.eventType));
        } else {
            this.subscribeToSaveResponse(this.eventTypeService.create(this.eventType));
        }
    }

    protected subscribeToSaveResponse(result: Observable<HttpResponse<IEventType>>) {
        result.subscribe((res: HttpResponse<IEventType>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
    }

    protected onSaveSuccess() {
        this.isSaving = false;
        this.previousState();
    }

    protected onSaveError() {
        this.isSaving = false;
    }
}
