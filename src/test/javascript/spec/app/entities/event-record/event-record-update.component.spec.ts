/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { ClickplusTestModule } from '../../../test.module';
import { EventRecordUpdateComponent } from 'app/entities/event-record/event-record-update.component';
import { EventRecordService } from 'app/entities/event-record/event-record.service';
import { EventRecord } from 'app/shared/model/event-record.model';

describe('Component Tests', () => {
    describe('EventRecord Management Update Component', () => {
        let comp: EventRecordUpdateComponent;
        let fixture: ComponentFixture<EventRecordUpdateComponent>;
        let service: EventRecordService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [ClickplusTestModule],
                declarations: [EventRecordUpdateComponent]
            })
                .overrideTemplate(EventRecordUpdateComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(EventRecordUpdateComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(EventRecordService);
        });

        describe('save', () => {
            it('Should call update service on save for existing entity', fakeAsync(() => {
                // GIVEN
                const entity = new EventRecord(123);
                spyOn(service, 'update').and.returnValue(of(new HttpResponse({ body: entity })));
                comp.eventRecord = entity;
                // WHEN
                comp.save();
                tick(); // simulate async

                // THEN
                expect(service.update).toHaveBeenCalledWith(entity);
                expect(comp.isSaving).toEqual(false);
            }));

            it('Should call create service on save for new entity', fakeAsync(() => {
                // GIVEN
                const entity = new EventRecord();
                spyOn(service, 'create').and.returnValue(of(new HttpResponse({ body: entity })));
                comp.eventRecord = entity;
                // WHEN
                comp.save();
                tick(); // simulate async

                // THEN
                expect(service.create).toHaveBeenCalledWith(entity);
                expect(comp.isSaving).toEqual(false);
            }));
        });
    });
});
