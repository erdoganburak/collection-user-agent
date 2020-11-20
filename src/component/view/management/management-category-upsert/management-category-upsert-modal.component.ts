import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import * as _ from "lodash";
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { BaseModalComponent } from 'src/component/common/modal/base-modal.component';
import { IModal } from 'src/component/common/modal/modal.interface';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InteractionService } from 'src/service/interaction.service';
import { ToastrType } from 'src/app/enum/toastr.enum';
import CategoryUpsertRequest from 'src/model/category/category-upsert-request.model';
import { CategoryApiService } from 'src/service/category/category-api.service';
import CategoryBasic from 'src/model/category/category-basic.model';

@Component({
    selector: 'app-management-category-upsert-modal.component',
    templateUrl: './management-category-upsert-modal.component.html',
    styleUrls: ['./management-category-upsert-modal.component.scss']
})


// TODO SELECT UPSERT!!! USE THIS COMPONENT FOR MOVIE UPDATE
export class ManagementCategoryUpsertModal extends BaseModalComponent implements IModal, OnInit, OnDestroy, AfterViewInit {

    public data: CategoryBasic;
    public categoryForm: FormGroup;
    public submitted = false;

    constructor(
        private activeModal: NgbActiveModal,
        private formBuilder: FormBuilder,
        private categoryService: CategoryApiService,
        private interactionService: InteractionService
    ) {
        super();
    }

    ngOnInit(): void {
        this.categoryForm = this.formBuilder.group({
            name: ['', Validators.required]
        });

        if (this.data) {
            this.categoryForm.controls.name.setValue(this.data._id)
        }
    }

    ngOnDestroy(): void {

    }

    ngAfterViewInit(): void {

    }

    public get controls() { return this.categoryForm.controls; }

    public onSubmit() {
        this.submitted = true;

        if (this.categoryForm.invalid) {
            return;
        }
        const request: CategoryUpsertRequest = {
            name: this.controls.name.value
        }
        if (this.data) {
            this.categoryService.updateCategory(this.data._id, request).subscribe(
                (response: CategoryBasic) => {
                    this.interactionService.showMessage("Kategori başarıyla güncellendi.", ToastrType.Success, "")
                    this.activeModal.close();
                },
                (err) => {
                    this.interactionService.showMessage("Kategori güncellenirken hata oluştu.", ToastrType.Error, "")
                });

        } else {
            this.categoryService.saveCategory(request).subscribe(
                (response: CategoryBasic) => {
                    this.interactionService.showMessage("Kategori başarıyla eklendi.", ToastrType.Success, "")
                    this.activeModal.close();
                },
                (err) => {
                    this.interactionService.showMessage("Kategori eklenirken hata oluştu.", ToastrType.Error, "")
                });
        }

    }

    public init(): void {
        super.init();
    }

    public onCancelClicked(event: MouseEvent): void {
        this.activeModal.dismiss();
    }

    public onOkClicked(event: MouseEvent): void {
        this.activeModal.close();
    }

}