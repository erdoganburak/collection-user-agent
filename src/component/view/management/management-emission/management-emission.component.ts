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
import EmissionGetAllRequest from 'src/model/emission/emission-get-all-request.model';
import EmissionGetAllResponse from 'src/model/emission/emission-get-all-response.model';
import EmissionUpsertRequest from 'src/model/emission/emission-upsert-request.model';
import { EmissionApiService } from 'src/service/emission/emission-api.service';
import { InteractionService } from 'src/service/interaction.service';
import { ManagementClippingInsertModal } from '../management-clipping-insert-modal/management-clipping-insert-modal.component';
import { ManagementEmissionUpsertModal } from '../management-emission-upsert/management-emission-upsert-modal.component';

@Component({
    selector: 'app-management-emission',
    templateUrl: './management-emission.component.html',
    styleUrls: ['./management-emission.component.scss']
})

export class ManagementEmissionComponent implements OnInit, OnDestroy, AfterViewInit {

    public title: string;
    public description: string;
    public icon: string;
    public emissions: Array<EmissionBasic>;
    public paginationResponse: PaginationResponse;
    public pageNumber: number;

    constructor(private emissionService: EmissionApiService,
        private modalService: NgbModal,
        private interactionService: InteractionService) {

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

    ngAfterViewInit(): void {

    }

    public onClickAddClipping(emission: EmissionBasic) {
        const modalRef = this.modalService.open(ManagementClippingInsertModal, { centered: true, size: "sm" });
        (modalRef.componentInstance as ManagementClippingInsertModal).emission = emission;
        modalRef.result.then(() => {
            this.pageNumber = 1;
            this.getData();
        }, (reason) => {

        });
    }

    public onClickDeleteClipping(clipping: ClippingBasic, emission: EmissionBasic) {
        let clippings = [];

        if (emission.clippings.length === 1) {
            this.interactionService.showMessage("En az 1 küpür emisyon için tanımlı olmalıdır.", ToastrType.Error, "")
            return;
        }

        emission.clippings.forEach(c => {
            if (c._id !== clipping._id) {
                clippings.push(c._id);
            }
        });

        const request: EmissionUpsertRequest = {
            name: emission.name,
            clippings: clippings
        }

        this.emissionService.updateEmission(emission._id, request).subscribe(
            (response: EmissionBasic) => {
                this.interactionService.showMessage("Küpür başarıyla silindi.", ToastrType.Success, "")
                this.pageNumber = 1;
                this.getData();
            },
            (err) => {
                this.interactionService.showMessage("Küpür silinirken hata oluştu.", ToastrType.Error, "")
            });

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
        const modalRef = this.modalService.open(ManagementEmissionUpsertModal, { centered: true, size: "sm" });
        (modalRef.componentInstance as ManagementEmissionUpsertModal).id = id;
        (modalRef.componentInstance as ManagementEmissionUpsertModal).data = data;
        modalRef.result.then(() => {
            this.pageNumber = 1;
            this.getData();
        }, (reason) => {

        });
    }

    public pageNumberChanged(pageNumber): void {
        this.pageNumber = pageNumber;
        this.getData();
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

}
