import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrType } from 'src/app/enum/toastr.enum';
import { PageRoutes } from 'src/constant/page-routes.constant';
import { SessionResponse } from 'src/model/session/session-response.model';
import { InteractionService } from 'src/service/interaction.service';
import { RoutingService } from 'src/service/routing.service';
import { SessionService } from 'src/service/session.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit, OnDestroy {

    public loginForm: FormGroup;
    public submitted = false;

    constructor(
        private formBuilder: FormBuilder,
        private interactionService: InteractionService,
        private sessionService: SessionService,
        private routingService: RoutingService
    ) {

    }

    ngOnInit(): void {
        this.loginForm = this.formBuilder.group({
            username: ['', Validators.required],
            password: ['', Validators.required],
            rememberMe: [true]
        });
    }

    ngOnDestroy(): void {

    }

    public get controls() { return this.loginForm.controls; }

    public onSubmit() {
        this.submitted = true;
        if (this.loginForm.invalid) {
            this.interactionService.showMessage("Giriş yaparken hata oluştu", ToastrType.Error, "Hata")
            return;
        }

        this.sessionService.login(this.controls.username.value, this.controls.password.value, this.controls.rememberMe.value).subscribe(
            (response: SessionResponse) => {
                if (response) {
                    this.routingService.gotoPage(PageRoutes.MANAGEMENT_MONEY.path);
                }
            });
    }

}