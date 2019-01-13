import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { JhiPaginationUtil, JhiResolvePagingParams } from 'ng-jhipster';
import { UserRouteAccessService } from 'app/core';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { EventType } from 'app/shared/model/event-type.model';
import { EventTypeService } from './event-type.service';
import { EventTypeComponent } from './event-type.component';
import { EventTypeDetailComponent } from './event-type-detail.component';
import { EventTypeUpdateComponent } from './event-type-update.component';
import { EventTypeDeletePopupComponent } from './event-type-delete-dialog.component';
import { IEventType } from 'app/shared/model/event-type.model';

@Injectable({ providedIn: 'root' })
export class EventTypeResolve implements Resolve<IEventType> {
    constructor(private service: EventTypeService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<EventType> {
        const id = route.params['id'] ? route.params['id'] : null;
        if (id) {
            return this.service.find(id).pipe(
                filter((response: HttpResponse<EventType>) => response.ok),
                map((eventType: HttpResponse<EventType>) => eventType.body)
            );
        }
        return of(new EventType());
    }
}

export const eventTypeRoute: Routes = [
    {
        path: 'event-type',
        component: EventTypeComponent,
        resolve: {
            pagingParams: JhiResolvePagingParams
        },
        data: {
            authorities: ['ROLE_USER'],
            defaultSort: 'id,asc',
            pageTitle: 'clickplusApp.eventType.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'event-type/:id/view',
        component: EventTypeDetailComponent,
        resolve: {
            eventType: EventTypeResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'clickplusApp.eventType.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'event-type/new',
        component: EventTypeUpdateComponent,
        resolve: {
            eventType: EventTypeResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'clickplusApp.eventType.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'event-type/:id/edit',
        component: EventTypeUpdateComponent,
        resolve: {
            eventType: EventTypeResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'clickplusApp.eventType.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const eventTypePopupRoute: Routes = [
    {
        path: 'event-type/:id/delete',
        component: EventTypeDeletePopupComponent,
        resolve: {
            eventType: EventTypeResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'clickplusApp.eventType.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
