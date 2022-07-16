import {Injectable} from '@angular/core';
import {CartItem} from "../common/cart-item";
import {Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CartService {

  cartItems: CartItem[] = [];
  totalPrice: Subject<number> = new Subject<number>;
  totalQuantity: Subject<number> = new Subject<number>;

  addToCart(cartItem: CartItem) {
    let existingCartItem = this.cartItems.find(item => item.id == cartItem.id);

    if (existingCartItem != undefined) {
      existingCartItem.quantity++;
    } else {
      this.cartItems.push(cartItem);
    }

    this.calculateCartTotals();
  }

  private calculateCartTotals() {
    let totalPriceNext = 0;
    let totalQuantityNext = 0;

    for (let cartItem of this.cartItems) {
      let pricePerItem = cartItem.unitPrice * cartItem.quantity;
      totalPriceNext += pricePerItem;
      totalQuantityNext += cartItem.quantity;

      console.log(`${cartItem.name}
                  (quantity=${cartItem.quantity},
                  price=${cartItem.unitPrice},
                  total price=${totalPriceNext.toFixed(2)},
                  total quantity=${totalQuantityNext})`
      );
      console.log("-------");
    }

    this.totalPrice.next(totalPriceNext);
    this.totalQuantity.next(totalQuantityNext);
  }
}
