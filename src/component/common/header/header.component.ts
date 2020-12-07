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
    public isFirstNavbarCollapsed: boolean = true;
    public isSecondNavbarCollapsed: boolean = true;
    public isManagementNavbarCollapsed: boolean = true;

    public managementHeaderVisible: boolean = false;

    public activePage: string;
    public managementPages: Array<RoutingHeaderMenuItem>;

    constructor(private routingService: RoutingService, private sessionService: SessionService) {

    }

    ngOnInit(): void {
        this.managementPages = [];
        this.render();
        if (this.sessionService.isLoggedIn) {
            this.setMenuManagementItems();
        }
        this.sessionService.onLoginStatusChanged.subscribe(
            (loginState: boolean) => {
                if (loginState) {
                    this.setMenuManagementItems();
                } else {
                    this.removeMenuManagementItems();
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

        this.managementHeaderVisible = this.canShowManagementHeader()
    }

    private setMenuManagementItems() {
        this.managementPages = this.routingService.getManagementItems();
    }

    private removeMenuManagementItems() {
        this.managementPages = [];
    }

    ngAfterViewInit(): void {

    }

    ngOnDestroy(): void {

    }

    private render() {
        this.menuItems = this.routingService.menuItems;
    }

    public gotoPage(item: RoutingHeaderMenuItem) {
        this.isSecondNavbarCollapsed = true;
        this.isFirstNavbarCollapsed = true;
        this.isManagementNavbarCollapsed = true;
        this.routingService.gotoHeaderItem(item);
    }

    public onClickLogin() {
        this.isSecondNavbarCollapsed = true;
        this.isFirstNavbarCollapsed = true;
        this.isManagementNavbarCollapsed = true;
        this.routingService.gotoPage(PageRoutes.LOGIN.path);
    }

    public onClickLogout() {
        this.sessionService.logout();
    }

    public goToShoppingCart() {
        this.routingService.goToShoppingCart();
    }

    public canShowFirstHeader(): boolean {
        if (this.routingService.getUrl() === PageRoutes.LOGIN.fullPath) {
            return false;
        }
        else if (this.routingService.checkIfManagementPage(this.routingService.getUrl())) {
            return false;
        }
        return true;
    }

    public canShowSecondHeader(): boolean {
        if (this.routingService.getUrl() === PageRoutes.LOGIN.fullPath) {
            return false;
        }
        else if (this.routingService.checkIfManagementPage(this.routingService.getUrl())) {
            return false;
        }
        return true;
    }

    public canShowManagementHeader(): boolean {
        if (this.routingService.getUrl() === PageRoutes.LOGIN.fullPath) {
            return true;
        } else {
            if (!this.sessionService.isLoggedIn) {
                return false;
            }
            else if (this.routingService.checkIfManagementPage(this.routingService.getUrl())) {
                return true;
            }
        }

        return false;
    }

}
