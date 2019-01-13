import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { ClickplusEventTypeModule } from './event-type/event-type.module';
import { ClickplusEventRecordModule } from './event-record/event-record.module';
/* jhipster-needle-add-entity-module-import - JHipster will add entity modules imports here */

@NgModule({
    // prettier-ignore
    imports: [
        ClickplusEventTypeModule,
        ClickplusEventRecordModule,
        /* jhipster-needle-add-entity-module - JHipster will add entity modules here */
    ],
    declarations: [],
    entryComponents: [],
    providers: [],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ClickplusEntityModule {}
