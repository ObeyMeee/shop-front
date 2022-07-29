import {Injectable} from '@angular/core';
import {CartItem} from "../common/cart-item";
import {BehaviorSubject, Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CartService {

  cartItems: CartItem[] = [];
  totalPrice: Subject<number> = new BehaviorSubject<number>(0);
  totalQuantity: Subject<number> = new BehaviorSubject<number>(0);

  storage: Storage = localStorage;

  constructor() {
    const data = JSON.parse(this.storage.getItem('cartItems'));
    if (data != null){
      this.cartItems = data;

      this.calculateCartTotals();
    }
  }

  addToCart(cartItem: CartItem) {
    let existingCartItem = this.cartItems.find(item => item.id == cartItem.id);

    if (existingCartItem != undefined) {
      existingCartItem.quantity++;
    } else {
      this.cartItems.push(cartItem);
    }

    this.calculateCartTotals();
  }

  public calculateCartTotals() {
    let totalPriceNext = 0;
    let totalQuantityNext = 0;

    for (let cartItem of this.cartItems) {
      let pricePerItem = cartItem.unitPrice * cartItem.quantity;
      totalPriceNext += pricePerItem;
      totalQuantityNext += cartItem.quantity;

      this.persistCartItems();
    }

    this.totalPrice.next(totalPriceNext);
    this.totalQuantity.next(totalQuantityNext);
  }

  persistCartItems(){
    this.storage.setItem('cartItems', JSON.stringify(this.cartItems));
  }

  removeFromCart(cartItem: CartItem) {
    const index = this.cartItems.indexOf(cartItem);

    if (index != -1) {
      this.cartItems.splice(index, 1);
    }
  }
}
