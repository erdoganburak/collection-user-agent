import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { environment } from 'src/environments/environment';
import CollectibleMoneyBasic from 'src/model/collectible-money/collectible-money-basic';
import CollectibleMovieBasic from 'src/model/collectible-movie/collectible-movie-basic';

@Component({
    selector: 'app-movie-item',
    templateUrl: './movie-item.component.html',
    styleUrls: ['./movie-item.component.scss']
})

export class MovieItemComponent implements OnInit, OnDestroy {

    @Input() item: CollectibleMovieBasic;

    public imagePath: string;

    constructor() {

    }

    ngOnInit(): void {
        this.imagePath = environment.API_IMAGE_PATH + this.item.frontImage;
    }

    ngOnDestroy(): void {

    }

}
