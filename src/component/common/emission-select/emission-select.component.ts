import { Component, OnInit, OnDestroy, AfterViewInit, Input, SkipSelf, Output, EventEmitter } from '@angular/core';
import { Subject } from 'rxjs';
import ClippingGetAllRequest from 'src/model/clipping/clipping-get-all-request.model';
import PaginationResponse from 'src/model/common/pagination-response.model';
import { Pagination } from 'src/constant/pagination.constant';
import PaginationRequest from 'src/model/common/pagination-request.model';
import { Sort } from 'src/app/enum/sort.enum';
import { debounceTime } from 'rxjs/operators';
import { ControlContainer } from '@angular/forms';
import EmissionBasic from 'src/model/emission/emission-basic.model';
import { EmissionApiService } from 'src/service/emission/emission-api.service';
import EmissionGetAllResponse from 'src/model/emission/emission-get-all-response.model';

@Component({
    selector: 'app-emission-select',
    templateUrl: './emission-select.component.html',
    styleUrls: ['./emission-select.component.scss'],
    viewProviders: [
        {
            provide: ControlContainer,
            useFactory: (container: ControlContainer) => container,
            deps: [[new SkipSelf(), ControlContainer]]
        }
    ]
})

export class EmissionSelectComponent implements OnInit, OnDestroy, AfterViewInit {

    @Input() controlName: string;
    @Input() mode: string;

    @Output() onEmissionsReceived = new EventEmitter<Array<EmissionBasic>>();

    public pageNumber: number;
    public isLoading: boolean;
    public emissions: Array<EmissionBasic>;

    private valueChange: Subject<string> = new Subject();
    private paginationResponse: PaginationResponse;

    constructor(private emissionService: EmissionApiService) {

    }

    ngOnInit(): void {
        this.pageNumber = 0;
        this.isLoading = false;
        this.emissions = [];
        this.loadMore();
    }

    ngOnDestroy(): void {

    }

    ngAfterViewInit(): void {
        this.isLoading = true;

        this.valueChange.pipe(debounceTime(1000)).subscribe(value => {
            this.emissionService.getEmissions(this.createEmissionGetAllRequest(value)).subscribe(
                (response: EmissionGetAllResponse) => {
                    if (response) {
                        this.emissions = response.emissions;
                        this.paginationResponse = response.paginationResponse;
                        this.isLoading = false;
                        this.onEmissionsReceived.emit(response.emissions);
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
            if (this.paginationResponse.count <= this.emissions.length) {
                console.log("Limit exceeded!")
                return;
            }
        }
        console.log("Loading more emissions...")
        this.pageNumber++;
        this.isLoading = true;

        this.emissionService.getEmissions(this.createEmissionGetAllRequest()).subscribe(
            (response: EmissionGetAllResponse) => {
                if (response) {
                    this.emissions = [...this.emissions, ...response.emissions];
                    this.paginationResponse = response.paginationResponse;
                    this.isLoading = false;
                    this.onEmissionsReceived.emit(this.emissions);
                }
            }
        );
    }

    private createEmissionGetAllRequest(quantity?: string): ClippingGetAllRequest {
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
            this.emissions = [];
        }

        return {
            quantity: _quantity,
            sort: Sort.Desc,
            paginationRequest: paginationRequest,
        };
    }

}