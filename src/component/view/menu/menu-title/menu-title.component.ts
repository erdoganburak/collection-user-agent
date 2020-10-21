import { Component, OnInit, OnDestroy, Input } from '@angular/core';

@Component({
    selector: 'app-menu-title',
    templateUrl: './menu-title.component.html',
    styleUrls: ['./menu-title.component.scss']
})

export class MenuTitleComponent implements OnInit, OnDestroy {

    @Input() title: string;
    @Input() description: string;
    @Input() icon: string;

    constructor() {

    }

    ngOnInit(): void {

    }

    ngOnDestroy(): void {

    }

}
