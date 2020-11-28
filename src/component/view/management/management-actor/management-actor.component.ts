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
import ActorBasic from 'src/model/actor/actor-basic.model';
import { ActorApiService } from 'src/service/actor/actor-api.service';
import ActorGetAllRequest from 'src/model/actor/actor-get-all-request.model';
import ActorGetAllResponse from 'src/model/actor/actor-get-all-response.model';
import { ManagementActorUpsertModal } from '../management-actor-upsert/management-actor-upsert-modal.component';

@Component({
    selector: 'app-actor',
    templateUrl: './management-actor.component.html',
    styleUrls: ['./management-actor.component.scss']
})

export class ManagementActorComponent implements OnInit, OnDestroy, AfterViewInit {

    public title: string;
    public description: string;
    public icon: string;
    public actors: Array<ActorBasic>;
    public paginationResponse: PaginationResponse;
    public actorForm: FormGroup;
    public imagePath: string;

    private pageNumber: number;

    constructor(
        private modalService: NgbModal,
        private interactionService: InteractionService,
        private actorService: ActorApiService,
        private formBuilder: FormBuilder
    ) {
    }

    ngOnInit(): void {
        this.imagePath = environment.API_IMAGE_PATH;
        this.title = "Oyuncu Yönetimi";
        this.description = "Oyuncu ekleme, çıkarma ve güncelleme"
        this.icon = "users";
        this.pageNumber = 1;
        this.actorForm = this.formBuilder.group({
            name: [''],
        });

        this.getData();
    }

    ngOnDestroy(): void {

    }

    ngAfterViewInit(): void {

    }

    public get controls() { return this.actorForm.controls; }

    public onClickAddNew(): void {
        this.openModal(null)
    }

    public onClickEdit(actor: ActorBasic): void {
        this.openModal(actor);
    }

    public onClickDelete(actor: ActorBasic): void {
        this.interactionService.showDialog({
            title: "Aktör Silme",
            message: actor.name + " isimli oyuncuyu silmek istediğinize emin misiniz?",
            type: DialogType.Danger
        }).then((result) => {
            this.actorService.deleteActor(actor._id).subscribe(
                (response: any) => {
                    if (response) {
                        this.interactionService.showMessage("Aktör başarıyla silindi.", ToastrType.Success, "")
                        this.getData();
                    }
                },
                (err) => {
                    this.interactionService.showMessage("Aktör silinirken hata oluştu.", ToastrType.Error, "")
                });
        }, (reason) => {
        });
    }


    private openModal(data: ActorBasic) {
        const modalRef = this.modalService.open(ManagementActorUpsertModal, { centered: true, size: "lg" });
        (modalRef.componentInstance as ManagementActorUpsertModal).data = data;

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
        this.actorService.getActors(this.createActorsRequest()).subscribe(
            (response: ActorGetAllResponse) => {
                if (response) {
                    this.actors = response.actors;
                    this.paginationResponse = response.paginationResponse;
                }
            }
        );
    }

    public onClickClear() {
        this.actorForm.reset();
    }

    private createActorsRequest(): ActorGetAllRequest {
        const paginationRequest: PaginationRequest = {
            skip: (this.pageNumber - 1) * Pagination.PAGINATION_LIMIT,
            limit: Pagination.PAGINATION_LIMIT
        }
        return {
            name: this.actorForm.controls.name.value,
            sort: Sort.Desc,
            paginationRequest: paginationRequest,
        }
    }

}
