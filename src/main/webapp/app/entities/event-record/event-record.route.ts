import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { JhiPaginationUtil, JhiResolvePagingParams } from 'ng-jhipster';
import { UserRouteAccessService } from 'app/core';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { EventRecord } from 'app/shared/model/event-record.model';
import { EventRecordService } from './event-record.service';
import { EventRecordComponent } from './event-record.component';
import { EventRecordDetailComponent } from './event-record-detail.component';
import { EventRecordUpdateComponent } from './event-record-update.component';
import { EventRecordDeletePopupComponent } from './event-record-delete-dialog.component';
import { IEventRecord } from 'app/shared/model/event-record.model';

@Injectable({ providedIn: 'root' })
export class EventRecordResolve implements Resolve<IEventRecord> {
    constructor(private service: EventRecordService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<EventRecord> {
        const id = route.params['id'] ? route.params['id'] : null;
        if (id) {
            return this.service.find(id).pipe(
                filter((response: HttpResponse<EventRecord>) => response.ok),
                map((eventRecord: HttpResponse<EventRecord>) => eventRecord.body)
            );
        }
        return of(new EventRecord());
    }
}

export const eventRecordRoute: Routes = [
    {
        path: 'event-record',
        component: EventRecordComponent,
        resolve: {
            pagingParams: JhiResolvePagingParams
        },
        data: {
            authorities: ['ROLE_USER'],
            defaultSort: 'id,asc',
            pageTitle: 'clickplusApp.eventRecord.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'event-record/:id/view',
        component: EventRecordDetailComponent,
        resolve: {
            eventRecord: EventRecordResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'clickplusApp.eventRecord.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'event-record/new',
        component: EventRecordUpdateComponent,
        resolve: {
            eventRecord: EventRecordResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'clickplusApp.eventRecord.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'event-record/:id/edit',
        component: EventRecordUpdateComponent,
        resolve: {
            eventRecord: EventRecordResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'clickplusApp.eventRecord.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const eventRecordPopupRoute: Routes = [
    {
        path: 'event-record/:id/delete',
        component: EventRecordDeletePopupComponent,
        resolve: {
            eventRecord: EventRecordResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'clickplusApp.eventRecord.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
