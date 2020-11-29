import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import * as _ from "lodash";
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { BaseModalComponent } from 'src/component/common/modal/base-modal.component';
import { IModal } from 'src/component/common/modal/modal.interface';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InteractionService } from 'src/service/interaction.service';
import { ToastrType } from 'src/app/enum/toastr.enum';
import { FileUpload } from 'src/constant/file-upload.constant';
import { environment } from 'src/environments/environment';
import CollectibleMovieBasic from 'src/model/collectible-movie/collectible-movie-basic';
import ActorBasic from 'src/model/actor/actor-basic.model';
import DirectorBasic from 'src/model/director/director-basic.model';
import CategoryBasic from 'src/model/category/category-basic.model';
import { CollectibleMovieApiService } from 'src/service/collectible-movie/collectible-movie-api.service';

@Component({
    selector: 'app-management-collectible-movie-upsert-modal.component',
    templateUrl: './management-collectible-movie-upsert-modal.component.html',
    styleUrls: ['./management-collectible-movie-upsert-modal.component.scss']
})

export class ManagementCollectibleMovieUpsertModal extends BaseModalComponent implements IModal, OnInit, OnDestroy, AfterViewInit {

    public data: CollectibleMovieBasic;
    public actors: Array<ActorBasic>;
    public directors: Array<DirectorBasic>;
    public categories: Array<CategoryBasic>;

    public movieForm: FormGroup;
    public submitted = false;
    public errorImageFileSize: string;
    public errorImageFileExtension: string;
    public imageField: string;
    public frontImageSrc;

    public errorActors: string;
    public errorCategories: string;
    public errorDirectors: string;

    private newFrontImage;

    constructor(
        private activeModal: NgbActiveModal,
        private formBuilder: FormBuilder,
        private interactionService: InteractionService,
        private collectibleMovieService: CollectibleMovieApiService,
    ) {
        super();
    }

    ngOnInit(): void {
        this.movieForm = this.formBuilder.group({
            name: ['', Validators.required],
            directors: [null, Validators.required],
            categories: [null, Validators.required],
            actors: [null, Validators.required],
            summary: ['', Validators.required],
            condition: ['', Validators.required],
            price: ['', Validators.required],
            duration: ['', Validators.required],
            frontImage: [''],
        });

        if (this.data && this.data._id) {
            this.movieForm.patchValue(this.data);

            let actorIds = []
            if (this.data.actors) {
                this.data.actors.forEach(actor => {
                    actorIds.push(actor._id);
                });
            }

            let directorIds = []
            if (this.data.directors) {
                this.data.directors.forEach(director => {
                    directorIds.push(director._id);
                });
            }

            let categoryIds = []
            if (this.data.categories) {
                this.data.categories.forEach(category => {
                    categoryIds.push(category._id);
                });
            }

            this.controls.actors.setValue(actorIds);
            this.controls.directors.setValue(directorIds);
            this.controls.categories.setValue(categoryIds);

            if (this.data.frontImage)
                this.frontImageSrc = environment.API_IMAGE_PATH + this.data.frontImage;

        }

    }

    ngOnDestroy(): void {

    }

    ngAfterViewInit(): void {

    }

    onFileChange(event, field) {
        if (event.target.files.length > 0) {
            this.errorImageFileExtension = null;
            this.errorImageFileSize = null;
            const file = event.target.files[0];
            if (!file) {
                return;
            }

            if (file.size > FileUpload.IMAGE_SIZE) {
                // error
                this.errorImageFileSize = "Resimlerin boyutu en fazla 1 MB olabilir."
            }

            if (file.type === FileUpload.JPG || event.target.files[0].type === FileUpload.JPEG) {

            } else {
                // error
                this.errorImageFileSize = "Resimlerin uzantısı jpg veya jpeg formatında olmalıdır."
            }

            const reader = new FileReader();

            if (this.errorImageFileExtension || this.errorImageFileSize) {
                if (field === "frontImage")
                    this.frontImageSrc = null;
                return;
            }

            this.errorImageFileExtension = null;
            this.errorImageFileSize = null;
            if (field === "frontImage") {
                reader.onload = e => this.frontImageSrc = reader.result;
                reader.readAsDataURL(file);
                this.newFrontImage = file;
            }
        }
    }

    public get controls() { return this.movieForm.controls; }

    public onSubmit() {
        this.submitted = true;
        if (this.errorImageFileExtension || this.errorImageFileSize) {
            return;
        }
        if (this.movieForm.invalid) {
            return;
        }

        if (this.data && this.data._id) {
            this.collectibleMovieService.updateCollectibleMovie(this.data._id, this.createUpsertRequest()).subscribe(
                (response: CollectibleMovieBasic) => {
                    this.interactionService.showMessage("Film başarıyla güncellendi.", ToastrType.Success, "")
                    this.activeModal.close();
                },
                (err) => {
                    this.interactionService.showMessage("Film güncellenirken hata oluştu.", ToastrType.Error, "")
                });

        } else {
            this.collectibleMovieService.saveCollectibleMovie(this.createUpsertRequest()).subscribe(
                (response: CollectibleMovieBasic) => {
                    this.interactionService.showMessage("Film başarıyla eklendi.", ToastrType.Success, "")
                    this.activeModal.close();
                },
                (err) => {
                    this.interactionService.showMessage("Film eklenirken hata oluştu.", ToastrType.Error, "")
                });
        }

    }

    private createUpsertRequest(): FormData {
        let formData = new FormData();
        formData.append('name', this.controls.name.value);

        for (let director of this.movieForm.controls.directors.value) {
            formData.append('directors[]', director);
        }
        for (let category of this.movieForm.controls.categories.value) {
            formData.append('categories[]', category);
        }
        for (let actor of this.movieForm.controls.actors.value) {
            formData.append('actors[]', actor);
        }

        formData.append('summary', this.controls.summary.value);
        formData.append('condition', this.controls.condition.value);
        formData.append('price', this.controls.price.value);
        formData.append('duration', this.controls.duration.value);
        if (this.newFrontImage != null) {
            formData.append('frontImage', this.newFrontImage);
            if (this.data && this.data.frontImage)
                formData.append('frontImageId', this.data.frontImage);
        }
        return formData;
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