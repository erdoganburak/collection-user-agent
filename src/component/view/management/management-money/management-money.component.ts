import { Component, OnInit, OnDestroy } from '@angular/core';
import { RoutingHeaderMenuItem, RoutingService } from 'src/service/routing.service';

@Component({
    selector: 'app-management-money',
    templateUrl: './management-money.component.html',
    styleUrls: ['./management-money.component.scss']
})

export class ManagementMoneyComponent implements OnInit, OnDestroy {

    public menuItems: Array<RoutingHeaderMenuItem>;
    public title: string;
    public description: string;
    public icon: string;

    constructor(private routingService: RoutingService) {
    }

    ngOnInit(): void {
        this.menuItems = this.routingService.getManagementMoneyItems();
        this.title = "Para Yönetimi";
        this.description = "Küpür, emisyon ve para işlemleri";
        this.icon = "money-bill-alt"
    }

    ngOnDestroy(): void {

    }


}
