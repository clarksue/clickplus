import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

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
        return this.http.post<IEventRecord>(this.resourceUrl, eventRecord, { observe: 'response' });
    }

    update(eventRecord: IEventRecord): Observable<EntityResponseType> {
        return this.http.put<IEventRecord>(this.resourceUrl, eventRecord, { observe: 'response' });
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<IEventRecord>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    query(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http.get<IEventRecord[]>(this.resourceUrl, { params: options, observe: 'response' });
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    search(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http.get<IEventRecord[]>(this.resourceSearchUrl, { params: options, observe: 'response' });
    }
}
