import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ClickplusSharedModule } from 'app/shared';
import { ClickplusAdminModule } from 'app/admin/admin.module';
import {
    EventRecordComponent,
    EventRecordDetailComponent,
    EventRecordUpdateComponent,
    EventRecordDeletePopupComponent,
    EventRecordDeleteDialogComponent,
    eventRecordRoute,
    eventRecordPopupRoute
} from './';

const ENTITY_STATES = [...eventRecordRoute, ...eventRecordPopupRoute];

@NgModule({
    imports: [ClickplusSharedModule, ClickplusAdminModule, RouterModule.forChild(ENTITY_STATES)],
    declarations: [
        EventRecordComponent,
        EventRecordDetailComponent,
        EventRecordUpdateComponent,
        EventRecordDeleteDialogComponent,
        EventRecordDeletePopupComponent
    ],
    entryComponents: [EventRecordComponent, EventRecordUpdateComponent, EventRecordDeleteDialogComponent, EventRecordDeletePopupComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ClickplusEventRecordModule {}
