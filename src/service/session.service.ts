
import { HttpClient } from '@angular/common/http';
import { Injectable, Inject } from '@angular/core';
import { throwError as observableThrowError, Observable, Subject, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import * as moment from 'moment';
import { BaseService } from './base.service';
import { InteractionService } from './interaction.service';
import { Router } from '@angular/router';
import { PageRoutes } from '../constant/page-routes.constant';
import { LocalStorageKey } from 'src/app/enum/system/local-storage-key.enum';
import { ToastrType } from 'src/app/enum/toastr.enum';
import { SessionResponse } from 'src/model/session/session-response.model';
import { SessionApi } from 'src/app/api/session.api';

@Injectable()
export class SessionService extends BaseService {

	private apiSession: SessionApi;
	private refreshTimer: any;

	private sourceLoginStatusChanged = new Subject<boolean>();
	private sourceTokenRefreshed = new Subject();
	private sourceTokenFailed = new Subject();

	public onLoginStatusChanged = this.sourceLoginStatusChanged.asObservable();
	public onTokenRefreshed = this.sourceTokenRefreshed.asObservable();
	public onTokenFailed = this.sourceTokenFailed.asObservable();

	constructor(private http: HttpClient,
		private router: Router,
		protected interactionService: InteractionService) {
		super(interactionService, null);

		this.apiSession = new SessionApi(this.http, this);
	}

	get isLoggedIn(): boolean {
		return this.currentAccessToken !== null && this.currentAccessToken !== undefined
			&& this.currentExpireDate && (new Date().getTime() - this.currentExpireDate.getTime() < 0);
	}

	get currentAccessToken(): string {
		return localStorage.getItem(LocalStorageKey.ACCESSTOKEN);
	}

	get currentExpireDate(): Date {
		let dateString: string = localStorage.getItem(LocalStorageKey.EXPIREDATE);
		return dateString ? moment(dateString).toDate() : null;
	}

	get keepLoggedIn(): boolean {
		let loggedInSelection: boolean = localStorage.getItem(LocalStorageKey.KEEPLOGGEDIN) === "true";
		return loggedInSelection === null ? false : loggedInSelection;
	}

	/**
	 * Calls login request to api server and handles response
	 *
	 * @param email EMail for login credential
	 * @param password Password for login credential
	 * @param keepLoggedIn Selection to keep him/her logged in until refresh token expires
	 */
	public login(email: string, password: string, keepLoggedIn: boolean): Observable<SessionResponse> {
		let keepLoggedInSelection: boolean = keepLoggedIn;

		return this.apiSession.login(email, password).pipe(
			map((response: SessionResponse) => {
				let currentSession = this.saveSession(response, keepLoggedInSelection);
				this.informLoginStatusChanged();
				return currentSession;
			}),
			catchError((error) => this.handleLoginError(error))
		);
	}

	/**
	 * Clears current session and navigates to login page
	 */
	public logout(): void {
		console.log("logging out")
		let refreshTokenValue = localStorage.getItem(LocalStorageKey.REFRESHTOKEN);
		if (refreshTokenValue) {
			let observable = this.apiSession.logout(refreshTokenValue);
			observable.subscribe(response => {
				this.afterLogout()
			}, error => {
				this.afterLogout()
			})
		}
	}

	private afterLogout(): void {
		this.clearSession();
		this.informLoginStatusChanged();
		this.router.navigate([PageRoutes.LOGIN.fullPath]);
	}

	/**
	* Tries refresh token and handles response
	*/
	public tryRefreshToken(): Observable<boolean> {
		console.log("tryRefreshToken");
		clearInterval(this.refreshTimer);
		return this.refreshToken().pipe(
			map((response: SessionResponse) => {
				this.informTokenRefreshed();
				return true;
			},
				(error: any) => {
					this.refreshTokenFailed(error);
					return false;
				}
			)
		);
	}

	/**
	 * Saves session details to local storage of browser and calls starting timer to refresh token
	 *
	 * @param sessionInfo Session details that given from api server
	 * @param keepLoggedIn Selection to keep him/her logged in until refresh token expires
	 */
	private saveSession(currentSession: SessionResponse, keepLoggedIn: boolean): SessionResponse {

		let expireDateValue = moment().add(currentSession.accessTokenExpiresIn, 's').toDate();

		localStorage.setItem(LocalStorageKey.ACCESSTOKEN, currentSession.accessToken);
		localStorage.setItem(LocalStorageKey.REFRESHTOKEN, currentSession.refreshToken);
		localStorage.setItem(LocalStorageKey.EXPIREDATE, moment(expireDateValue).format());
		localStorage.setItem(LocalStorageKey.KEEPLOGGEDIN, String(keepLoggedIn));

		console.log("save session starting timer")
		this.startRefreshTokenTimer();
		return currentSession;
	}

	/**
	 * Clears session details from local storage of browser
	 */
	private clearSession(): void {
		localStorage.removeItem(LocalStorageKey.ACCESSTOKEN);
		localStorage.removeItem(LocalStorageKey.REFRESHTOKEN);
		localStorage.removeItem(LocalStorageKey.EXPIREDATE);
		this.informLoginStatusChanged();
	}

	/**
	 * Sends information about current logged in status to observers
	 */
	private informLoginStatusChanged(): void {
		this.sourceLoginStatusChanged.next(this.isLoggedIn);
	}

	/**
	 * Sends information about token is refreshed
	 */
	private informTokenRefreshed(): void {
		this.sourceTokenRefreshed.next([]);
	}

	/**
	 * Sends information about token is failed
	 */
	private informTokenFailed(): void {
		this.sourceTokenFailed.next([]);
	}

	/**
	 * Starts a timer according to expire date of token to refresh it
	 */
	private startRefreshTokenTimer(): void {
		console.log("STARTING TIMER")
		this.refreshTimer = setInterval(() => {
			this.tryRefreshToken().subscribe(
				(isLoggedIn: boolean) => {

				}
			);
		}, (this.currentExpireDate.getTime() - new Date().getTime() - 10000)); // before 10sec
	}

	/**
	 * Checks stored refresh token value and calls api server if token is valid
	 */
	private refreshToken(): Observable<SessionResponse> {
		let refreshTokenValue = localStorage.getItem(LocalStorageKey.REFRESHTOKEN);

		if (refreshTokenValue != null) {
			return this.apiSession.refreshToken(refreshTokenValue).pipe(
				map((response: any) => {
					return this.saveSession(response, this.keepLoggedIn);

				}),
				catchError((error) => this.handleRefreshTokenError(error))
			);
		}
		else {
			return observableThrowError(new Error("Invalid refresh token!"));
		}
	}

	/**
	 * Handles refresh token error and logout
	 *
	 * @param error Related error object
	 */
	private refreshTokenFailed(error: any): void {
		this.handleRefreshTokenError(error);
	}

	/**
	 * Checks current session is valid or not
	 * If session expired and user selected 'keep logged in' before, calls refresh token
	 */
	public checkSession(): Observable<boolean> {
		// If any expire date exists, checks it before
		if (this.currentExpireDate) {
			// If expire date value is expired checks refresh token or logout
			if (moment().isAfter(this.currentExpireDate)) {
				// If user selected 'keep me logged in', tries refreshing token
				// else logout and forces user to re-login
				if (this.keepLoggedIn) {
					return this.tryRefreshToken().pipe(
						map(
							response => {
								return response;
							}
						)
					);
				}
				else {
					this.logout();
					return of(true);
				}
			}
			else if (!this.refreshTimer) {
				// If expire date value is valid and refresh timer has not been set yet, starts timer
				this.startRefreshTokenTimer();
				return of(true);
			} else {
				console.log("FINE")
				return of(true);
			}
		} else {
			return of(false);
		}
	}

	/**
	 * Checks status of error response after login request
	 * Shows message if required
	 *
	 * @param error Related error object
	 */
	private handleLoginError(error: any) {
		if (!error || !error.status || error.status === 0) {
			this.informTokenFailed();
			//this.interactionService.showMessage('SERVICE_MESSAGES.DEFAULT_ERROR_CONNECTION', ToastrType.Error);
		}

		if (error.status === 400) {
			this.interactionService.showMessage('Kullanıcı hesabı bulunamadı. Lütfen giriş bilgilerinizi kontrol ediniz!', ToastrType.Error);
		}

		return super.handleError(error, []);
	}


	private handleLogoutError(error: any) {
		console.log("handle logout error")
		this.interactionService.showMessage('Çıkış yaparken hata oluştu', ToastrType.Error);
		this.clearSession();
		this.router.navigate([PageRoutes.LOGIN.fullPath]);
		this.informLoginStatusChanged();
		return super.handleError(error, []);
	}


	/**
	 * Checks status of error response after refresh token request
	 * Shows message if required
	 *
	 * @param error Related error object
	 */
	private handleRefreshTokenError(error: any) {
		console.log("handle refresh token error")
		this.logout();
		return super.handleError(error, []);
	}


}
