import { Component, OnInit, OnDestroy, AfterViewInit, Input, SkipSelf } from '@angular/core';
import { Subject } from 'rxjs';
import PaginationResponse from 'src/model/common/pagination-response.model';
import { Pagination } from 'src/constant/pagination.constant';
import PaginationRequest from 'src/model/common/pagination-request.model';
import { Sort } from 'src/app/enum/sort.enum';
import { debounceTime } from 'rxjs/operators';
import { ControlContainer, FormGroup } from '@angular/forms';
import ActorBasic from 'src/model/actor/actor-basic.model';
import { ActorApiService } from 'src/service/actor/actor-api.service';
import ActorGetAllResponse from 'src/model/actor/actor-get-all-response.model';
import ActorGetAllRequest from 'src/model/actor/actor-get-all-request.model';

@Component({
    selector: 'app-actor-select',
    templateUrl: './actor-select.component.html',
    styleUrls: ['./actor-select.component.scss'],
    viewProviders: [
        {
            provide: ControlContainer,
            useFactory: (container: ControlContainer) => container,
            deps: [[new SkipSelf(), ControlContainer]]
        }
    ]
})

export class ActorSelectComponent implements OnInit, OnDestroy, AfterViewInit {

    @Input() controlName: string;
    @Input() mode: string;
    @Input() selectedActors: Array<ActorBasic>;
    @Input() parentForm: FormGroup;

    public pageNumber: number;
    public isLoading: boolean;
    public actors: Array<ActorBasic>;

    private valueChange: Subject<string> = new Subject();
    private paginationResponse: PaginationResponse;
    private value: string;
    private stopAdding: boolean;

    constructor(private actorService: ActorApiService) {

    }

    ngOnInit(): void {
        this.pageNumber = 0;
        this.isLoading = false;
        this.actors = [];
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
            this.actors = [];
            this.value = value;
            this.actorService.getActors(this.createActorGetAllRequest()).subscribe(
                (response: ActorGetAllResponse) => {
                    if (value === "") {
                        this.stopAdding = !this.stopAdding;
                        this.pageNumber = 0;
                        this.loadMore();
                    } else {
                        this.actorService.getActors(this.createActorGetAllRequest()).subscribe(
                            (response: ActorGetAllResponse) => {
                                if (response) {
                                    this.actors = response.actors;
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
            if (this.paginationResponse.count <= this.actors.length) {
                console.log("Limit exceeded!")
                return;
            }
        }
        console.log("Loading more actors...")
        this.pageNumber++;
        this.isLoading = true;

        this.actorService.getActors(this.createActorGetAllRequest()).subscribe(
            (response: ActorGetAllResponse) => {
                if (response) {
                    if (this.selectedActors && this.selectedActors.length > 0) {
                        // Filter response if items are already added before
                        this.selectedActors.forEach(selected => {
                            response.actors = response.actors.filter(item => item._id !== selected._id)
                        });
                        if (!this.stopAdding) {
                            this.selectedActors.forEach(selected => {
                                response.actors.unshift(selected);
                            });
                            this.stopAdding = !this.stopAdding;
                        }
                    }

                    this.actors = [...this.actors, ...response.actors];
                    this.paginationResponse = response.paginationResponse;
                    this.isLoading = false;
                }
            }
        );
    }

    private createActorGetAllRequest(): ActorGetAllRequest {
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