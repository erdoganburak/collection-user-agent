import { Component, OnInit, OnDestroy } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { ImageModal } from 'src/component/common/image-modal/image-modal.component';
import { RoutingParamKeys } from 'src/constant/routing-param-keys.constant';
import { environment } from 'src/environments/environment';
import CollectibleMoneyBasic from 'src/model/collectible-money/collectible-money-basic';
import PaginationResponse from 'src/model/common/pagination-response.model';
import { CollectibleMoneyApiService } from 'src/service/collectible-money/collectible-money-api.service';
import { RoutingParams, RoutingService } from 'src/service/routing.service';

@Component({
    selector: 'app-money-detail',
    templateUrl: './money-detail.component.html',
    styleUrls: ['./money-detail.component.scss'],
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

    constructor(
        private route: ActivatedRoute,
        private routingService: RoutingService,
        private collectibleMoneyService: CollectibleMoneyApiService,
        private modalService: NgbModal
    ) {
    }

    ngOnInit(): void {
        // this.item = history.state;
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

    public onClickImage(): void {
        const modalRef = this.modalService.open(ImageModal, { centered: true, size: "xl" });
        (modalRef.componentInstance as ImageModal).items = this.images;
        modalRef.result.then(() => {

        }, (reason) => {

        });
    }

    private getMoneyById() {
        if (this.routingParams.hasParam) {
            if (this.routingParams[RoutingParamKeys.MoneyId]) {
                let moneyId = this.routingParams[RoutingParamKeys.MoneyId];
                this.id = moneyId;
                this.collectibleMoneySubscription = this.collectibleMoneyService.getMoneyById(moneyId).subscribe(
                    (response: CollectibleMoneyBasic) => {
                        this.item = response;
                        this.imagePath = environment.API_IMAGE_PATH + this.item.frontImage;
                        if (this.item.frontImage)
                            this.images.push(this.item.frontImage);
                        if (this.item.backImage)
                            this.images.push(this.item.backImage);
                    }
                );
            }
        }
    }

}
