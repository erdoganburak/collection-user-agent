import { Component, OnInit, OnDestroy, AfterViewInit, Input, Output, EventEmitter } from '@angular/core';
import PaginationResponse from 'src/model/common/pagination-response.model';

@Component({
    selector: 'app-pagination',
    templateUrl: './pagination.component.html',
    styleUrls: ['./pagination.component.scss']
})

export class PaginationComponent implements OnInit, OnDestroy, AfterViewInit {

    @Input() paginationResponse: PaginationResponse;
    @Output() pageNumberChanged = new EventEmitter<number>();

    public pageNumber: number;
    public directionLinks: boolean = true;
    public autoHide: boolean = false;
    public responsive: boolean = true;
    public labels: any = {
        previousLabel: 'Önceki Sayfa',
        nextLabel: 'Sonraki Sayfa',
        screenReaderPaginationLabel: 'Pagination',
        screenReaderPageLabel: 'sayfa',
        screenReaderCurrentLabel: 'Gösterilen Sayfa'
    };

    constructor() {

    }

    ngOnInit(): void {
        this.pageNumber = 1;
    }

    ngAfterViewInit(): void {

    }

    ngOnDestroy(): void {

    }

    public pageChanged(pageNumber: number) {
        this.pageNumberChanged.emit(pageNumber)
    }

}
