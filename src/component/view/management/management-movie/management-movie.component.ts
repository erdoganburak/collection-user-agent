import { Component, OnInit, OnDestroy } from '@angular/core';
import { RoutingHeaderMenuItem, RoutingService } from 'src/service/routing.service';

@Component({
    selector: 'app-management-movie',
    templateUrl: './management-movie.component.html',
    styleUrls: ['./management-movie.component.scss']
})

export class ManagementMovieComponent implements OnInit, OnDestroy {

    public menuItems: Array<RoutingHeaderMenuItem>;
    public title: string;
    public description: string;
    public icon: string;

    constructor(private routingService: RoutingService) {
    }

    ngOnInit(): void {
        this.menuItems = this.routingService.getManagementMovieItems();
        this.title = "Film Yönetimi";
        this.description = "Oyuncu, yönetmen, kategori ve film işlemleri";
        this.icon = "film"
    }

    ngOnDestroy(): void {

    }


}
