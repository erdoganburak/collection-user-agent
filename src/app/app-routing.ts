import { Routes, RouterModule } from '@angular/router';
import { PageRoutes } from 'src/constant/page-routes.constant';
import { RoutingService } from 'src/service/routing.service';

import { ModuleWithProviders } from "@angular/core";
import { HomeComponent } from 'src/component/view/home/home.component';
import { MoneyComponent } from 'src/component/view/money/money.component';
import { MovieComponent } from 'src/component/view/movie/movie.component';
import { LoginComponent } from 'src/component/common/login/login.component';
import { ManagementMoneyComponent } from 'src/component/view/management/management-money/management-money.component';
import { ManagementMovieComponent } from 'src/component/view/management/management-movie/management-movie.component';
import { ManagementClippingComponent } from 'src/component/view/management/management-clipping/management-clipping.component';
import { ManagementEmissionComponent } from 'src/component/view/management/management-emission/management-emission.component';
import { ManagementCollectibleMoneyComponent } from 'src/component/view/management/management-collectible-money/management-collectible-money.component';
import { MoneyDetailComponent } from 'src/component/view/money/money-detail/money-detail.component';
import { ShoppingCartComponent } from 'src/component/view/shopping-cart/shopping-cart.component';
import { ManagementCategoryComponent } from 'src/component/view/management/management-category/management-category.component';
import { ManagementActorComponent } from 'src/component/view/management/management-actor/management-actor.component';
import { ManagementDirectorComponent } from 'src/component/view/management/management-director/management-director.component';
import { ManagementCollectibleMovieComponent } from 'src/component/view/management/management-collectible-movie/management-collectible-movie.component';
import { MovieDetailComponent } from 'src/component/view/movie/movie-detail/movie-detail.component';
import { ActorDetailComponent } from 'src/component/view/movie/actor-detail/actor-detail.component';
import { DirectorDetailComponent } from 'src/component/view/movie/director-detail/director-detail.component';
import { CategoryDetailComponent } from 'src/component/view/movie/category-detail/category-detail.component';
import { CheckoutComponent } from 'src/component/view/shopping-cart/checkout/checkout.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: PageRoutes.HOME.path,
    pathMatch: 'full'
  },
  {
    path: PageRoutes.LOGIN.path,
    component: LoginComponent,
    resolve: [RoutingService]
  },
  {
    path: PageRoutes.HOME.path,
    component: HomeComponent,
    canActivate: [RoutingService]
  },
  {
    path: PageRoutes.MONEY.path,
    component: MoneyComponent,
    canActivate: [RoutingService],
  },
  {
    path: PageRoutes.MONEY_DETAIL.path,
    component: MoneyDetailComponent,
    canActivate: [RoutingService],
  },
  {
    path: PageRoutes.MOVIES.path,
    component: MovieComponent,
    canActivate: [RoutingService]
  },
  {
    path: PageRoutes.MOVIE_DETAIL.path,
    component: MovieDetailComponent,
    canActivate: [RoutingService],
  },
  {
    path: PageRoutes.ACTOR_DETAIL.path,
    component: ActorDetailComponent,
    canActivate: [RoutingService],
  },
  {
    path: PageRoutes.DIRECTOR_DETAIL.path,
    component: DirectorDetailComponent,
    canActivate: [RoutingService],
  },
  {
    path: PageRoutes.CATEGORY_DETAIL.path,
    component: CategoryDetailComponent,
    canActivate: [RoutingService],
  },
  {
    path: PageRoutes.SHOPPING_CART.path,
    component: ShoppingCartComponent,
    canActivate: [RoutingService]
  },
  {
    path: PageRoutes.CHECKOUT.path,
    component: CheckoutComponent,
    canActivate: [RoutingService]
  },
  {
    path: PageRoutes.MANAGEMENT_MONEY.path,
    component: ManagementMoneyComponent,
    canActivate: [RoutingService],
  },
  {
    path: PageRoutes.MANAGEMENT_CLIPPING.path,
    component: ManagementClippingComponent,
    canActivate: [RoutingService],
  },
  {
    path: PageRoutes.MANAGEMENT_EMISSION.path,
    component: ManagementEmissionComponent,
    canActivate: [RoutingService],
  },
  {
    path: PageRoutes.MANAGEMENT_COLLECTIBLE_MONEY.path,
    component: ManagementCollectibleMoneyComponent,
    canActivate: [RoutingService],
  },
  {
    path: PageRoutes.MANAGEMENT_MOVIE.path,
    component: ManagementMovieComponent,
    canActivate: [RoutingService],
  },
  {
    path: PageRoutes.MANAGEMENT_MOVIE_ACTOR.path,
    component: ManagementActorComponent,
    canActivate: [RoutingService],
  },
  {
    path: PageRoutes.MANAGEMENT_MOVIE_DIRECTOR.path,
    component: ManagementDirectorComponent,
    canActivate: [RoutingService],
  },
  {
    path: PageRoutes.MANAGEMENT_MOVIE_CATEGORY.path,
    component: ManagementCategoryComponent,
    canActivate: [RoutingService],
  },
  {
    path: PageRoutes.MANAGEMENT_COLLECTIBLE_MOVIE.path,
    component: ManagementCollectibleMovieComponent,
    canActivate: [RoutingService],
  },
  {
    path: '**',
    redirectTo: PageRoutes.HOME.fullPath,
    pathMatch: 'full'
  }
];
export const RoutingProvider: ModuleWithProviders = RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload' });

