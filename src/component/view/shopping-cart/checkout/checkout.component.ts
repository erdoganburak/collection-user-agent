import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductApiService } from 'src/service/product/product-api.service';
import { ShoppingCartService } from 'src/service/shopping-cart.service';

@Component({
    selector: 'app-checkout',
    templateUrl: './checkout.component.html',
    styleUrls: ['./checkout.component.scss']
})

export class CheckoutComponent implements OnInit, OnDestroy {

    public checkoutForm: FormGroup;
    public submitted = false;

    constructor(private formBuilder: FormBuilder,
        private shoppingCartService: ShoppingCartService,
        private productService: ProductApiService) {

    }

    ngOnInit(): void {
        this.checkoutForm = this.formBuilder.group({
            name: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            address: ['', Validators.required],
            phone: ['', Validators.required],
            description: [''],
        });
    }

    ngOnDestroy(): void {

    }

    public get controls() { return this.checkoutForm.controls; }

    public onSubmit() {
        this.submitted = true;

        if (this.checkoutForm.invalid) {
            return;
        }

        /*
        this.collectibleMovieService.updateCollectibleMovie(this.data._id, this.createUpsertRequest()).subscribe(
            (response: CollectibleMovieBasic) => {
                this.interactionService.showMessage("Film başarıyla güncellendi.", ToastrType.Success, "")
                this.activeModal.close();
            },
            (err) => {
                this.interactionService.showMessage("Film güncellenirken hata oluştu.", ToastrType.Error, "")
            });
*/
    }

}
