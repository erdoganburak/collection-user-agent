import { Component, OnInit, OnDestroy, AfterViewInit, Input, SkipSelf } from '@angular/core';
import { ControlContainer, FormGroup } from '@angular/forms';
import { ProductSitutations } from 'src/constant/product-status.constant';

@Component({
    selector: 'app-product-status-select',
    templateUrl: './product-status-select.component.html',
    styleUrls: ['./product-status-select.component.scss'],
    viewProviders: [
        {
            provide: ControlContainer,
            useFactory: (container: ControlContainer) => container,
            deps: [[new SkipSelf(), ControlContainer]]
        }
    ]
})

export class ProductStatusSelectComponent implements OnInit, OnDestroy, AfterViewInit {

    @Input() controlName: string;
    @Input() mode: string;
    @Input() parentForm: FormGroup;

    public situtations: Array<any>;

    constructor() {

    }

    ngOnInit(): void {
        this.situtations = [];
        ProductSitutations.forEach(element => {
            this.situtations.push(element);
        });
    }

    ngOnDestroy(): void {

    }

    ngAfterViewInit(): void {

    }


}