import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Sort } from 'src/app/enum/sort.enum';
import { DialogType } from 'src/app/enum/system/dialog-type.enum';
import { ToastrType } from 'src/app/enum/toastr.enum';
import { Pagination } from 'src/constant/pagination.constant';
import ClippingBasic from 'src/model/clipping/clipping-basic.model';
import ClippingGetAllRequest from 'src/model/clipping/clipping-get-all-request.model';
import ClippingGetAllResponse from 'src/model/clipping/clipping-get-all-response.model';
import PaginationRequest from 'src/model/common/pagination-request.model';
import PaginationResponse from 'src/model/common/pagination-response.model';
import EmissionBasic from 'src/model/emission/emission-basic.model';
import EmissionGetAllRequest from 'src/model/emission/emission-get-all-request.model';
import EmissionGetAllResponse from 'src/model/emission/emission-get-all-response.model';
import { ClippingApiService } from 'src/service/clipping/clipping-api.service';
import { EmissionApiService } from 'src/service/emission/emission-api.service';
import { CollectibleMoneyApiService } from 'src/service/collectible-money/collectible-money-api.service';
import { InteractionService } from 'src/service/interaction.service';
import { ManagementCollectibleMoneyUpsertModal } from '../management-collectible-money-upsert/management-collectible-money-upsert-modal.component';
import CollectibleMoneyFilterResponse from 'src/model/collectible-money/collectible-money-filter-response';
import CollectibleMoneyBasic from 'src/model/collectible-money/collectible-money-basic';
import CollectibleMoneyFilterRequest from 'src/model/collectible-money/collectible-money-filter-request';
import { ProductType } from 'src/app/enum/product-type.enum';
import { ProductApiService } from 'src/service/product/product-api.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-collectible-money',
    templateUrl: './management-collectible-money.component.html',
    styleUrls: ['./management-collectible-money.component.scss']
})

export class ManagementCollectibleMoneyComponent implements OnInit, OnDestroy {

    public title: string;
    public description: string;
    public icon: string;
    public collectibleMoneys: Array<CollectibleMoneyBasic>;
    public clippings: Array<ClippingBasic>;
    public emissions: Array<EmissionBasic>;
    public paginationResponse: PaginationResponse;
    public moneyForm: FormGroup;
    public dropdownEmissionSettings: IDropdownSettings = {};
    public dropdownClippingSettings: IDropdownSettings = {};
    public selectedEmission: EmissionBasic;
    public selectedClipping: ClippingBasic;
    public imagePath: string;

    private pageNumber: number;

    constructor(private clippingService: ClippingApiService,
        private collectibleMoneyService: CollectibleMoneyApiService,
        private modalService: NgbModal,
        private interactionService: InteractionService,
        private emissionService: EmissionApiService,
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
        this.moneyForm = this.formBuilder.group({
            productNo: [''],
            name: [''],
            condition: [''],
            serialNo: [''],
            emissions: [''],
            clippings: [''],
            minPrice: [''],
            maxPrice: [''],
        });
        this.dropdownEmissionSettings = {
            singleSelection: true,
            idField: '_id',
            textField: 'name',
            itemsShowLimit: 1,
            allowSearchFilter: false,
        };

        this.dropdownClippingSettings = {
            singleSelection: true,
            idField: '_id',
            textField: 'quantity',
            itemsShowLimit: 1,
            allowSearchFilter: false,
            enableCheckAll: false
        };
        if (!this.clippings && !this.emissions) {
            this.clippingService.getClippings(this.createClippingGetAllRequest()).subscribe(
                (response: ClippingGetAllResponse) => {
                    if (response) {
                        this.clippings = response.clippings;
                        this.emissionService.getEmissions(this.createEmissionGetAllRequest()).subscribe(
                            (response: EmissionGetAllResponse) => {
                                if (response) {
                                    this.emissions = response.emissions;
                                    this.getData();
                                }
                            }
                        );
                    }
                }
            );
        }
    }

    ngOnDestroy(): void {

    }

    public onClickAddNew(): void {
        this.openModal(null)
    }

    public onClickEdit(collectilbleMoney: CollectibleMoneyBasic): void {
        debugger;
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
        (modalRef.componentInstance as ManagementCollectibleMoneyUpsertModal).clippings = this.clippings;
        (modalRef.componentInstance as ManagementCollectibleMoneyUpsertModal).emissions = this.emissions;

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
        let selectedClipping = this.selectedClipping;
        let selectedEmission = this.selectedEmission;
        return {
            productType: ProductType.Money,
            productNo: this.moneyForm.controls.productNo.value,
            name: this.moneyForm.controls.name.value,
            serialNo: this.moneyForm.controls.serialNo.value,
            minPrice: Number(this.moneyForm.controls.minPrice.value),
            maxPrice: Number(this.moneyForm.controls.maxPrice.value),
            condition: this.moneyForm.controls.condition.value ? Number(this.moneyForm.controls.condition.value) : null,
            clipping: selectedClipping ? selectedClipping._id : "",
            emission: selectedEmission ? selectedEmission._id : "",
            sort: Sort.Desc,
            paginationRequest: paginationRequest,
        }
    }

    private createClippingGetAllRequest(): ClippingGetAllRequest {
        const paginationRequest: PaginationRequest = {
            skip: 0,
            limit: 9999
        }
        return {
            sort: Sort.Desc,
            paginationRequest: paginationRequest,
        }
    }

    private createEmissionGetAllRequest(): EmissionGetAllRequest {
        const paginationRequest: PaginationRequest = {
            skip: 0,
            limit: 9999
        }
        return {
            sort: Sort.Desc,
            paginationRequest: paginationRequest,
        }
    }

    onClippingSelected(item: ClippingBasic) {
        this.selectedClipping = item;
        console.log(item);
    }

    onEmissionSelected(item: EmissionBasic) {
        this.selectedEmission = item;
        console.log(item);
    }

    onEmissionDeSelect(item: EmissionBasic) {
        this.selectedEmission = null;
        console.log(item)
    }

    onClippingDeSelect(item: ClippingBasic) {
        console.log(item)
        this.selectedClipping = null;
    }

}
