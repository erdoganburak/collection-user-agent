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
    @Input() selectedCategory: CategoryBasic;
    @Input() parentForm: FormGroup;

    public pageNumber: number;
    public isLoading: boolean;
    public categories: Array<CategoryBasic>;
    public newSelectedCategory;

    private valueChange: Subject<string> = new Subject();
    private paginationResponse: PaginationResponse;
    private value: string;

    constructor(private categoryService: CategoryApiService) {

    }

    ngOnInit(): void {
        this.pageNumber = 0;
        this.isLoading = false;
        this.categories = [];
        this.loadMore();
        this.parentForm.get(this.controlName).valueChanges.subscribe(value => {
            this.newSelectedCategory = value;
            if (this.selectedCategory && this.categories.length > 0) {
                if (this.selectedCategory._id == this.categories[0]._id) {
                    this.categories.shift();
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
            this.categories = [];
            this.value = value;
            this.categoryService.getCategories(this.createCategoryGetAllRequest()).subscribe(
                (response: CategoryGetAllResponse) => {
                    if (response) {
                        this.categories = response.categories;
                        this.paginationResponse = response.paginationResponse;
                        this.isLoading = false;
                        if (!value) {
                            if (this.selectedCategory && this.selectedCategory._id != this.categories[0]._id && !this.newSelectedCategory) {
                                this.categories.unshift(this.selectedCategory);
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
                    this.categories = [...this.categories, ...response.categories];

                    if (this.selectedCategory && this.selectedCategory._id != this.categories[0]._id && !this.newSelectedCategory) {
                        this.categories.unshift(this.selectedCategory);
                    }

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