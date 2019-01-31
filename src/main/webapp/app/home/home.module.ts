import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ClickplusSharedModule } from 'app/shared';
import { HOME_ROUTE, HomeComponent } from './';
import { EventTypeUseraddComponent } from './event-type-useradd/event-type-useradd.component';

@NgModule({
    imports: [ClickplusSharedModule, RouterModule.forChild([HOME_ROUTE])],
    declarations: [HomeComponent, EventTypeUseraddComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ClickplusHomeModule {}
