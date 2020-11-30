import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Sort } from 'src/app/enum/sort.enum';
import { DialogType } from 'src/app/enum/system/dialog-type.enum';
import { ToastrType } from 'src/app/enum/toastr.enum';
import { Pagination } from 'src/constant/pagination.constant';
import PaginationRequest from 'src/model/common/pagination-request.model';
import PaginationResponse from 'src/model/common/pagination-response.model';
import { InteractionService } from 'src/service/interaction.service';
import { ProductType } from 'src/app/enum/product-type.enum';
import { ProductApiService } from 'src/service/product/product-api.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { CollectibleMovieApiService } from 'src/service/collectible-movie/collectible-movie-api.service';
import CollectibleMovieBasic from 'src/model/collectible-movie/collectible-movie-basic';
import CategoryBasic from 'src/model/category/category-basic.model';
import ActorBasic from 'src/model/actor/actor-basic.model';
import DirectorBasic from 'src/model/director/director-basic.model';
import CollectibleMovieFilterResponse from 'src/model/collectible-movie/collectible-movie-filter-response';
import { ManagementCollectibleMovieUpsertModal } from '../management-collectible-movie-upsert/management-collectible-movie-upsert-modal.component';
import { MovieFormats } from 'src/constant/movie-format.constant';
import CollectibleMovieFilterRequest from 'src/model/collectible-movie/collectible-movie-filter-request';

@Component({
    selector: 'app-collectible-movie',
    templateUrl: './management-collectible-movie.component.html',
    styleUrls: ['./management-collectible-movie.component.scss']
})

export class ManagementCollectibleMovieComponent implements OnInit, OnDestroy, AfterViewInit {

    public title: string;
    public description: string;
    public icon: string;
    public collectibleMovies: Array<CollectibleMovieBasic>;
    public categories: Array<CategoryBasic>;
    public actors: Array<ActorBasic>;
    public directors: Array<DirectorBasic>;
    public paginationResponse: PaginationResponse;
    public movieForm: FormGroup;
    public imagePath: string;
    public formats;

    private pageNumber: number;

    constructor(private collectibleMovieService: CollectibleMovieApiService,
        private modalService: NgbModal,
        private interactionService: InteractionService,
        private productService: ProductApiService,
        private formBuilder: FormBuilder
    ) {
    }

    ngOnInit(): void {
        this.imagePath = environment.API_IMAGE_PATH;
        this.title = "Kolekisyon Film Yönetimi";
        this.description = "Film ekleme, çıkarma ve güncelleme"
        this.icon = "film";
        this.pageNumber = 1;
        this.formats = MovieFormats;
        this.movieForm = this.formBuilder.group({
            name: [''],
            minPrice: [''],
            maxPrice: [''],
            condition: [''],
            actors: [],
            directors: [],
            categories: [],
            year: [''],
            formats: ['']
        });

        this.getData();
    }

    ngOnDestroy(): void {

    }

    ngAfterViewInit(): void {

    }

    public get controls() { return this.movieForm.controls; }

    public onClickAddNew(): void {
        this.openModal(null)
    }

    public onClickEdit(collectibleMovie: CollectibleMovieBasic): void {
        this.openModal(collectibleMovie);
    }

    public onClickDelete(movie: CollectibleMovieBasic): void {
        this.interactionService.showDialog({
            title: "Film Silme",
            message: movie.name + " isimli filmi silmek istediğinize emin misiniz?",
            type: DialogType.Danger
        }).then((result) => {
            this.productService.deleteProduct(movie._id).subscribe(
                (response: any) => {
                    if (response) {
                        this.interactionService.showMessage("Film başarıyla silindi.", ToastrType.Success, "")
                        this.getData();
                    }
                },
                (err) => {
                    this.interactionService.showMessage("Film silinirken hata oluştu.", ToastrType.Error, "")
                });
        }, (reason) => {
        });
    }


    private openModal(data: CollectibleMovieBasic) {
        const modalRef = this.modalService.open(ManagementCollectibleMovieUpsertModal, { centered: true, size: "lg" });
        (modalRef.componentInstance as ManagementCollectibleMovieUpsertModal).data = data;

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
        this.collectibleMovieService.getCollectibleMovies(this.createCollectibleMovieRequest()).subscribe(
            (response: CollectibleMovieFilterResponse) => {
                if (response) {
                    this.collectibleMovies = response.movies;
                    this.paginationResponse = response.paginationResponse;
                }
            }
        );
    }

    private createCollectibleMovieRequest(): CollectibleMovieFilterRequest {
        const paginationRequest: PaginationRequest = {
            skip: (this.pageNumber - 1) * Pagination.PAGINATION_LIMIT,
            limit: Pagination.PAGINATION_LIMIT
        }
        debugger;
        return {
            productType: ProductType.Movie,
            condition: this.movieForm.controls.condition.value ? Number(this.movieForm.controls.condition.value) : null,
            name: this.movieForm.controls.name.value,
            minPrice: Number(this.movieForm.controls.minPrice.value),
            maxPrice: Number(this.movieForm.controls.maxPrice.value),
            directors: this.movieForm.controls.directors.value ? this.movieForm.controls.directors.value : [],
            actors: this.movieForm.controls.actors.value ? this.movieForm.controls.actors.value : [],
            categories: this.movieForm.controls.categories.value ? this.movieForm.controls.categories.value : [],
            year: this.movieForm.controls.year.value ? Number(this.movieForm.controls.year.value) : null,
            format: this.movieForm.controls.formats.value ? Number(this.movieForm.controls.formats.value) : null,
            sort: Sort.Desc,
            paginationRequest: paginationRequest,
        }
    }

    public onClickClear() {
        this.movieForm.reset();
    }

}
