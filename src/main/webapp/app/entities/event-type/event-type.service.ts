import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { DATE_FORMAT } from 'app/shared/constants/input.constants';
import { map } from 'rxjs/operators';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { IEventType } from 'app/shared/model/event-type.model';

type EntityResponseType = HttpResponse<IEventType>;
type EntityArrayResponseType = HttpResponse<IEventType[]>;

@Injectable({ providedIn: 'root' })
export class EventTypeService {
    public resourceUrl = SERVER_API_URL + 'api/event-types';
    public resourceSearchUrl = SERVER_API_URL + 'api/_search/event-types';

    constructor(protected http: HttpClient) {}

    create(eventType: IEventType): Observable<EntityResponseType> {
        const copy = this.convertDateFromClient(eventType);
        return this.http
            .post<IEventType>(this.resourceUrl, copy, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    createByName(eventTypeName: string): Observable<EntityResponseType> {
        return this.http
            .post<IEventType>(this.resourceUrl + '/login-user', eventTypeName, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    update(eventType: IEventType): Observable<EntityResponseType> {
        const copy = this.convertDateFromClient(eventType);
        return this.http
            .put<IEventType>(this.resourceUrl, copy, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http
            .get<IEventType>(`${this.resourceUrl}/${id}`, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    query(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http
            .get<IEventType[]>(this.resourceUrl, { params: options, observe: 'response' })
            .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
    }

    queryLogin(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http
            .get<IEventType[]>(this.resourceUrl + '/login-user', { params: options, observe: 'response' })
            .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    search(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http
            .get<IEventType[]>(this.resourceSearchUrl, { params: options, observe: 'response' })
            .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
    }

    protected convertDateFromClient(eventType: IEventType): IEventType {
        const copy: IEventType = Object.assign({}, eventType, {
            createdAt: eventType.createdAt != null && eventType.createdAt.isValid() ? eventType.createdAt.toJSON() : null,
            updatedAt: eventType.updatedAt != null && eventType.updatedAt.isValid() ? eventType.updatedAt.toJSON() : null
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
            res.body.forEach((eventType: IEventType) => {
                eventType.createdAt = eventType.createdAt != null ? moment(eventType.createdAt) : null;
                eventType.updatedAt = eventType.updatedAt != null ? moment(eventType.updatedAt) : null;
            });
        }
        return res;
    }
}
