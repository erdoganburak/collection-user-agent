import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { HeaderNames } from 'src/constant/header-names.constant';
import { SessionService } from 'src/service/session.service';
import { SessionResponse } from 'src/model/session/session-response.model';
import { RequestTypes } from 'src/constant/request-types.constant';

export class BaseApi {

    constructor(protected http: HttpClient, protected sessionService: SessionService) {

    }

    /**
     * Default request method to Api
     */
    private requestApi<T>(
        method: string,
        auth: boolean,
        url: string,
        body: any = null,
        ctor: string = null,
        isWaitingBlob: boolean = false,
        isEmptyResponse: boolean = false,
        waitingStateActive: boolean = true,
        isFileUpload?: boolean
    ): Observable<T> {
        const path = environment.API_BASE_PATH + url;

        let headers = new HttpHeaders()
            .set('If-Modified-Since', 'Mon, 26 Jul 1997 05:00:00 GMT')
            .set('Cache-Control', 'no-cache')
            .set('Pragma', 'no-cache');


        if (auth) {
            headers = headers.set('Authorization', 'Bearer ' + this.sessionService.currentAccessToken);
        }

        let requestOptions = new Object();

        if (isWaitingBlob) {
            requestOptions["responseType"] = 'blob';
        }

        if (isEmptyResponse) {
            requestOptions["responseType"] = 'text';
        }

        headers = headers.set(HeaderNames.WaitingState, String(waitingStateActive));

        if (ctor) {
            headers = headers.set(HeaderNames.RequestType, String(ctor));
        }

        if (method === "POST") {
            if (body === null || body === undefined) {
                throw new Error('Required parameter body was null or undefined when calling api method.');
            }
        }
        if (isFileUpload) {
            // Set content-type header as json for POST requests
            headers = headers.delete('Content-Type');
            // Set body of request
            requestOptions["body"] = body;
        } else {
            if (body) {
                headers = headers.set('Content-Type', 'application/json');
                requestOptions["body"] = body === null ? '' : JSON.stringify(body);
            }
        }


        requestOptions["headers"] = headers;

        return this.http.request<T>(method, path, requestOptions);
    }

    /**
    *  Request method to Api for uploading files
    */
    private requestApiUploadFile<T>(
        method: string,
        auth: boolean,
        url: string,
        body: any = null,
        ctor: string = null,
        isWaitingBlob: boolean = false,
        isEmptyResponse: boolean = false,
        waitingStateActive: boolean = true
    ): Observable<T> {

        const path = environment.API_BASE_PATH + url;

        let headers = new HttpHeaders()
            .set('If-Modified-Since', 'Mon, 26 Jul 1997 05:00:00 GMT')
            .set('Cache-Control', 'no-cache')
            .set('Pragma', 'no-cache');

        if (auth) {
            headers = headers.set('Authorization', 'Bearer ' + this.sessionService.currentAccessToken);
        }

        let requestOptions = new Object();

        if (isWaitingBlob) {
            requestOptions["responseType"] = 'blob';
        }

        if (isEmptyResponse) {
            requestOptions["responseType"] = 'text';
        }

        headers = headers.set(HeaderNames.WaitingState, String(waitingStateActive));

        if (ctor) {
            headers = headers.set(HeaderNames.RequestType, String(ctor));
        }

        if (method === "POST") {
            // verify required parameter 'body' is not null or undefined
            if (body === null || body === undefined) {
                throw new Error('Required parameter body was null or undefined when calling api method.');
            }

            headers = headers.set('Content-Type', 'multipart/form-data');
            requestOptions["body"] = body;
        }

        requestOptions["headers"] = headers;

        return this.http.request<T>(method, path, requestOptions);
    }

    protected request<T>(
        method: string,
        auth: boolean,
        url: string,
        body: any = null,
        ctor: string = null,
        isWaitingBlob: boolean = false,
        isEmptyResponse: boolean = false,
        waitingStateActive: boolean = true
    ): Observable<T> {
        return this.requestApi(method, auth, url, body, ctor, isWaitingBlob, isEmptyResponse, waitingStateActive);
    }

    /**
     * Request for POST method
     *
     * @param url 					Endpoint address of request
     * @param formData 				Request file
     * @param modelClassName 		Name of class to create instance when response received
     * @param apiPath 				Related api path to call request from
     * @param modelType 			Type of model to find class name in related barrel
     * @param waitingStateActive 	Enable spinner for request while waiting request
     */
    protected requestFormData<T>(method: string,
        auth: boolean,
        url: string,
        formData: FormData = null,
        ctor: string = null,
        isWaitingBlob: boolean = false,
        isEmptyResponse: boolean = false,
        waitingStateActive: boolean = true): Observable<T> {
        return this.requestApi(method, auth, url, formData, ctor, isWaitingBlob, isEmptyResponse, waitingStateActive, true);
    }

    protected requestGetFile<T>(
        method: string,
        url: string,
        body: any = null,
        ctor: string = null,
        isWaitingBlob: boolean = true,
        isEmptyResponse: boolean = false,
        waitingStateActive: boolean = true
    ): Observable<Blob> {
        return this.requestApi(method, false, url, body, ctor, isWaitingBlob, isEmptyResponse, waitingStateActive);
    }

    protected requestUploadFile<T>(
        method: string,
        auth: boolean,
        url: string,
        body: any = null,
        ctor: string = null,
        isWaitingBlob: boolean = false,
        isEmptyResponse: boolean = false,
        waitingStateActive: boolean = true
    ): Observable<T> {
        return this.requestApiUploadFile(method, auth, url, body, ctor, isWaitingBlob, isEmptyResponse, waitingStateActive);
    }

    protected requestLogin(email: string, password: string): Observable<SessionResponse> {

        if (email == null) {
            throw new Error('Required parameter email was null or undefined when calling login method.');
        }

        if (password == null) {
            throw new Error('Required parameter password was null or undefined when calling login method.');
        }

        let reqBody = {
            email: email,
            password: password
        }

        return this.request(RequestTypes.POST, false, `/auth/login`, reqBody, "SessionResponse");

    }

    protected requestRefreshToken(refreshToken: string): Observable<SessionResponse> {

        if (refreshToken == null) {
            throw new Error('Required parameter refreshToken was null or undefined when refresh token method.');
        }

        let reqBody = {
            refreshToken: refreshToken
        }

        return this.request(RequestTypes.POST, false, `/auth/refresh-token`, reqBody, "SessionResponse");
    }

    protected requestLogout(refreshToken: string): Observable<any> {
        if (refreshToken == null) {
            throw new Error('Required parameter refreshToken was null or undefined when calling logout method.');
        }

        let reqBody = {
            refreshToken: refreshToken
        }

        return this.request(RequestTypes.DELETE, false, `/auth/logout`, reqBody, "");
    }

}
