import { BaseApi } from './base.api';
import { Observable } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { SessionService } from 'src/service/session.service';
import { SessionResponse } from 'src/model/session/session-response.model';


export class SessionApi extends BaseApi {

    constructor(protected http: HttpClient, protected sessionService: SessionService) {
        super(http, sessionService);
    }

    /**
     * Request for login to service
     * 
     * @param email EMail for login credential
     * @param password Password for login credential
     */
    public login(email: string, password: string): Observable<SessionResponse> {
        return this.requestLogin(email, password);
    }

    /**
     * Request for logout from service
     * 
     * @param refreshToken Token value
     */
    public logout(refreshToken: string): Observable<any> {
        return this.requestLogout(refreshToken);
    }

    /**
     * Request for refresh token from service
     * 
     * @param refreshToken Token value
     */
    public refreshToken(refreshToken: string): Observable<SessionResponse> {
        return this.requestRefreshToken(refreshToken);
    }

}