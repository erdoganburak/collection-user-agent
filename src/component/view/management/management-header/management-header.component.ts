import { Component, OnInit, OnDestroy, Input } from '@angular/core';

@Component({
    selector: 'app-management-header',
    templateUrl: './management-header.component.html',
    styleUrls: ['./management-header.component.scss']
})

export class ManagementHeaderComponent implements OnInit, OnDestroy {

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
