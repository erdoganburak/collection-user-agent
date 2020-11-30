import { Component, OnInit, OnDestroy, AfterViewInit, Input, SkipSelf } from '@angular/core';
import { ControlContainer, FormGroup } from '@angular/forms';
import { MovieFormats } from '../../../constant/movie-format.constant';

@Component({
    selector: 'app-movie-format-select',
    templateUrl: './movie-format-select.component.html',
    styleUrls: ['./movie-format-select.component.scss'],
    viewProviders: [
        {
            provide: ControlContainer,
            useFactory: (container: ControlContainer) => container,
            deps: [[new SkipSelf(), ControlContainer]]
        }
    ]
})

export class MovieFormatSelectComponent implements OnInit, OnDestroy, AfterViewInit {

    @Input() controlName: string;
    @Input() mode: string;
    @Input() parentForm: FormGroup;

    public formats: Array<any>;

    constructor() {

    }

    ngOnInit(): void {
        this.formats = [];
        MovieFormats.forEach(element => {
            this.formats.push(element);
        });
    }

    ngOnDestroy(): void {

    }

    ngAfterViewInit(): void {

    }


}