import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from '../base.service';
import { InteractionService } from '../interaction.service';

import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { SessionService } from '../session.service';
import { ProductApi } from 'src/app/api/product/product.api';
import GetProductsRequest from 'src/model/product/get-products-request.model';

@Injectable()
export class ProductApiService extends BaseService {

    private api: ProductApi;

    constructor(private http: HttpClient,
        protected interactionService: InteractionService,
        protected sessionService: SessionService) {

        super(interactionService, sessionService);

        this.api = new ProductApi(this.http, this.sessionService);
    }

    public getProductById(productId: string): Observable<any> {
        return this.api.getProductById(productId).pipe(catchError((error) => this.handleError(error, [])));
    }

    public getProducts(request: GetProductsRequest): Observable<any> {
        return this.api.getProductsByIds(request).pipe(catchError((error) => this.handleError(error, [])));
    }

    public deleteProduct(productId: string): Observable<any> {
        return this.api.deleteProduct(productId).pipe(catchError((error) => this.handleError(error, [])));
    }

}