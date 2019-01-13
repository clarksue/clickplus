import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { DATE_FORMAT } from 'app/shared/constants/input.constants';
import { map } from 'rxjs/operators';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { IEventRecord } from 'app/shared/model/event-record.model';

type EntityResponseType = HttpResponse<IEventRecord>;
type EntityArrayResponseType = HttpResponse<IEventRecord[]>;

@Injectable({ providedIn: 'root' })
export class EventRecordService {
    public resourceUrl = SERVER_API_URL + 'api/event-records';
    public resourceSearchUrl = SERVER_API_URL + 'api/_search/event-records';

    constructor(protected http: HttpClient) {}

    create(eventRecord: IEventRecord): Observable<EntityResponseType> {
        const copy = this.convertDateFromClient(eventRecord);
        return this.http
            .post<IEventRecord>(this.resourceUrl, copy, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    update(eventRecord: IEventRecord): Observable<EntityResponseType> {
        const copy = this.convertDateFromClient(eventRecord);
        return this.http
            .put<IEventRecord>(this.resourceUrl, copy, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http
            .get<IEventRecord>(`${this.resourceUrl}/${id}`, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    query(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http
            .get<IEventRecord[]>(this.resourceUrl, { params: options, observe: 'response' })
            .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    search(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http
            .get<IEventRecord[]>(this.resourceSearchUrl, { params: options, observe: 'response' })
            .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
    }

    protected convertDateFromClient(eventRecord: IEventRecord): IEventRecord {
        const copy: IEventRecord = Object.assign({}, eventRecord, {
            createdAt: eventRecord.createdAt != null && eventRecord.createdAt.isValid() ? eventRecord.createdAt.toJSON() : null,
            updatedAt: eventRecord.updatedAt != null && eventRecord.updatedAt.isValid() ? eventRecord.updatedAt.toJSON() : null
        });
        return copy;
    }

    protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
        if (res.body) {
            res.body.createdAt = res.body.createdAt != null ? moment(res.body.createdAt) : null;
            res.body.updatedAt = res.body.updatedAt != null ? moment(res.body.updatedAt) : null;
        }
        return res;
    }

    protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
        if (res.body) {
            res.body.forEach((eventRecord: IEventRecord) => {
                eventRecord.createdAt = eventRecord.createdAt != null ? moment(eventRecord.createdAt) : null;
                eventRecord.updatedAt = eventRecord.updatedAt != null ? moment(eventRecord.updatedAt) : null;
            });
        }
        return res;
    }
}
