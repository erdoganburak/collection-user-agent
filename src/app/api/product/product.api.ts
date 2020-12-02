import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RequestTypes } from 'src/constant/request-types.constant';
import GetProductsRequest from 'src/model/product/get-products-request.model';
import Product from 'src/model/product/product';
import { SessionService } from 'src/service/session.service';
import { BaseApi } from '../base.api';

export class ProductApi extends BaseApi {

	constructor(protected http: HttpClient, protected sessionService: SessionService) {
		super(http, sessionService);
	}

	public getProductById(productId: string): Observable<any> {
		return this.request(RequestTypes.GET, true, `/product/get/${productId}`, null, "");
	}

	public getProductsByIds(request: GetProductsRequest): Observable<Array<Product>> {
		return this.request(RequestTypes.POST, false, `/product/get-products/`, request, "");
	}

	public deleteProduct(productId: string): Observable<any> {
		return this.request(RequestTypes.DELETE, true, `/product/delete/${productId}`, null, "");
	}

}