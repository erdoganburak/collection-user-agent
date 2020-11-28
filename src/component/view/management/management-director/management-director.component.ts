import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Sort } from 'src/app/enum/sort.enum';
import { DialogType } from 'src/app/enum/system/dialog-type.enum';
import { ToastrType } from 'src/app/enum/toastr.enum';
import { Pagination } from 'src/constant/pagination.constant';
import PaginationRequest from 'src/model/common/pagination-request.model';
import PaginationResponse from 'src/model/common/pagination-response.model';
import { InteractionService } from 'src/service/interaction.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { environment } from 'src/environments/environment';
import DirectorBasic from 'src/model/director/director-basic.model';
import DirectorGetAllRequest from 'src/model/director/director-get-all-request.model';
import DirectorGetAllResponse from 'src/model/director/director-get-all-response.model';
import { DirectorApiService } from 'src/service/director/director-api.service';
import { ManagementDirectorUpsertModal } from '../management-director-upsert/management-director-upsert-modal.component';
@Component({
    selector: 'app-director',
    templateUrl: './management-director.component.html',
    styleUrls: ['./management-director.component.scss']
})

export class ManagementDirectorComponent implements OnInit, OnDestroy, AfterViewInit {

    public title: string;
    public description: string;
    public icon: string;
    public directors: Array<DirectorBasic>;
    public paginationResponse: PaginationResponse;
    public directorForm: FormGroup;
    public imagePath: string;

    private pageNumber: number;

    constructor(
        private modalService: NgbModal,
        private interactionService: InteractionService,
        private directorService: DirectorApiService,
        private formBuilder: FormBuilder
    ) {
    }

    ngOnInit(): void {
        this.imagePath = environment.API_IMAGE_PATH;
        this.title = "Yönetmen Yönetimi";
        this.description = "Yönetmen ekleme, çıkarma ve güncelleme"
        this.icon = "video";
        this.pageNumber = 1;
        this.directorForm = this.formBuilder.group({
            name: [''],
        });

        this.getData();
    }

    ngOnDestroy(): void {

    }

    ngAfterViewInit(): void {

    }

    public get controls() { return this.directorForm.controls; }

    public onClickAddNew(): void {
        this.openModal(null)
    }

    public onClickEdit(director: DirectorBasic): void {
        this.openModal(director);
    }

    public onClickDelete(director: DirectorBasic): void {
        this.interactionService.showDialog({
            title: "Yönetmen Silme",
            message: director.name + " isimli yönetmeni silmek istediğinize emin misiniz?",
            type: DialogType.Danger
        }).then((result) => {
            this.directorService.deleteDirector(director._id).subscribe(
                (response: any) => {
                    if (response) {
                        this.interactionService.showMessage("Yönetmen başarıyla silindi.", ToastrType.Success, "")
                        this.getData();
                    }
                },
                (err) => {
                    this.interactionService.showMessage("Yönetmen silinirken hata oluştu.", ToastrType.Error, "")
                });
        }, (reason) => {
        });
    }


    private openModal(data: DirectorBasic) {
        const modalRef = this.modalService.open(ManagementDirectorUpsertModal, { centered: true, size: "lg" });
        (modalRef.componentInstance as ManagementDirectorUpsertModal).data = data;

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
        this.directorService.getDirectors(this.createDirectorRequest()).subscribe(
            (response: DirectorGetAllResponse) => {
                if (response) {
                    this.directors = response.directors;
                    this.paginationResponse = response.paginationResponse;
                }
            }
        );
    }

    public onClickClear() {
        this.directorForm.reset();
    }

    private createDirectorRequest(): DirectorGetAllRequest {
        const paginationRequest: PaginationRequest = {
            skip: (this.pageNumber - 1) * Pagination.PAGINATION_LIMIT,
            limit: Pagination.PAGINATION_LIMIT
        }
        return {
            name: this.directorForm.controls.name.value,
            sort: Sort.Desc,
            paginationRequest: paginationRequest,
        }
    }

}
