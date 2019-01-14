import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ClickplusSharedModule } from 'app/shared';
import { ClickplusAdminModule } from 'app/admin/admin.module';
import {
    EventTypeComponent,
    EventTypeDetailComponent,
    EventTypeUpdateComponent,
    EventTypeDeletePopupComponent,
    EventTypeDeleteDialogComponent,
    eventTypeRoute,
    eventTypePopupRoute
} from './';

const ENTITY_STATES = [...eventTypeRoute, ...eventTypePopupRoute];

@NgModule({
    imports: [ClickplusSharedModule, ClickplusAdminModule, RouterModule.forChild(ENTITY_STATES)],
    declarations: [
        EventTypeComponent,
        EventTypeDetailComponent,
        EventTypeUpdateComponent,
        EventTypeDeleteDialogComponent,
        EventTypeDeletePopupComponent
    ],
    entryComponents: [EventTypeComponent, EventTypeUpdateComponent, EventTypeDeleteDialogComponent, EventTypeDeletePopupComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ClickplusEventTypeModule {}
