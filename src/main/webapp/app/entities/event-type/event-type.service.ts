import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

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
        return this.http.post<IEventType>(this.resourceUrl, eventType, { observe: 'response' });
    }

    update(eventType: IEventType): Observable<EntityResponseType> {
        return this.http.put<IEventType>(this.resourceUrl, eventType, { observe: 'response' });
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<IEventType>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    query(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http.get<IEventType[]>(this.resourceUrl, { params: options, observe: 'response' });
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    search(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http.get<IEventType[]>(this.resourceSearchUrl, { params: options, observe: 'response' });
    }
}
