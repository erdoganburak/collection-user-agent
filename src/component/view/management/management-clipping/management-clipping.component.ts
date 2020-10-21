import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Sort } from 'src/app/enum/sort.enum';
import { DialogType } from 'src/app/enum/system/dialog-type.enum';
import { ToastrType } from 'src/app/enum/toastr.enum';
import { Pagination } from 'src/constant/pagination.constant';
import ClippingBasic from 'src/model/clipping/clipping-basic.model';
import ClippingGetAllRequest from 'src/model/clipping/clipping-get-all-request.model';
import ClippingGetAllResponse from 'src/model/clipping/clipping-get-all-response.model';
import ClippingUpsertRequest from 'src/model/clipping/clipping-upsert-request.model';
import PaginationRequest from 'src/model/common/pagination-request.model';
import PaginationResponse from 'src/model/common/pagination-response.model';
import { ClippingApiService } from 'src/service/clipping/clipping-api.service';
import { InteractionService } from 'src/service/interaction.service';
import { ManagementClippingUpsertModal } from '../management-clipping-upsert/management-clipping-upsert-modal.component';

@Component({
    selector: 'app-management-clipping',
    templateUrl: './management-clipping.component.html',
    styleUrls: ['./management-clipping.component.scss']
})

export class ManagementClippingComponent implements OnInit, OnDestroy {

    public title: string;
    public description: string;
    public icon: string;
    public clippings: Array<ClippingBasic>;
    public paginationResponse: PaginationResponse;

    private pageNumber: number;

    constructor(private clippingService: ClippingApiService, private modalService: NgbModal, private interactionService: InteractionService) {

    }

    ngOnInit(): void {
        this.title = "Küpür";
        this.description = "Küpür ekleme, çıkarma ve güncelleme"
        this.icon = "coins";
        this.pageNumber = 1;
        this.getData();
    }

    ngOnDestroy(): void {

    }

    public onClickAddNew(): void {
        this.openModal(null, {
            quantity: null
        })
    }

    public onClickEdit(clipping: ClippingBasic): void {
        const request: ClippingUpsertRequest = {
            quantity: clipping.quantity
        }
        this.openModal(clipping._id, request);
    }

    public onClickDelete(clipping: ClippingBasic): void {
        this.interactionService.showDialog({
            title: "Küpür Silme",
            message: clipping.quantity + " ' TL'lik küpürü silmek istediğinize emin misiniz?",
            type: DialogType.Danger
        }).then((result) => {
            this.clippingService.deleteClipping(clipping._id).subscribe(
                (response: ClippingBasic) => {
                    if (response) {
                        this.interactionService.showMessage("Küpür başarıyla silindi.", ToastrType.Success, "")
                        this.getData();
                    }
                },
                (err) => {
                    this.interactionService.showMessage("Küpür silinirken hata oluştu.", ToastrType.Error, "")
                });
        }, (reason) => {
        });
    }

    private openModal(id: string, data: ClippingUpsertRequest) {
        const modalRef = this.modalService.open(ManagementClippingUpsertModal, { centered: true, size: "sm" });
        (modalRef.componentInstance as ManagementClippingUpsertModal).id = id;
        (modalRef.componentInstance as ManagementClippingUpsertModal).data = data;
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

    public getData() {
        this.clippingService.getClippings(this.createClippingGetAllRequest()).subscribe(
            (response: ClippingGetAllResponse) => {
                if (response) {
                    this.clippings = response.clippings;
                    this.paginationResponse = response.paginationResponse;
                }
            }
        );
    }

    private createClippingGetAllRequest(): ClippingGetAllRequest {
        const paginationRequest: PaginationRequest = {
            skip: (this.pageNumber - 1) * Pagination.PAGINATION_LIMIT,
            limit: Pagination.PAGINATION_LIMIT
        }
        return {
            sort: Sort.Desc,
            paginationRequest: paginationRequest,
        }
    }

}
