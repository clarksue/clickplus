import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { JhiAlertService } from 'ng-jhipster';

import { IEventRecord } from 'app/shared/model/event-record.model';
import { EventRecordService } from './event-record.service';
import { IUser, UserService } from 'app/core';
import { IEventType } from 'app/shared/model/event-type.model';
import { EventTypeService } from 'app/entities/event-type';

@Component({
    selector: 'jhi-event-record-update',
    templateUrl: './event-record-update.component.html'
})
export class EventRecordUpdateComponent implements OnInit {
    eventRecord: IEventRecord;
    isSaving: boolean;

    users: IUser[];

    eventtypes: IEventType[];

    constructor(
        protected jhiAlertService: JhiAlertService,
        protected eventRecordService: EventRecordService,
        protected userService: UserService,
        protected eventTypeService: EventTypeService,
        protected activatedRoute: ActivatedRoute
    ) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ eventRecord }) => {
            this.eventRecord = eventRecord;
        });
        this.userService.query().subscribe(
            (res: HttpResponse<IUser[]>) => {
                this.users = res.body;
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
        this.eventTypeService.query().subscribe(
            (res: HttpResponse<IEventType[]>) => {
                this.eventtypes = res.body;
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
    }

    previousState() {
        window.history.back();
    }

    save() {
        this.isSaving = true;
        if (this.eventRecord.id !== undefined) {
            this.subscribeToSaveResponse(this.eventRecordService.update(this.eventRecord));
        } else {
            this.subscribeToSaveResponse(this.eventRecordService.create(this.eventRecord));
        }
    }

    protected subscribeToSaveResponse(result: Observable<HttpResponse<IEventRecord>>) {
        result.subscribe((res: HttpResponse<IEventRecord>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
    }

    protected onSaveSuccess() {
        this.isSaving = false;
        this.previousState();
    }

    protected onSaveError() {
        this.isSaving = false;
    }

    protected onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }

    trackUserById(index: number, item: IUser) {
        return item.id;
    }

    trackEventTypeById(index: number, item: IEventType) {
        return item.id;
    }
}
