/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ClickplusTestModule } from '../../../test.module';
import { EventRecordDetailComponent } from 'app/entities/event-record/event-record-detail.component';
import { EventRecord } from 'app/shared/model/event-record.model';

describe('Component Tests', () => {
    describe('EventRecord Management Detail Component', () => {
        let comp: EventRecordDetailComponent;
        let fixture: ComponentFixture<EventRecordDetailComponent>;
        const route = ({ data: of({ eventRecord: new EventRecord(123) }) } as any) as ActivatedRoute;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [ClickplusTestModule],
                declarations: [EventRecordDetailComponent],
                providers: [{ provide: ActivatedRoute, useValue: route }]
            })
                .overrideTemplate(EventRecordDetailComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(EventRecordDetailComponent);
            comp = fixture.componentInstance;
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(comp.eventRecord).toEqual(jasmine.objectContaining({ id: 123 }));
            });
        });
    });
});
