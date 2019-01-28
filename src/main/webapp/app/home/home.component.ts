import { Component, OnInit } from '@angular/core';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiParseLinks, JhiAlertService } from 'ng-jhipster';

import { LoginModalService, AccountService, Account } from 'app/core';
import { IEventType } from 'app/shared/model/event-type.model';
import { EventTypeService } from 'app/entities/event-type';

import { ITEMS_PER_PAGE } from 'app/shared';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { EventRecordService } from 'app/entities/event-record';
import { IEventRecord } from 'app/shared/model/event-record.model';
import { Observable } from 'rxjs';

@Component({
    selector: 'jhi-home',
    templateUrl: './home.component.html',
    styleUrls: ['home.scss']
})
export class HomeComponent implements OnInit {
    account: Account;
    modalRef: NgbModalRef;
    eventTypes: IEventType[];
    totalItems: any;
    queryCount: any;
    itemsPerPage: any;
    page: any;
    predicate: any;
    previousPage: any;
    reverse: any;
    routeData: any;
    links: any;
    isSaving: boolean;

    constructor(
        private accountService: AccountService,
        private eventTypeService: EventTypeService,
        protected eventRecordService: EventRecordService,
        private loginModalService: LoginModalService,
        private activatedRoute: ActivatedRoute,
        private parseLinks: JhiParseLinks,
        private jhiAlertService: JhiAlertService,
        private eventManager: JhiEventManager
    ) {
        this.itemsPerPage = ITEMS_PER_PAGE;
        this.routeData = this.activatedRoute.data.subscribe(data => {
            this.page = data.pagingParams.page;
            this.previousPage = data.pagingParams.page;
            this.reverse = data.pagingParams.ascending;
            this.predicate = data.pagingParams.predicate;
        });
    }

    loadAll() {
        this.eventTypeService
            .queryLogin({
                page: this.page - 1,
                size: this.itemsPerPage,
                sort: this.sort()
            })
            .subscribe(
                (res: HttpResponse<IEventType[]>) => this.paginateEventTypes(res.body, res.headers),
                (res: HttpErrorResponse) => this.onError(res.message)
            );
    }
    sort() {
        this.predicate = 'id';
        const result = [this.predicate + ',' + (this.reverse ? 'asc' : 'desc')];
        if (this.predicate !== 'id') {
            result.push('id');
        }
        return result;
    }

    ngOnInit() {
        this.accountService.identity().then(account => {
            this.account = account;
        });
        this.registerAuthenticationSuccess();
        this.loadAll();
        this.isSaving = false;
    }

    registerAuthenticationSuccess() {
        this.eventManager.subscribe('authenticationSuccess', message => {
            this.accountService.identity().then(account => {
                this.account = account;
            });
        });
    }

    isAuthenticated() {
        return this.accountService.isAuthenticated();
    }

    login() {
        this.modalRef = this.loginModalService.open();
    }

    save(id: number) {
        this.isSaving = true;
        this.subscribeToSaveResponse(this.eventRecordService.createByTypeId(id));
    }
    protected subscribeToSaveResponse(result: Observable<HttpResponse<IEventRecord>>) {
        result.subscribe((res: HttpResponse<IEventRecord>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
    }
    previousState() {
        window.history.back();
    }

    trackId(index: number, item: IEventType) {
        return item.id;
    }

    protected onSaveSuccess() {
        this.isSaving = false;
        // this.previousState();
    }

    protected onSaveError() {
        this.isSaving = false;
    }
    protected paginateEventTypes(data: IEventType[], headers: HttpHeaders) {
        this.links = this.parseLinks.parse(headers.get('link'));
        this.totalItems = parseInt(headers.get('X-Total-Count'), 10);
        this.queryCount = this.totalItems;
        this.eventTypes = data;
    }

    protected onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }
}
