import { Component, OnInit, OnDestroy, AfterViewInit, Input } from '@angular/core';

@Component({
    selector: 'app-title',
    templateUrl: './title.component.html',
    styleUrls: ['./title.component.scss']
})

export class TitleComponent implements OnInit, OnDestroy, AfterViewInit {

    @Input() title: string;
    @Input() description: string;

    constructor() {

    }

    ngOnInit(): void {

    }

    ngAfterViewInit(): void {

    }

    ngOnDestroy(): void {

    }

}
