import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RequestTypes } from 'src/constant/request-types.constant';
import CategoryBasic from 'src/model/category/category-basic.model';
import CategoryGetAllRequest from 'src/model/category/category-get-all-request.model';
import CategoryGetAllResponse from 'src/model/category/category-get-all-response.model';
import CategoryUpsertRequest from 'src/model/category/category-upsert-request.model';
import { SessionService } from 'src/service/session.service';
import { BaseApi } from '../base.api';

export class CategoryApi extends BaseApi {

	constructor(protected http: HttpClient, protected sessionService: SessionService) {
		super(http, sessionService);
	}

	public saveCategory(request: CategoryUpsertRequest): Observable<CategoryBasic> {
		return this.request(RequestTypes.POST, true, `/category/save-category`, request, "CategoryBasic");
	}

	public deleteCategory(categoryId: string): Observable<CategoryBasic> {
		return this.request(RequestTypes.DELETE, true, `/category/delete/${categoryId}`, null, "CategoryBasic");
	}

	public updateCategory(categoryId: string, request: CategoryUpsertRequest): Observable<CategoryBasic> {
		return this.request(RequestTypes.PATCH, true, `/category/update-category/${categoryId}`, request, "CategoryBasic");
	}

	public getCategoryById(categoryId: string): Observable<CategoryGetAllResponse> {
		return this.request(RequestTypes.GET, false, `/category/get/${categoryId}`, null, "CategoryGetAllResponse");
	}

	public getCategories(request: CategoryGetAllRequest): Observable<CategoryGetAllResponse> {
		return this.request(RequestTypes.POST, false, `/category/filter`, request, "CategoryGetAllResponse");
	}

}