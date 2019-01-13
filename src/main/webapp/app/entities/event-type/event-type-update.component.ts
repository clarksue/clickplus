import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { IEventType } from 'app/shared/model/event-type.model';
import { EventTypeService } from './event-type.service';

@Component({
    selector: 'jhi-event-type-update',
    templateUrl: './event-type-update.component.html'
})
export class EventTypeUpdateComponent implements OnInit {
    eventType: IEventType;
    isSaving: boolean;

    constructor(protected eventTypeService: EventTypeService, protected activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ eventType }) => {
            this.eventType = eventType;
        });
    }

    previousState() {
        window.history.back();
    }

    save() {
        this.isSaving = true;
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
