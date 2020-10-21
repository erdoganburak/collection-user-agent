import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Sort } from 'src/app/enum/sort.enum';
import { DialogType } from 'src/app/enum/system/dialog-type.enum';
import { ToastrType } from 'src/app/enum/toastr.enum';
import PaginationRequest from 'src/model/common/pagination-request.model';
import PaginationResponse from 'src/model/common/pagination-response.model';
import GetMoneyRequest from 'src/model/money/get-money-request.model';
import GetMoneyResponse from 'src/model/money/get-money-response.model';
import MoneyBasic from 'src/model/money/money-basic.model';
import { InteractionService } from 'src/service/interaction.service';
import { MoneyApiService } from 'src/service/money/money-api.service';
import { DenemeComponent } from '../deneme/deneme.component';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit, OnDestroy {

    private moneys: Array<MoneyBasic>;
    private paginationResponse: PaginationResponse;

    constructor(private moneyService: MoneyApiService, private interactionService: InteractionService, private modalService: NgbModal) {

    }

    ngOnInit(): void {

        // this.openModal();
        /* this.interactionService.showDialog({
             title: "MODAL TITLE",
             message: "This is a modal bro",
             messageData: "this.item",
             type: DialogType.Default
         }).then((result) => {
 
         }, (reason) => {
 
         });*/
    }


    ngOnDestroy(): void {

    }

    public openModal() {
        const modalRef = this.modalService.open(DenemeComponent, { centered: true, size: "xl" });
        (modalRef.componentInstance as DenemeComponent).data = "DATAAA";
        modalRef.result.then(() => {

        }, (reason) => {
            //
        });
    }

    private getData() {

        /*this.moneyService.getMoneys(this.createMoneyRequest()).subscribe(
            (response: GetMoneyResponse) => {
                if (response && response.moneys) {
                    debugger;
                    this.moneys = response.moneys;
                    if (response.paginationResponse) {
                        this.paginationResponse = response.paginationResponse;
                    }
                }
            }
        );*/
    }

    private createMoneyRequest(): GetMoneyRequest {
        const paginationRequest: PaginationRequest = {
            skip: 0,
            limit: 0
        }
        return {
            productNo: "",
            name: "",
            condition: null,
            serialNo: "",
            minPrice: null,
            maxPrice: null,
            emission: "",
            clipping: null,
            sort: Sort.Desc,
            paginationRequest: paginationRequest,
        }
    }


}
