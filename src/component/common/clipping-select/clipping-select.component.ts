import { Component, OnInit, OnDestroy, AfterViewInit, Input, SkipSelf } from '@angular/core';
import { Subject } from 'rxjs';
import ClippingBasic from 'src/model/clipping/clipping-basic.model';
import ClippingGetAllRequest from 'src/model/clipping/clipping-get-all-request.model';
import ClippingGetAllResponse from 'src/model/clipping/clipping-get-all-response.model';
import PaginationResponse from 'src/model/common/pagination-response.model';
import { ClippingApiService } from 'src/service/clipping/clipping-api.service';
import { Pagination } from 'src/constant/pagination.constant';
import PaginationRequest from 'src/model/common/pagination-request.model';
import { Sort } from 'src/app/enum/sort.enum';
import { debounceTime } from 'rxjs/operators';
import { ControlContainer } from '@angular/forms';

@Component({
    selector: 'app-clipping-select',
    templateUrl: './clipping-select.component.html',
    styleUrls: ['./clipping-select.component.scss'],
    viewProviders: [
        {
            provide: ControlContainer,
            useFactory: (container: ControlContainer) => container,
            deps: [[new SkipSelf(), ControlContainer]]
        }
    ]
})

export class ClippingSelectComponent implements OnInit, OnDestroy, AfterViewInit {

    @Input() controlName: string;
    @Input() mode: string;

    public pageNumber: number;
    public isLoading: boolean;
    public clippings: Array<ClippingBasic>;

    private valueChange: Subject<string> = new Subject();
    private paginationResponse: PaginationResponse;

    constructor(private clippingService: ClippingApiService) {

    }

    ngOnInit(): void {
        this.pageNumber = 0;
        this.isLoading = false;
        this.clippings = [];
        this.loadMore();
    }

    ngOnDestroy(): void {

    }

    ngAfterViewInit(): void {
        this.isLoading = true;

        this.valueChange.pipe(debounceTime(1000)).subscribe(value => {
            this.clippingService.getClippings(this.createClippingGetAllRequest(value)).subscribe(
                (response: ClippingGetAllResponse) => {
                    if (response) {
                        this.clippings = response.clippings;
                        this.paginationResponse = response.paginationResponse;
                        this.isLoading = false;
                    }
                }
            );
        });
    }

    public onSearch(value: string): void {
        this.valueChange.next(value);
    }

    public loadMore(): void {
        if (this.paginationResponse) {
            if (this.paginationResponse.count <= this.clippings.length) {
                console.log("Limit exceeded!")
                return;
            }
        }
        console.log("Loading more clippings...")
        this.pageNumber++;
        this.isLoading = true;

        this.clippingService.getClippings(this.createClippingGetAllRequest()).subscribe(
            (response: ClippingGetAllResponse) => {
                if (response) {
                    this.clippings = [...this.clippings, ...response.clippings];
                    this.paginationResponse = response.paginationResponse;
                    this.isLoading = false;
                }
            }
        );
    }

    private createClippingGetAllRequest(quantity?: string): ClippingGetAllRequest {
        const paginationRequest: PaginationRequest = {
            skip: (this.pageNumber - 1) * Pagination.SELECT_PAGINATION_LIMIT,
            limit: Pagination.SELECT_PAGINATION_LIMIT
        }

        let _quantity;

        if (quantity != null) {
            if (quantity.trim() !== "") {
                this.pageNumber = 0;
            } else if (quantity.trim() === "") {
                this.pageNumber = 1;
            }
            paginationRequest.skip = 0;
            _quantity = quantity;
            this.clippings = [];
        }

        return {
            quantity: _quantity,
            sort: Sort.Desc,
            paginationRequest: paginationRequest,
        };
    }

}