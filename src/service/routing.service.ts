import * as _ from "lodash";
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, CanActivate, Params } from '@angular/router';
import { PageRoutes } from '../constant/page-routes.constant';
import { Observable, of } from 'rxjs';
import { SessionService } from './session.service';
import { map } from 'rxjs/operators';
import { LocalStorageKey } from 'src/app/enum/system/local-storage-key.enum';

@Injectable()
export class RoutingService implements CanActivate {

    private _menuItems: Array<RoutingHeaderMenuItem> = null;

    private reloadedRouterStateSnapshot: RouterStateSnapshot = null;

    private _activePage: string;
    public get activePage(): string {
        return this._activePage;
    }
    public set activePage(value: string) {
        this._activePage = value;
    }

    private _activeHeaderPage: string;
    public get activeHeaderPage(): string {
        return this._activeHeaderPage;
    }
    public set activeHeaderPage(value: string) {
        this._activeHeaderPage = value;
    }


    constructor(private router: Router, private sessionService: SessionService) {

    }

    public get menuItems(): Array<RoutingHeaderMenuItem> {
        if (this._menuItems) return this._menuItems;
        let menuItems: Array<RoutingHeaderMenuItem> = [
            {
                title: PageRoutes.HOME.value,
                page: PageRoutes.HOME,
                visible: true
            },
            {
                title: PageRoutes.MONEY.value,
                page: PageRoutes.MONEY,
                visible: true
            },
            {
                title: PageRoutes.MOVIES.value,
                page: PageRoutes.MOVIES,
                visible: true
            },
            {
                title: PageRoutes.SHOPPING_CART.value,
                page: PageRoutes.SHOPPING_CART,
                visible: false
            },
            {
                title: PageRoutes.CHECKOUT.value,
                page: PageRoutes.CHECKOUT,
                visible: false
            }
        ];

        this._menuItems = menuItems;
        return this._menuItems;
    }

    public setMenuManagementItems() {
        /*const management = this._menuItems.find(item => item.title === 'Yönetim');
        if (!management) {
            this._menuItems.push(this.getManagementItems());
        }*/
    }

    public removeMenuManagementItems() {
        /* const management = this._menuItems.find(item => item.title === 'Yönetim');
         if (management) {
             this._menuItems.pop();
         }*/
    }

    public getUrl(): string {
        return this.router.url
    }

    public isCurrentPageManagement(): boolean {
        /* this.getManagementItems().forEach(item => {
             if (item.page.fullPath === this.getUrl()) {
                 return true;
             } else {
                 let found = item.childs.find(i => i.page.fullPath === this.getUrl());
                 if (found) {
                     return true;
                 }
             }
         });*/
        return false;
    }

    public getManagementItems(): Array<RoutingHeaderMenuItem> {
        let menuItems: RoutingHeaderMenuItem = {
            title: "Yönetim",
            page: PageRoutes.MENU,
            childs: [
                {
                    title: PageRoutes.MANAGEMENT_MONEY.value,
                    page: PageRoutes.MANAGEMENT_MONEY,
                    childs: this.getManagementMoneyItems(),
                    visible: true
                },
                {
                    title: PageRoutes.MANAGEMENT_MOVIE.value,
                    page: PageRoutes.MANAGEMENT_MOVIE,
                    childs: this.getManagementMovieItems(),
                    visible: true
                }
            ]
        };
        return menuItems.childs;
    }

    public getManagementMoneyItems(): Array<RoutingHeaderMenuItem> {
        return [
            {
                title: PageRoutes.MANAGEMENT_CLIPPING.value,
                page: PageRoutes.MANAGEMENT_CLIPPING,
                icon: "coins",
                visible: true
            },
            {
                title: PageRoutes.MANAGEMENT_EMISSION.value,
                page: PageRoutes.MANAGEMENT_EMISSION,
                icon: "money-check-alt",
                visible: true
            },
            {
                title: PageRoutes.MANAGEMENT_COLLECTIBLE_MONEY.value,
                page: PageRoutes.MANAGEMENT_COLLECTIBLE_MONEY,
                icon: "money-bill-alt",
                visible: true
            }
        ]
    }

    public getManagementMovieItems(): Array<RoutingHeaderMenuItem> {
        return [
            {
                title: PageRoutes.MANAGEMENT_MOVIE_ACTOR.value,
                page: PageRoutes.MANAGEMENT_MOVIE_ACTOR,
                icon: "users",
                visible: true
            },
            {
                title: PageRoutes.MANAGEMENT_MOVIE_DIRECTOR.value,
                page: PageRoutes.MANAGEMENT_MOVIE_DIRECTOR,
                icon: "video",
                visible: true
            },
            {
                title: PageRoutes.MANAGEMENT_MOVIE_CATEGORY.value,
                page: PageRoutes.MANAGEMENT_MOVIE_CATEGORY,
                icon: "clipboard-list",
                visible: true
            },
            {
                title: PageRoutes.MANAGEMENT_COLLECTIBLE_MOVIE.value,
                page: PageRoutes.MANAGEMENT_COLLECTIBLE_MOVIE,
                icon: "film",
                visible: true
            },
        ]
    }

    public gotoHeaderItem(item: RoutingHeaderMenuItem) {
        if (item.page) {
            this.activeHeaderPage = item.page.fullPath;
            this.gotoPage(item.page.fullPath);
        } else {
            this.activeHeaderPage = item.childs[0].page.fullPath
            this.gotoPage(item.childs[0].page.fullPath);
        }
    }

    public goToShoppingCart() {
        this.gotoPage(PageRoutes.SHOPPING_CART.fullPath);
    }

    public gotoPage(fullPath: string, params: any = null) {
        this.activePage = fullPath;
        if (params) {
            this.router.navigate([fullPath], { queryParams: params });
        } else {
            this.router.navigate([fullPath]);
        }
    }

    public gotoPageWithState(fullPath: string, _state: any) {
        this.activePage = fullPath;
        this.router.navigate([fullPath], { state: _state });
    }

    /**
    * Deciding if a route can be activated
    */
    public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
        let url: string = state.url;
        return this.validateUrlNavigation(url).pipe(
            map(
                response => {
                    if (response == true) {
                        this.reloadedRouterStateSnapshot = state;
                    }
                    return response;
                }
            )
        );
    }

    /**
    * Deciding if a children can be loaded
    */
    /* public canLoad(route: Route): Observable<boolean> {
         let url: string = `/${route.path}`;
         return this.validateUrlNavigation(url);
     }*/

    public checkIfManagementPage(url: string): boolean {
        // TODO Important
        switch (url) {
            case PageRoutes.MANAGEMENT_MONEY.fullPath:
                return true;
            case PageRoutes.MANAGEMENT_MOVIE.fullPath:
                return true;
            case PageRoutes.MANAGEMENT_CLIPPING.fullPath:
                return true;
            case PageRoutes.MANAGEMENT_EMISSION.fullPath:
                return true;
            case PageRoutes.MANAGEMENT_MOVIE_ACTOR.fullPath:
                return true;
            case PageRoutes.MANAGEMENT_MOVIE_DIRECTOR.fullPath:
                return true;
            case PageRoutes.MANAGEMENT_MOVIE_CATEGORY.fullPath:
                return true;
            case PageRoutes.MANAGEMENT_COLLECTIBLE_MONEY.fullPath:
                return true;
            case PageRoutes.MANAGEMENT_COLLECTIBLE_MOVIE.fullPath:
                return true;
            default:
                return false;
        }
    }

    private validateUrlNavigation(url: string): Observable<boolean> {
        console.log("validate url nav")
        let refreshTokenValue = localStorage.getItem(LocalStorageKey.REFRESHTOKEN);
        if (!refreshTokenValue) {
            if (this.checkIfManagementPage(url)) {
                return this.sessionService.checkSession().pipe(
                    map(response => {
                        if (response) {
                            if (this.validateUrlPermission(url)) {
                                return true;
                            }
                            else {
                                this.gotoPage(PageRoutes.LOGIN.path);
                                return false;
                            }
                        } else {
                            this.gotoPage(PageRoutes.LOGIN.path);
                            return false;
                        }
                    })
                );
            } else {
                return of(true);
            }
        } else {
            return this.sessionService.checkSession().pipe(
                map(response => {
                    if (response) {
                        if (this.validateUrlPermission(url)) {
                            return true;
                        }
                        else {
                            this.gotoPage(PageRoutes.LOGIN.path);
                            return false;
                        }
                    } else {
                        this.gotoPage(PageRoutes.LOGIN.path);
                        return false;
                    }
                })
            );
        }

    }

    private validateUrlPermission(url: string): boolean {
        return true;
    }

    public resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
        // If user is logged in already, navigate to dashboard directly
        // Else if user has not logged out and selected keep logged in, tries refresh token
        if (this.sessionService.isLoggedIn) {
            this.gotoPage(PageRoutes.HOME.path);
        }

        else if (this.sessionService.currentExpireDate && this.sessionService.keepLoggedIn) {
            this.sessionService.checkSession().subscribe(
                response => {
                    if (response) {
                        this.gotoPage(PageRoutes.HOME.path);
                    }
                }
            );
        }

        return of(true);
    }

    public getRoutingParams(routingParams: Params, keys: Array<string>, stringKeys: Array<string> = []): RoutingParams {
        let params: RoutingParams = { hasParam: false };
        if (routingParams) {
            keys.forEach(key => {
                if (routingParams[key] && routingParams[key] != "") {
                    if (stringKeys.findIndex(nkey => nkey == key) > -1) {
                        params[key] = routingParams[key];
                    } else {
                        params[key] = +routingParams[key];
                    }
                    params.hasParam = true;
                }
            });
            return params;
        } else {
            return params;
        }
    }

}

export interface RoutingHeaderMenuItem {
    title: string;
    visible?: boolean;
    page?: any;
    childs?: Array<RoutingHeaderMenuItem>;
    icon?: string;
}

export declare type RoutingParams = {
    [key: string]: any;
    hasParam: boolean;
}