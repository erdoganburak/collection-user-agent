import { Injectable } from '@angular/core';
import { LocalStorageKey } from 'src/app/enum/system/local-storage-key.enum';
import { InteractionService } from './interaction.service';
import { ToastrType } from 'src/app/enum/toastr.enum';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddedToCartModal } from 'src/component/view/added-to-cart/added-to-cart-modal.component';

@Injectable()
export class ShoppingCartService {

	private shoppingCart: Array<string>; // Array of productids

	constructor(private interactionService: InteractionService,
		private modalService: NgbModal) {
		this.shoppingCart = [];
		let item = localStorage.getItem(LocalStorageKey.CART);
		if (item) {
			this.shoppingCart = JSON.parse(item);
		}
	}

	public addToCart(productId: string) {
		if (this.shoppingCart.indexOf(productId) === -1) {
			this.shoppingCart.push(productId);
			localStorage.setItem(LocalStorageKey.CART, JSON.stringify(this.shoppingCart))
			const modalRef = this.modalService.open(AddedToCartModal, { centered: true, size: "lg" });
			modalRef.result.then(() => {

			}, (reason) => {

			});
		} else {
			this.interactionService.showMessage("Ürün daha önce alışveriş sepetine eklenmiştir.", ToastrType.Error, "")
		}
	}

	public removeFromCart(productId: string) {
		this.shoppingCart = this.shoppingCart.filter(id => id != productId);
		localStorage.setItem(LocalStorageKey.CART, JSON.stringify(this.shoppingCart))
	}

	public getShoppingCartItems(): Array<string> {
		return this.shoppingCart;
	}

}