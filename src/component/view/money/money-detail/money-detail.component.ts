import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { ListAnimation } from 'src/app/animations/list-up.animation';
import { ProductType } from 'src/app/enum/product-type.enum';
import { Sort } from 'src/app/enum/sort.enum';
import { ImageModal } from 'src/component/common/image-modal/image-modal.component';
import { Pagination } from 'src/constant/pagination.constant';
import { RoutingParamKeys } from 'src/constant/routing-param-keys.constant';
import { environment } from 'src/environments/environment';
import CollectibleMoneyBasic from 'src/model/collectible-money/collectible-money-basic';
import CollectibleMoneyFilterRequest from 'src/model/collectible-money/collectible-money-filter-request';
import CollectibleMoneyFilterResponse from 'src/model/collectible-money/collectible-money-filter-response';
import PaginationRequest from 'src/model/common/pagination-request.model';
import PaginationResponse from 'src/model/common/pagination-response.model';
import { CollectibleMoneyApiService } from 'src/service/collectible-money/collectible-money-api.service';
import { RoutingParams, RoutingService } from 'src/service/routing.service';

@Component({
    selector: 'app-money-detail',
    templateUrl: './money-detail.component.html',
    styleUrls: ['./money-detail.component.scss'],
    animations: ListAnimation
})

export class MoneyDetailComponent implements OnInit, OnDestroy {

    public collectibleMoneys: Array<CollectibleMoneyBasic>;
    public paginationResponse: PaginationResponse;
    public title: string;
    public description: string;
    public item: CollectibleMoneyBasic;
    public id: string;
    public imagePath: string;

    private routingParams: RoutingParams;
    private collectibleMoneySubscription: Subscription;
    private images: Array<string>;
    private pageNumber: number;

    constructor(
        private route: ActivatedRoute,
        private routingService: RoutingService,
        private collectibleMoneyService: CollectibleMoneyApiService,
        private modalService: NgbModal
    ) {
    }

    ngOnInit(): void {
        this.images = [];
        this.route.queryParams.subscribe(params => {
            this.routingParams = this.routingService.getRoutingParams(
                params,
                [RoutingParamKeys.MoneyId],
                [RoutingParamKeys.MoneyId]
            );
            this.getMoneyById();
        });
    }

    ngOnDestroy(): void {
        if (this.collectibleMoneySubscription) this.collectibleMoneySubscription.unsubscribe();
    }

    public getData() {
        this.collectibleMoneyService.getCollectibleMoneys(this.createCollectibleMoneyRequest()).subscribe(
            (response: CollectibleMoneyFilterResponse) => {
                if (response) {
                    this.collectibleMoneys = response.moneys;
                    this.paginationResponse = response.paginationResponse;
                }
            }
        );
    }

    public onClickImage(): void {
        const modalRef = this.modalService.open(ImageModal, { centered: true, size: "xl" });
        (modalRef.componentInstance as ImageModal).items = this.images;
        modalRef.result.then(() => {

        }, (reason) => {

        });
    }

    private createCollectibleMoneyRequest(): CollectibleMoneyFilterRequest {
        const paginationRequest: PaginationRequest = {
            skip: (this.pageNumber - 1) * Pagination.EMISSION_PAGINATION_LIMIT,
            limit: Pagination.EMISSION_PAGINATION_LIMIT
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
            emission: this.item.emission._id,
            sort: Sort.Desc,
            paginationRequest: paginationRequest,
        }
    }

    private getMoneyById() {
        if (this.routingParams.hasParam) {
            if (!this.item && this.routingParams[RoutingParamKeys.MoneyId]) {
                this.id = this.routingParams[RoutingParamKeys.MoneyId];
            }
            this.images = [];
            this.collectibleMoneySubscription = this.collectibleMoneyService.getMoneyById(this.id).subscribe(
                (response: CollectibleMoneyBasic) => {
                    this.item = response;
                    this.imagePath = environment.API_IMAGE_PATH + this.item.frontImage;
                    if (this.item.frontImage)
                        this.images.push(this.item.frontImage);
                    if (this.item.backImage)
                        this.images.push(this.item.backImage);

                    this.pageNumber = 1;
                    this.getData();
                }
            );
        }
    }

    public pageNumberChanged(pageNumber): void {
        this.collectibleMoneys = null;
        this.pageNumber = pageNumber;
        this.getData()
    }

    public onClickItem(item: CollectibleMoneyBasic) {
        this.id = item._id;
        this.getMoneyById();
        window.scroll(0,0);
        // let params = {};
        // params[RoutingParamKeys.MoneyId] = item._id;
        //  this.routingService.gotoPage(PageRoutes.MONEY_DETAIL.fullPath, params);
    }

}
