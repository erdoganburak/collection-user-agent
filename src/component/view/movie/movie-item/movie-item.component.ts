import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { MovieFormats } from 'src/constant/movie-format.constant';
import { environment } from 'src/environments/environment';
import CollectibleMovieBasic from 'src/model/collectible-movie/collectible-movie-basic';

@Component({
    selector: 'app-movie-item',
    templateUrl: './movie-item.component.html',
    styleUrls: ['./movie-item.component.scss']
})

export class MovieItemComponent implements OnInit, OnDestroy {

    @Input() item: CollectibleMovieBasic;

    public imagePath: string;
    public formats;

    constructor() {

    }

    ngOnInit(): void {
        this.formats = MovieFormats;
        this.imagePath = environment.API_IMAGE_PATH + this.item.frontImage;
    }

    ngOnDestroy(): void {

    }

}
