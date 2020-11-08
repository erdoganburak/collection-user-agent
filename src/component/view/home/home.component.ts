import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProductType } from 'src/app/enum/product-type.enum';
import { Sort } from 'src/app/enum/sort.enum';
import { Pagination } from 'src/constant/pagination.constant';
import CollectibleMoneyFilterRequest from 'src/model/collectible-money/collectible-money-filter-request';
import PaginationRequest from 'src/model/common/pagination-request.model';
import { InteractionService } from 'src/service/interaction.service';
import { MoneyApiService } from 'src/service/money/money-api.service';
@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit, OnDestroy {

    public moneyRequest: CollectibleMoneyFilterRequest;
    public moneyTitle: string;
    public moneyShowAll: boolean;
    public showPagination: boolean;
    public centerTitle: boolean;

    constructor() {

    }

    ngOnInit(): void {
        this.moneyRequest = this.createCollectibleMoneyRequest();
        this.moneyTitle = "Son Eklenen Koleksiyonel Paralar";
        this.moneyShowAll = true;
        this.showPagination = false;
        this.centerTitle = true;
    }

    ngOnDestroy(): void {

    }

    private createCollectibleMoneyRequest(): CollectibleMoneyFilterRequest {
        const paginationRequest: PaginationRequest = {
            skip: 0,
            limit: Pagination.HOME_PAGINATION_LIMIT
        }
        return {
            productType: ProductType.Money,
            productNo: "",
            name: "",
            serialNo: "",
            minPrice: null,
            maxPrice: null,
            condition: null,
            clippings: [],
            emission: "",
            sort: Sort.Desc,
            paginationRequest: paginationRequest,
        }
    }

}
