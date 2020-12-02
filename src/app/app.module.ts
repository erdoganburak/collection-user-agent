import { BrowserModule } from '@angular/platform-browser';
import { LOCALE_ID, NgModule } from '@angular/core';
import { NgxPaginationModule } from 'ngx-pagination';
import localeTr from '@angular/common/locales/tr';
import { AppComponent } from './app.component';
import { HeaderComponent } from '../component/common/header/header.component';
import { NgbModule, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { RoutingService } from 'src/service/routing.service';
import { RoutingProvider } from '../app/app-routing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InteractionService } from 'src/service/interaction.service';
import { WaitingResponseSpinnerComponent } from 'src/component/common/spinner/waiting-response-spinner.component';
import { HomeComponent } from 'src/component/view/home/home.component';
import { MovieComponent } from 'src/component/view/movie/movie.component';
import { MoneyComponent } from 'src/component/view/money/money.component';
import { MoneyApiService } from 'src/service/money/money-api.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ApiInterceptor } from './api/api.interceptor';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DialogComponent } from 'src/component/common/dialog/dialog.component';
import { DenemeComponent } from 'src/component/view/deneme/deneme.component';
import { LoginComponent } from 'src/component/common/login/login.component';
import { SessionService } from 'src/service/session.service';
import { ManagementMoneyComponent } from 'src/component/view/management/management-money/management-money.component';
import { ManagementMovieComponent } from 'src/component/view/management/management-movie/management-movie.component';
import { ManagementClippingComponent } from 'src/component/view/management/management-clipping/management-clipping.component';
import { ManagementEmissionComponent } from 'src/component/view/management/management-emission/management-emission.component';
import { MenuNavigationComponent } from 'src/component/view/menu/menu-navigation/menu-navigation.component';
import { MenuItemComponent } from 'src/component/view/menu/menu-item/menu-item.component';
import { MenuTitleComponent } from 'src/component/view/menu/menu-title/menu-title.component';
import { ManagementHeaderComponent } from 'src/component/view/management/management-header/management-header.component';
import { ClippingApiService } from 'src/service/clipping/clipping-api.service';
import { PaginationComponent } from 'src/component/common/pagination/pagination.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { ManagementClippingUpsertModal } from 'src/component/view/management/management-clipping-upsert/management-clipping-upsert-modal.component';
import { ManagementEmissionUpsertModal } from 'src/component/view/management/management-emission-upsert/management-emission-upsert-modal.component';
import { EmissionApiService } from 'src/service/emission/emission-api.service';
import { ManagementCollectibleMoneyComponent } from 'src/component/view/management/management-collectible-money/management-collectible-money.component';
import { ManagementCollectibleMoneyUpsertModal } from 'src/component/view/management/management-collectible-money-upsert/management-collectible-money-upsert-modal.component';
import { RxReactiveFormsModule } from '@rxweb/reactive-form-validators'; // <-- #2 import module
import { CollectibleMoneyApiService } from 'src/service/collectible-money/collectible-money-api.service';
import { ProductApiService } from 'src/service/product/product-api.service';
import { registerLocaleData } from '@angular/common';
import { MoneyItemComponent } from 'src/component/view/money/money-item/money-item.component';
import { TitleComponent } from 'src/component/common/title/title.component';
import { MoneyDetailComponent } from 'src/component/view/money/money-detail/money-detail.component';
import player from 'lottie-web';

import { faClipboardList, faCompactDisc, faFilm, faKey, faPlus, faShoppingCart, faTimes, faUsers, faVideo } from '@fortawesome/free-solid-svg-icons';
import { faCog } from '@fortawesome/free-solid-svg-icons';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { faMoneyBillAlt } from '@fortawesome/free-solid-svg-icons';
import { faCoins } from '@fortawesome/free-solid-svg-icons';
import { faMoneyCheckAlt } from '@fortawesome/free-solid-svg-icons';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { ImageModal } from 'src/component/common/image-modal/image-modal.component';
import { NgxImageZoomModule } from 'ngx-image-zoom';
import { ShoppingCartComponent } from 'src/component/view/shopping-cart/shopping-cart.component';
import { LottieModule } from 'ngx-lottie';
import { EmptyCartComponent } from 'src/component/view/shopping-cart/empty-cart/empty-cart.component';
import { MoneyShowcaseComponent } from 'src/component/view/money/money-showcase/money-showcase.component';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { ClippingSelectComponent } from 'src/component/common/clipping-select/clipping-select.component';
import { ManagementClippingInsertModal } from 'src/component/view/management/management-clipping-insert-modal/management-clipping-insert-modal.component';
import { EmissionSelectComponent } from 'src/component/common/emission-select/emission-select.component';
import { ManagementCategoryComponent } from 'src/component/view/management/management-category/management-category.component';
import { CategoryApiService } from 'src/service/category/category-api.service';
import { ManagementCategoryUpsertModal } from 'src/component/view/management/management-category-upsert/management-category-upsert-modal.component';
import { CategorySelectComponent } from 'src/component/common/category-select/category-select.component';
import { ManagementCategoryInsertModal } from 'src/component/view/management/management-category-insert-modal/management-category-insert-modal.component';
import { ActorApiService } from 'src/service/actor/actor-api.service';
import { DirectorApiService } from 'src/service/director/director-api.service';
import { ManagementActorComponent } from 'src/component/view/management/management-actor/management-actor.component';
import { ManagementActorUpsertModal } from 'src/component/view/management/management-actor-upsert/management-actor-upsert-modal.component';
import { ManagementDirectorComponent } from 'src/component/view/management/management-director/management-director.component';
import { ManagementDirectorUpsertModal } from 'src/component/view/management/management-director-upsert/management-director-upsert-modal.component';
import { ActorSelectComponent } from 'src/component/common/actor-select/actor-select.component';
import { DirectorSelectComponent } from 'src/component/common/director-select/director-select.component';
import { ManagementCollectibleMovieComponent } from 'src/component/view/management/management-collectible-movie/management-collectible-movie.component';
import { CollectibleMovieApiService } from 'src/service/collectible-movie/collectible-movie-api.service';
import { ManagementCollectibleMovieUpsertModal } from 'src/component/view/management/management-collectible-movie-upsert/management-collectible-movie-upsert-modal.component';
import { MovieShowcaseComponent } from 'src/component/view/movie/movie-showcase/movie-showcase.component';
import { MovieItemComponent } from 'src/component/view/movie/movie-item/movie-item.component';
import { MovieFormatSelectComponent } from 'src/component/common/movie-format-select/movie-format-select.component';
import { MovieDetailComponent } from 'src/component/view/movie/movie-detail/movie-detail.component';
import { ActorDetailComponent } from 'src/component/view/movie/actor-detail/actor-detail.component';
import { DirectorDetailComponent } from 'src/component/view/movie/director-detail/director-detail.component';
import { CategoryDetailComponent } from 'src/component/view/movie/category-detail/category-detail.component';
import { ShoppingCartService } from 'src/service/shopping-cart.service';
import { ShoppingCartItemComponent } from 'src/component/view/shopping-cart/shopping-cart-item/shopping-cart-item.component';

export function playerFactory() {
  return player;
}
@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    PaginationComponent,
    HomeComponent,
    MovieComponent,
    MoneyComponent,
    WaitingResponseSpinnerComponent,
    DialogComponent,
    LoginComponent,
    ManagementMoneyComponent,
    ManagementMovieComponent,
    ManagementClippingComponent,
    ManagementEmissionComponent,
    MenuNavigationComponent,
    MenuTitleComponent,
    MenuItemComponent,
    ManagementHeaderComponent,
    ManagementClippingUpsertModal,
    ManagementEmissionUpsertModal,
    ManagementCollectibleMoneyComponent,
    ManagementCollectibleMoneyUpsertModal,
    DenemeComponent,
    MoneyItemComponent,
    TitleComponent,
    MoneyDetailComponent,
    ImageModal,
    ShoppingCartComponent,
    EmptyCartComponent,
    MoneyShowcaseComponent,
    ClippingSelectComponent,
    ManagementClippingInsertModal,
    EmissionSelectComponent,
    ManagementCategoryComponent,
    ManagementCategoryUpsertModal,
    CategorySelectComponent,
    ManagementCategoryInsertModal,
    ManagementActorComponent,
    ManagementActorUpsertModal,
    ManagementDirectorComponent,
    ManagementDirectorUpsertModal,
    ActorSelectComponent,
    DirectorSelectComponent,
    ManagementCollectibleMovieComponent,
    ManagementCollectibleMovieUpsertModal,
    MovieShowcaseComponent,
    MovieItemComponent,
    MovieFormatSelectComponent,
    MovieDetailComponent,
    ActorDetailComponent,
    DirectorDetailComponent,
    CategoryDetailComponent,
    ShoppingCartItemComponent
  ],
  imports: [
    FormsModule,
    BrowserModule,
    RoutingProvider,
    NgbModule,
    FontAwesomeModule,
    HttpClientModule,
    ReactiveFormsModule,
    NzSelectModule,
    NzSpinModule,
    [LottieModule.forRoot({ player: playerFactory })],
    ToastrModule.forRoot({
      timeOut: 4000,
      positionClass: 'toast-bottom-right',
      preventDuplicates: true,
    }),
    BrowserAnimationsModule,
    NgxPaginationModule,
    NgMultiSelectDropDownModule.forRoot(),
    RxReactiveFormsModule,
    NgxImageZoomModule
  ],
  exports: [
    NgbModule,
    ToastrModule
  ],
  providers: [
    {
      provide: LOCALE_ID,
      useValue: 'tr-TR'
    },

    NgbActiveModal,
    RoutingService,
    InteractionService,
    MoneyApiService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ApiInterceptor,
      multi: true
    },
    SessionService,
    ClippingApiService,
    EmissionApiService,
    CollectibleMoneyApiService,
    ProductApiService,
    CategoryApiService,
    ActorApiService,
    DirectorApiService,
    CollectibleMoneyApiService,
    CollectibleMovieApiService,
    ShoppingCartService
  ],
  entryComponents: [
    DialogComponent,
    DenemeComponent,
    ManagementClippingUpsertModal,
    ManagementEmissionUpsertModal,
    ManagementCollectibleMoneyUpsertModal,
    ImageModal,
    ManagementClippingInsertModal,
    ManagementCategoryUpsertModal,
    ManagementCategoryInsertModal,
    ManagementActorUpsertModal,
    ManagementDirectorUpsertModal,
    ManagementCollectibleMovieUpsertModal
  ],
  bootstrap: [AppComponent]
})

export class AppModule {
  constructor(library: FaIconLibrary) {
    registerLocaleData(localeTr);
    this.addIconsToLibrary(library);
  }

  private addIconsToLibrary(library: FaIconLibrary): void {
    library.addIcons(faKey);
    library.addIcons(faCog);
    library.addIcons(faSignOutAlt);
    library.addIcons(faBars);
    library.addIcons(faUserCircle);
    library.addIcons(faMoneyBillAlt);
    library.addIcons(faCoins);
    library.addIcons(faMoneyCheckAlt);
    library.addIcons(faTrash);
    library.addIcons(faEdit);
    library.addIcons(faShoppingCart);
    library.addIcons(faPlus);
    library.addIcons(faTimes);
    library.addIcons(faFilm);
    library.addIcons(faUsers);
    library.addIcons(faVideo);
    library.addIcons(faClipboardList);
    library.addIcons(faCompactDisc);
  }

}
