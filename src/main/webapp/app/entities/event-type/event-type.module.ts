import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ClickplusSharedModule } from 'app/shared';
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
    imports: [ClickplusSharedModule, RouterModule.forChild(ENTITY_STATES)],
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
