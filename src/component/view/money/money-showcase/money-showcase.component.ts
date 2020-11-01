import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { ListAnimation } from 'src/app/animations/list-up.animation';
import { ProductType } from 'src/app/enum/product-type.enum';
import { Sort } from 'src/app/enum/sort.enum';
import { PageRoutes } from 'src/constant/page-routes.constant';
import { Pagination } from 'src/constant/pagination.constant';
import { RoutingParamKeys } from 'src/constant/routing-param-keys.constant';
import CollectibleMoneyBasic from 'src/model/collectible-money/collectible-money-basic';
import CollectibleMoneyFilterRequest from 'src/model/collectible-money/collectible-money-filter-request';
import CollectibleMoneyFilterResponse from 'src/model/collectible-money/collectible-money-filter-response';
import PaginationRequest from 'src/model/common/pagination-request.model';
import PaginationResponse from 'src/model/common/pagination-response.model';
import { CollectibleMoneyApiService } from 'src/service/collectible-money/collectible-money-api.service';
import { RoutingService } from 'src/service/routing.service';

@Component({
    selector: 'app-money-showcase',
    templateUrl: './money-showcase.component.html',
    styleUrls: ['./money-showcase.component.scss'],
    animations: ListAnimation
})

export class MoneyShowcaseComponent implements OnInit, OnDestroy {

    @Input() title: string;
    @Input() description?: string;
    @Input() showAll?: boolean;
    @Input() showPagination?: boolean;
    @Input() centerTitle?: boolean;
    @Input() centerProducts?: boolean;
    @Input() request: CollectibleMoneyFilterRequest;
    @Input() dontUseRouting?: boolean;

    @Output() itemClicked = new EventEmitter<CollectibleMoneyBasic>();

    public collectibleMoneys: Array<CollectibleMoneyBasic>;
    public paginationResponse: PaginationResponse;

    private pageNumber: number;

    constructor(private collectibleMoneyService: CollectibleMoneyApiService, private routingService: RoutingService) {

    }

    ngOnInit(): void {
        this.pageNumber = 1;
        this.getData();
    }

    ngOnDestroy(): void {

    }

    public onClickShowAll(): void {
        this.routingService.gotoPage(PageRoutes.MONEY.fullPath);
    }

    public pageNumberChanged(pageNumber): void {
        this.collectibleMoneys = null;
        this.pageNumber = pageNumber;
        this.getData()
    }

    public onClickItem(item: CollectibleMoneyBasic) {
        if (this.dontUseRouting) {
            this.itemClicked.emit(item);
        } else {
            let params = {};
            params[RoutingParamKeys.MoneyId] = item._id;
            this.routingService.gotoPage(PageRoutes.MONEY_DETAIL.fullPath, params);
        }
    }

    public getData() {
        this.collectibleMoneyService.getCollectibleMoneys(this.createCollectibleMoneyRequest()).subscribe(
            (response: CollectibleMoneyFilterResponse) => {
                if (response) {
                    this.request = null;
                    this.collectibleMoneys = response.moneys;
                    this.paginationResponse = response.paginationResponse;
                }
            }
        );
    }

    private createCollectibleMoneyRequest(): CollectibleMoneyFilterRequest {
        if (this.request) {
            return this.request;
        }
        const paginationRequest: PaginationRequest = {
            skip: (this.pageNumber - 1) * Pagination.PAGINATION_LIMIT,
            limit: Pagination.PAGINATION_LIMIT
        }
        return {
            productType: ProductType.Money,
            productNo: "",
            name: "",
            serialNo: "",
            minPrice: null,
            maxPrice: null,
            condition: null,
            clipping: "",
            emission: "",
            sort: Sort.Desc,
            paginationRequest: paginationRequest,
        }
    }

}
