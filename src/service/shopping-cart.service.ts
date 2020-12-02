import { Injectable } from '@angular/core';
import { LocalStorageKey } from 'src/app/enum/system/local-storage-key.enum';
import { InteractionService } from './interaction.service';
import { ToastrType } from 'src/app/enum/toastr.enum';

@Injectable()
export class ShoppingCartService {

	private shoppingCart: Array<string>; // Array of productids

	constructor(private interactionService: InteractionService) {
		this.shoppingCart = [];
		let item = localStorage.getItem(LocalStorageKey.CART);
		if (item) {
			this.shoppingCart = JSON.parse(item);
		}
	}

	public addToCart(productId: string) {
		this.shoppingCart.push(productId);
		localStorage.setItem(LocalStorageKey.CART, JSON.stringify(this.shoppingCart))
		this.interactionService.showMessage("Ürün alışveriş sepetinize eklendi.", ToastrType.Success, "")
	}

	public removeFromCart(productId: string) {
		this.shoppingCart = this.shoppingCart.filter(id => id != productId);
		localStorage.setItem(LocalStorageKey.CART, JSON.stringify(this.shoppingCart))
	}

	public getShoppingCartItems(): Array<string> {
		return this.shoppingCart;
	}

}