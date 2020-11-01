import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { RoutingHeaderMenuItem, RoutingService } from 'src/service/routing.service';
import { SessionService } from 'src/service/session.service';
import { PageRoutes } from '../../../constant/page-routes.constant'

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})

export class HeaderComponent implements OnInit, OnDestroy, AfterViewInit {

    public menuItems: Array<RoutingHeaderMenuItem>;
    public isNavbarCollapsed: boolean = true;
    public activePage: string;

    constructor(private routingService: RoutingService, private sessionService: SessionService) {

    }

    ngOnInit(): void {
        this.render();
        if (this.sessionService.isLoggedIn) {
            this.routingService.setMenuManagementItems();
        }
        this.sessionService.onLoginStatusChanged.subscribe(
            (loginState: boolean) => {
                if (loginState) {
                    this.routingService.setMenuManagementItems();
                } else {
                    this.routingService.removeMenuManagementItems();
                }
                this.render();
            }
        );
        this.sessionService.onTokenRefreshed.subscribe(
            () => {
                this.routingService.setMenuManagementItems();
                this.render();
            }
        );
    }

    ngAfterViewInit(): void {

    }

    ngOnDestroy(): void {

    }

    private render() {
        this.menuItems = this.routingService.menuItems;
    }

    public gotoPage(item: RoutingHeaderMenuItem) {
        this.isNavbarCollapsed = true;
        this.routingService.gotoHeaderItem(item);
    }

    public onClickLogin() {
        this.isNavbarCollapsed = true;
        this.routingService.gotoPage(PageRoutes.LOGIN.path);
    }

    public onClickLogout() {
        this.sessionService.logout();
    }

    public goToShoppingCart() {
        this.routingService.goToShoppingCart();
    }

}
