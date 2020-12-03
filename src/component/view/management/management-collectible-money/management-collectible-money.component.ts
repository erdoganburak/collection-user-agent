import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Sort } from 'src/app/enum/sort.enum';
import { DialogType } from 'src/app/enum/system/dialog-type.enum';
import { ToastrType } from 'src/app/enum/toastr.enum';
import { Pagination } from 'src/constant/pagination.constant';
import ClippingBasic from 'src/model/clipping/clipping-basic.model';
import PaginationRequest from 'src/model/common/pagination-request.model';
import PaginationResponse from 'src/model/common/pagination-response.model';
import EmissionBasic from 'src/model/emission/emission-basic.model';
import { CollectibleMoneyApiService } from 'src/service/collectible-money/collectible-money-api.service';
import { InteractionService } from 'src/service/interaction.service';
import { ManagementCollectibleMoneyUpsertModal } from '../management-collectible-money-upsert/management-collectible-money-upsert-modal.component';
import CollectibleMoneyFilterResponse from 'src/model/collectible-money/collectible-money-filter-response';
import CollectibleMoneyBasic from 'src/model/collectible-money/collectible-money-basic';
import CollectibleMoneyFilterRequest from 'src/model/collectible-money/collectible-money-filter-request';
import { ProductType } from 'src/app/enum/product-type.enum';
import { ProductApiService } from 'src/service/product/product-api.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { ProductSitutations } from 'src/constant/product-status.constant';
import { ProductStatus } from 'src/app/enum/product-status.enum';

@Component({
    selector: 'app-collectible-money',
    templateUrl: './management-collectible-money.component.html',
    styleUrls: ['./management-collectible-money.component.scss']
})

export class ManagementCollectibleMoneyComponent implements OnInit, OnDestroy, AfterViewInit {

    public title: string;
    public description: string;
    public icon: string;
    public collectibleMoneys: Array<CollectibleMoneyBasic>;
    public clippings: Array<ClippingBasic>;
    public emissions: Array<EmissionBasic>;
    public paginationResponse: PaginationResponse;
    public moneyForm: FormGroup;
    public imagePath: string;
    public productSitutations;

    private pageNumber: number;

    constructor(private collectibleMoneyService: CollectibleMoneyApiService,
        private modalService: NgbModal,
        private interactionService: InteractionService,
        private productService: ProductApiService,
        private formBuilder: FormBuilder
    ) {
    }

    ngOnInit(): void {
        this.imagePath = environment.API_IMAGE_PATH;
        this.title = "Kolekisyon Para Yönetimi";
        this.description = "Para ekleme, çıkarma ve güncelleme"
        this.icon = "money-bill-alt";
        this.pageNumber = 1;
        this.productSitutations = ProductSitutations;
        this.moneyForm = this.formBuilder.group({
            productNo: [''],
            name: [''],
            condition: [''],
            serialNo: [''],
            emissions: null,
            clippings: [],
            minPrice: [''],
            maxPrice: [''],
            status: ['']
        });

        this.onChanges();
        this.getData();
    }

    ngOnDestroy(): void {

    }

    ngAfterViewInit(): void {

    }

    public onChanges(): void {
        this.moneyForm.get('emissions').valueChanges.subscribe(value => {
            if (this.emissions) {
                let selectedEmission = this.emissions.find(item => item._id === value);
                if (selectedEmission) {
                    this.clippings = selectedEmission.clippings;
                    this.controls.clippings.setValue(null)
                }
            }
        });
    }

    public get controls() { return this.moneyForm.controls; }

    public onEmissionSelected(clippings: Array<ClippingBasic>) {
        this.clippings = clippings;
        this.controls.clippings.setValue(null)
    }

    public onClickAddNew(): void {
        this.openModal(null)
    }

    public onClickEdit(collectilbleMoney: CollectibleMoneyBasic): void {
        this.openModal(collectilbleMoney);
    }

    public onClickDelete(money: CollectibleMoneyBasic): void {
        this.interactionService.showDialog({
            title: "Para Silme",
            message: money.name + " isimli parayı silmek istediğinize emin misiniz?",
            type: DialogType.Danger
        }).then((result) => {
            this.productService.deleteProduct(money._id).subscribe(
                (response: any) => {
                    if (response) {
                        this.interactionService.showMessage("Para başarıyla silindi.", ToastrType.Success, "")
                        this.getData();
                    }
                },
                (err) => {
                    this.interactionService.showMessage("Para silinirken hata oluştu.", ToastrType.Error, "")
                });
        }, (reason) => {
        });
    }


    private openModal(data: CollectibleMoneyBasic) {
        const modalRef = this.modalService.open(ManagementCollectibleMoneyUpsertModal, { centered: true, size: "lg" });
        (modalRef.componentInstance as ManagementCollectibleMoneyUpsertModal).data = data;

        modalRef.result.then(() => {
            this.pageNumber = 1;
            this.getData();
        }, (reason) => {

        });
    }

    public pageNumberChanged(pageNumber): void {
        this.pageNumber = pageNumber;
        this.getData()
    }

    public search() {
        this.pageNumber = 1;
        this.getData();
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

    private createCollectibleMoneyRequest(): CollectibleMoneyFilterRequest {
        const paginationRequest: PaginationRequest = {
            skip: (this.pageNumber - 1) * Pagination.PAGINATION_LIMIT,
            limit: Pagination.PAGINATION_LIMIT
        }
        return {
            productType: ProductType.Money,
            productNo: this.moneyForm.controls.productNo.value,
            name: this.moneyForm.controls.name.value,
            serialNo: this.moneyForm.controls.serialNo.value,
            minPrice: Number(this.moneyForm.controls.minPrice.value),
            maxPrice: Number(this.moneyForm.controls.maxPrice.value),
            condition: this.moneyForm.controls.condition.value ? Number(this.moneyForm.controls.condition.value) : null,
            clippings: this.moneyForm.controls.clippings.value ? this.moneyForm.controls.clippings.value : [],
            emission: this.moneyForm.controls.emissions.value ? this.moneyForm.controls.emissions.value : '',
            status: this.moneyForm.controls.status.value ? Number(this.moneyForm.controls.status.value) : ProductStatus.All,
            stock: null,
            sort: Sort.Desc,
            paginationRequest: paginationRequest,
        }
    }

}
