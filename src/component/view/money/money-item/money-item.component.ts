import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { environment } from 'src/environments/environment';
import CollectibleMoneyBasic from 'src/model/collectible-money/collectible-money-basic';

@Component({
    selector: 'app-money-item',
    templateUrl: './money-item.component.html',
    styleUrls: ['./money-item.component.scss']
})

export class MoneyItemComponent implements OnInit, OnDestroy {

    @Input() item: CollectibleMoneyBasic;

    public imagePath: string;

    constructor() {

    }

    ngOnInit(): void {
        this.imagePath = environment.API_IMAGE_PATH + this.item.frontImage;
    }

    ngOnDestroy(): void {

    }

}
