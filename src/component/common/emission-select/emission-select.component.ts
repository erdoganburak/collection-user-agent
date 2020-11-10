import { Component, OnInit, OnDestroy, AfterViewInit, Input, SkipSelf, Output, EventEmitter } from '@angular/core';
import { Subject } from 'rxjs';
import PaginationResponse from 'src/model/common/pagination-response.model';
import { Pagination } from 'src/constant/pagination.constant';
import PaginationRequest from 'src/model/common/pagination-request.model';
import { Sort } from 'src/app/enum/sort.enum';
import { debounceTime } from 'rxjs/operators';
import { ControlContainer, FormGroup } from '@angular/forms';
import EmissionBasic from 'src/model/emission/emission-basic.model';
import { EmissionApiService } from 'src/service/emission/emission-api.service';
import EmissionGetAllResponse from 'src/model/emission/emission-get-all-response.model';
import EmissionGetAllRequest from 'src/model/emission/emission-get-all-request.model';
import ClippingBasic from 'src/model/clipping/clipping-basic.model';

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
    @Input() selectedEmission: EmissionBasic;
    @Input() parentForm: FormGroup;

    @Output() onEmissionSelected = new EventEmitter<Array<ClippingBasic>>();

    public pageNumber: number;
    public isLoading: boolean;
    public emissions: Array<EmissionBasic>;
    public newSelectedEmission;

    private valueChange: Subject<string> = new Subject();
    private paginationResponse: PaginationResponse;
    private value: string;

    constructor(private emissionService: EmissionApiService) {

    }

    ngOnInit(): void {
        this.pageNumber = 0;
        this.isLoading = false;
        this.emissions = [];
        this.loadMore();
        this.parentForm.get(this.controlName).valueChanges.subscribe(value => {
            this.newSelectedEmission = value;
            let selectedEmission = this.emissions.find(item => item._id === value);
            this.onEmissionSelected.emit(selectedEmission ? selectedEmission.clippings : null);
            if (this.selectedEmission && this.emissions.length > 0) {
                if (this.selectedEmission._id == this.emissions[0]._id) {
                    this.emissions.shift();
                }
            }
        });
    }

    ngOnDestroy(): void {

    }

    ngAfterViewInit(): void {
        this.isLoading = true;

        this.valueChange.pipe(debounceTime(1000)).subscribe(value => {
            this.pageNumber = 1;
            this.emissions = [];
            this.value = value;
            this.emissionService.getEmissions(this.createEmissionGetAllRequest()).subscribe(
                (response: EmissionGetAllResponse) => {
                    if (response) {
                        this.emissions = response.emissions;
                        this.paginationResponse = response.paginationResponse;
                        this.isLoading = false;
                        if (!value) {
                            if (this.selectedEmission && this.selectedEmission._id != this.emissions[0]._id && !this.newSelectedEmission) {
                                this.emissions.unshift(this.selectedEmission);
                            }
                        }
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

                    if (this.selectedEmission && this.selectedEmission._id != this.emissions[0]._id && !this.newSelectedEmission) {
                        this.emissions.unshift(this.selectedEmission);
                    }

                    this.paginationResponse = response.paginationResponse;
                    this.isLoading = false;
                }
            }
        );
    }

    private createEmissionGetAllRequest(): EmissionGetAllRequest {
        const paginationRequest: PaginationRequest = {
            skip: (this.pageNumber - 1) * Pagination.SELECT_PAGINATION_LIMIT,
            limit: Pagination.SELECT_PAGINATION_LIMIT
        }

        if (this.value != null) {
            //paginationRequest.skip = 0;
            //this.emissions = [];
        }

        return {
            name: this.value,
            sort: Sort.Desc,
            paginationRequest: paginationRequest,
        };
    }

}