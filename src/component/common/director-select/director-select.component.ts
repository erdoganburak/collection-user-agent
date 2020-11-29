import { Component, OnInit, OnDestroy, AfterViewInit, Input, SkipSelf } from '@angular/core';
import { Subject } from 'rxjs';
import PaginationResponse from 'src/model/common/pagination-response.model';
import { Pagination } from 'src/constant/pagination.constant';
import PaginationRequest from 'src/model/common/pagination-request.model';
import { Sort } from 'src/app/enum/sort.enum';
import { debounceTime } from 'rxjs/operators';
import { ControlContainer, FormGroup } from '@angular/forms';
import DirectorBasic from 'src/model/director/director-basic.model';
import { DirectorApiService } from 'src/service/director/director-api.service';
import DirectorGetAllResponse from 'src/model/director/director-get-all-response.model';
import DirectorGetAllRequest from 'src/model/director/director-get-all-request.model';


@Component({
    selector: 'app-director-select',
    templateUrl: './director-select.component.html',
    styleUrls: ['./director-select.component.scss'],
    viewProviders: [
        {
            provide: ControlContainer,
            useFactory: (container: ControlContainer) => container,
            deps: [[new SkipSelf(), ControlContainer]]
        }
    ]
})

export class DirectorSelectComponent implements OnInit, OnDestroy, AfterViewInit {

    @Input() controlName: string;
    @Input() mode: string;
    @Input() selectedDirectors: Array<DirectorBasic>;
    @Input() parentForm: FormGroup;

    public pageNumber: number;
    public isLoading: boolean;
    public directors: Array<DirectorBasic>;

    private valueChange: Subject<string> = new Subject();
    private paginationResponse: PaginationResponse;
    private value: string;
    private stopAdding: boolean;

    constructor(private directorService: DirectorApiService) {

    }

    ngOnInit(): void {
        this.pageNumber = 0;
        this.isLoading = false;
        this.directors = [];
        this.loadMore();
        this.parentForm.get(this.controlName).valueChanges.subscribe(value => {

        });
    }

    ngOnDestroy(): void {

    }

    ngAfterViewInit(): void {
        this.isLoading = true;

        this.valueChange.pipe(debounceTime(1000)).subscribe(value => {
            this.pageNumber = 1;
            this.directors = [];
            this.value = value;
            this.directorService.getDirectors(this.createDirectorGetAllRequest()).subscribe(
                (response: DirectorGetAllResponse) => {
                    if (value === "") {
                        this.stopAdding = !this.stopAdding;
                        this.pageNumber = 0;
                        this.loadMore();
                    } else {
                        this.directorService.getDirectors(this.createDirectorGetAllRequest()).subscribe(
                            (response: DirectorGetAllResponse) => {
                                if (response) {
                                    this.directors = response.directors;
                                    this.paginationResponse = response.paginationResponse;
                                    this.isLoading = false;
                                }
                            }
                        );
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
            if (this.paginationResponse.count <= this.directors.length) {
                console.log("Limit exceeded!")
                return;
            }
        }
        console.log("Loading more directors...")
        this.pageNumber++;
        this.isLoading = true;

        this.directorService.getDirectors(this.createDirectorGetAllRequest()).subscribe(
            (response: DirectorGetAllResponse) => {
                if (response) {
                    if (response) {
                        if (this.selectedDirectors && this.selectedDirectors.length > 0) {
                            // Filter response if items are already added before
                            this.selectedDirectors.forEach(selected => {
                                response.directors = response.directors.filter(item => item._id !== selected._id)
                            });
                            if (!this.stopAdding) {
                                this.selectedDirectors.forEach(selected => {
                                    response.directors.unshift(selected);
                                });
                                this.stopAdding = !this.stopAdding;
                            }
                        }

                        this.directors = [...this.directors, ...response.directors];
                        this.paginationResponse = response.paginationResponse;
                        this.isLoading = false;
                    }
                }
            }
        );
    }

    private createDirectorGetAllRequest(): DirectorGetAllRequest {
        const paginationRequest: PaginationRequest = {
            skip: (this.pageNumber - 1) * Pagination.SELECT_PAGINATION_LIMIT,
            limit: Pagination.SELECT_PAGINATION_LIMIT
        }
        return {
            name: this.value,
            sort: Sort.Desc,
            paginationRequest: paginationRequest,
        };
    }

}