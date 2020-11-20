import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Sort } from 'src/app/enum/sort.enum';
import { DialogType } from 'src/app/enum/system/dialog-type.enum';
import { ToastrType } from 'src/app/enum/toastr.enum';
import { Pagination } from 'src/constant/pagination.constant';
import CategoryBasic from 'src/model/category/category-basic.model';
import CategoryGetAllRequest from 'src/model/category/category-get-all-request.model';
import CategoryGetAllResponse from 'src/model/category/category-get-all-response.model';
import CategoryUpsertRequest from 'src/model/category/category-upsert-request.model';
import PaginationRequest from 'src/model/common/pagination-request.model';
import PaginationResponse from 'src/model/common/pagination-response.model';
import { CategoryApiService } from 'src/service/category/category-api.service';
import { InteractionService } from 'src/service/interaction.service';
import { ManagementCategoryInsertModal } from '../management-category-insert-modal/management-category-insert-modal.component';
import { ManagementCategoryUpsertModal } from '../management-category-upsert/management-category-upsert-modal.component';

@Component({
    selector: 'app-management-category',
    templateUrl: './management-category.component.html',
    styleUrls: ['./management-category.component.scss']
})

export class ManagementCategoryComponent implements OnInit, OnDestroy {

    public title: string;
    public description: string;
    public icon: string;
    public categories: Array<CategoryBasic>;
    public paginationResponse: PaginationResponse;

    private pageNumber: number;

    constructor(private categoryService: CategoryApiService, private modalService: NgbModal, private interactionService: InteractionService) {

    }

    ngOnInit(): void {
        this.title = "Kategori";
        this.description = "Kategori ekleme, çıkarma ve güncelleme"
        this.icon = "clipboard-list";
        this.pageNumber = 1;
        this.getData();
    }

    ngOnDestroy(): void {

    }

    public onClickAddNew(): void {
        this.openModal(null)
    }

    public onClickEdit(category: CategoryBasic): void {
        this.openModal(category);
    }

    public onClickDelete(category: CategoryBasic): void {
        this.interactionService.showDialog({
            title: "Kategori Silme",
            message: category.name + " isimli kategoriyi silmek istediğinize emin misiniz?",
            type: DialogType.Danger
        }).then((result) => {
            this.categoryService.deleteCategory(category._id).subscribe(
                (response: CategoryBasic) => {
                    if (response) {
                        this.interactionService.showMessage("Kategori başarıyla silindi.", ToastrType.Success, "")
                        this.pageNumber = 1;
                        this.getData();
                    }
                },
                (err) => {
                    this.interactionService.showMessage("Kategori silinirken hata oluştu.", ToastrType.Error, "")
                });
        }, (reason) => {
        });
    }

    private openModal(data: CategoryBasic) {
        const modalRef = this.modalService.open(ManagementCategoryInsertModal, { centered: true, size: "sm" });
        (modalRef.componentInstance as ManagementCategoryInsertModal).data = data;
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
        this.categoryService.getCategories(this.createCategoryGetAllRequest()).subscribe(
            (response: CategoryGetAllResponse) => {
                if (response) {
                    this.categories = response.categories;
                    this.paginationResponse = response.paginationResponse;
                }
            }
        );
    }

    private createCategoryGetAllRequest(): CategoryGetAllRequest {
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
