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
import EmissionUpsertRequest from 'src/model/emission/emission-upsert-request.model';
import { ClippingApiService } from 'src/service/clipping/clipping-api.service';
import { EmissionApiService } from 'src/service/emission/emission-api.service';
import { InteractionService } from 'src/service/interaction.service';
import { ManagementEmissionUpsertModal } from '../management-emission-upsert/management-emission-upsert-modal.component';

@Component({
    selector: 'app-management-emission',
    templateUrl: './management-emission.component.html',
    styleUrls: ['./management-emission.component.scss']
})

export class ManagementEmissionComponent implements OnInit, OnDestroy {

    public title: string;
    public description: string;
    public icon: string;
    public emissions: Array<EmissionBasic>;
    public paginationResponse: PaginationResponse;
    public clippings: Array<ClippingBasic>;

    private pageNumber: number;

    constructor(private emissionService: EmissionApiService,
        private modalService: NgbModal,
        private interactionService: InteractionService,
        private clippingService: ClippingApiService) {

    }

    ngOnInit(): void {
        this.title = "Emisyon";
        this.description = "Emisyon ekleme, çıkarma ve güncelleme"
        this.icon = "money-check-alt";
        this.pageNumber = 1;
        this.getData();
    }

    ngOnDestroy(): void {

    }

    public onClickAddNew(): void {
        this.openModal(null, {
            name: null,
            clippings: null
        })
    }

    public onClickEdit(emission: EmissionBasic): void {
        const clippings = [];
        emission.clippings.forEach(element => {
            clippings.push(element._id)
        });
        const request: EmissionUpsertRequest = {
            name: emission.name,
            clippings: clippings
        }
        this.openModal(emission._id, request);
    }

    public onClickDelete(emission: EmissionBasic): void {
        this.interactionService.showDialog({
            title: "Emisyion Silme",
            message: emission.name + " ' isimli emisyonu silmek istediğinize emin misiniz?",
            type: DialogType.Danger
        }).then((result) => {
            this.emissionService.deleteEmission(emission._id).subscribe(
                (response: EmissionBasic) => {
                    if (response) {
                        this.interactionService.showMessage("Emisyon başarıyla silindi.", ToastrType.Success, "")
                        this.getData();
                    }
                },
                (err) => {
                    this.interactionService.showMessage("Emisyon silinirken hata oluştu.", ToastrType.Error, "")
                });
        }, (reason) => {
        });
    }

    private openModal(id: string, data: EmissionUpsertRequest) {
        if (!this.clippings) {
            this.clippingService.getClippings(this.createClippingGetAllRequest()).subscribe(
                (response: ClippingGetAllResponse) => {
                    if (response) {
                        this.clippings = response.clippings;
                        this._openModal(id, data);
                    }
                }
            );
        } else {
            this._openModal(id, data);
        }
    }

    private _openModal(id: string, data: EmissionUpsertRequest) {
        const modalRef = this.modalService.open(ManagementEmissionUpsertModal, { centered: true, size: "sm" });
        (modalRef.componentInstance as ManagementEmissionUpsertModal).id = id;
        (modalRef.componentInstance as ManagementEmissionUpsertModal).data = data;
        (modalRef.componentInstance as ManagementEmissionUpsertModal).clippings = this.clippings;
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
        this.emissionService.getEmissions(this.createEmissionGetAllRequest()).subscribe(
            (response: EmissionGetAllResponse) => {
                if (response) {
                    this.emissions = response.emissions;
                    this.paginationResponse = response.paginationResponse;
                }
            }
        );
    }

    private createEmissionGetAllRequest(): EmissionGetAllRequest {
        const paginationRequest: PaginationRequest = {
            skip: (this.pageNumber - 1) * Pagination.PAGINATION_LIMIT,
            limit: Pagination.PAGINATION_LIMIT
        }
        return {
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

}
