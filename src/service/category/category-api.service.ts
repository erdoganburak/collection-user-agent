import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from '../base.service';
import { InteractionService } from '../interaction.service';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { SessionService } from '../session.service';
import { CategoryApi } from 'src/app/api/category/category.api';
import CategoryUpsertRequest from 'src/model/category/category-upsert-request.model';
import CategoryBasic from 'src/model/category/category-basic.model';
import CategoryGetAllResponse from 'src/model/category/category-get-all-response.model';
import CategoryGetAllRequest from 'src/model/category/category-get-all-request.model';

@Injectable()
export class CategoryApiService extends BaseService {

	private api: CategoryApi;

	constructor(private http: HttpClient,
		protected interactionService: InteractionService,
		protected sessionService: SessionService) {

		super(interactionService, sessionService);

		this.api = new CategoryApi(this.http, this.sessionService);
	}

	public saveCategory(request: CategoryUpsertRequest): Observable<CategoryBasic> {
		return this.api.saveCategory(request).pipe(catchError((error) => this.handleError(error, [])));
	}

	public deleteCategory(categoryId: string): Observable<CategoryBasic> {
		return this.api.deleteCategory(categoryId).pipe(catchError((error) => this.handleError(error, [])));
	}

	public updateCategory(categoryId: string, request: CategoryUpsertRequest): Observable<CategoryBasic> {
		return this.api.updateCategory(categoryId, request).pipe(catchError((error) => this.handleError(error, [])));
	}

	public getCategories(request: CategoryGetAllRequest): Observable<CategoryGetAllResponse> {
		return this.api.getCategories(request).pipe(catchError((error) => this.handleError(error, [])));
	}

	public getCategoryById(categoryId: string): Observable<CategoryGetAllResponse> {
		return this.api.getCategoryById(categoryId).pipe(catchError((error) => this.handleError(error, [])));
	}

}