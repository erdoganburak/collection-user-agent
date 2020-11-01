import { Component, OnInit, OnDestroy } from '@angular/core';
import { ListAnimation } from 'src/app/animations/list-up.animation';
import { ProductType } from 'src/app/enum/product-type.enum';
import { Sort } from 'src/app/enum/sort.enum';
import { Pagination } from 'src/constant/pagination.constant';
import CollectibleMoneyBasic from 'src/model/collectible-money/collectible-money-basic';
import CollectibleMoneyFilterRequest from 'src/model/collectible-money/collectible-money-filter-request';
import PaginationRequest from 'src/model/common/pagination-request.model';
import PaginationResponse from 'src/model/common/pagination-response.model';
@Component({
    selector: 'app-money',
    templateUrl: './money.component.html',
    styleUrls: ['./money.component.scss'],
    animations: ListAnimation
})

export class MoneyComponent implements OnInit, OnDestroy {

    public collectibleMoneys: Array<CollectibleMoneyBasic>;
    public paginationResponse: PaginationResponse;
    public title: string;
    public description: string;
    public request: CollectibleMoneyFilterRequest;
    public showAll: boolean;
    public showPagination: boolean;

    constructor() {

    }

    ngOnInit(): void {
        this.title = "Para Koleksiyonu";
        this.description = "Koleksiyonel paraları bu sayfadan listeleyebilirsiniz.";
        this.request = this.createCollectibleMoneyRequest();
        this.showAll = false;
        this.showPagination = true;
    }

    ngOnDestroy(): void {

    }

    private createCollectibleMoneyRequest(): CollectibleMoneyFilterRequest {
        const paginationRequest: PaginationRequest = {
            skip: 0,
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
