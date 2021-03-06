import { Component, OnInit, OnDestroy, AfterViewInit, Input, SkipSelf } from '@angular/core';
import { Subject } from 'rxjs';
import PaginationResponse from 'src/model/common/pagination-response.model';
import { Pagination } from 'src/constant/pagination.constant';
import PaginationRequest from 'src/model/common/pagination-request.model';
import { Sort } from 'src/app/enum/sort.enum';
import { debounceTime } from 'rxjs/operators';
import { ControlContainer, FormGroup } from '@angular/forms';
import CategoryBasic from 'src/model/category/category-basic.model';
import { CategoryApiService } from 'src/service/category/category-api.service';
import CategoryGetAllRequest from 'src/model/category/category-get-all-request.model';
import CategoryGetAllResponse from 'src/model/category/category-get-all-response.model';

@Component({
    selector: 'app-category-select',
    templateUrl: './category-select.component.html',
    styleUrls: ['./category-select.component.scss'],
    viewProviders: [
        {
            provide: ControlContainer,
            useFactory: (container: ControlContainer) => container,
            deps: [[new SkipSelf(), ControlContainer]]
        }
    ]
})

export class CategorySelectComponent implements OnInit, OnDestroy, AfterViewInit {

    @Input() controlName: string;
    @Input() mode: string;
    @Input() selectedCategories: Array<CategoryBasic>;
    @Input() parentForm: FormGroup;

    public pageNumber: number;
    public isLoading: boolean;
    public categories: Array<CategoryBasic>;

    private valueChange: Subject<string> = new Subject();
    private paginationResponse: PaginationResponse;
    private value: string;
    private stopAdding: boolean;

    constructor(private categoryService: CategoryApiService) {

    }

    ngOnInit(): void {
        this.pageNumber = 0;
        this.isLoading = false;
        this.categories = [];
        this.stopAdding = false;
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
            this.categories = [];
            this.value = value;
            if (value === "") {
                this.stopAdding = !this.stopAdding;
                this.pageNumber = 0;
                this.loadMore();
            } else {
                this.categoryService.getCategories(this.createCategoryGetAllRequest()).subscribe(
                    (response: CategoryGetAllResponse) => {
                        if (response) {
                            this.categories = response.categories;
                            this.paginationResponse = response.paginationResponse;
                            this.isLoading = false;
                        }
                    }
                );
            }
        });
    }

    public onSearch(value: string): void {
        this.valueChange.next(value);
    }

    public loadMore(): void {
        if (this.paginationResponse) {
            if (this.paginationResponse.count <= this.categories.length) {
                console.log("Limit exceeded!")
                return;
            }
        }
        console.log("Loading more categories...")
        this.pageNumber++;
        this.isLoading = true;

        this.categoryService.getCategories(this.createCategoryGetAllRequest()).subscribe(
            (response: CategoryGetAllResponse) => {
                if (response) {
                    if (this.selectedCategories && this.selectedCategories.length > 0) {
                        // Filter response if items are already added before
                        this.selectedCategories.forEach(selected => {
                            response.categories = response.categories.filter(item => item._id !== selected._id)
                        });
                        if (!this.stopAdding) {
                            this.selectedCategories.forEach(selected => {
                                response.categories.unshift(selected);
                            });
                            this.stopAdding = !this.stopAdding;
                        }
                    }

                    this.categories = [...this.categories, ...response.categories];
                    this.paginationResponse = response.paginationResponse;
                    this.isLoading = false;
                }
            }
        );
    }

    private createCategoryGetAllRequest(): CategoryGetAllRequest {
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