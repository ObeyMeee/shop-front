import {Component, OnInit} from '@angular/core';
import {CartItem} from "../../common/cart-item";
import {CartService} from "../../services/cart.service";

@Component({
  selector: 'app-cart-details',
  templateUrl: './cart-details.component.html',
  styleUrls: ['./cart-details.component.css']
})
export class CartDetailsComponent implements OnInit {
  cartItems: CartItem[] = [];
  totalPrice: number = 0;
  totalQuantity: number = 0;

  constructor(private cartService: CartService) {
  }

  ngOnInit(): void {
    this.setCartItems();
  }

  incrementQuantity(cartItem: CartItem) {
    this.cartService.addToCart(cartItem)
  }

  decrementQuantity(cartItem: CartItem) {
    cartItem.quantity--;
    if (cartItem.quantity == 0) {
      this.cartService.removeFromCart(cartItem);
    } else {
      this.cartService.calculateCartTotals();
    }
  }

  remove(cartItem: CartItem) {
    this.cartService.removeFromCart(cartItem);
    this.cartService.calculateCartTotals();
  }

  private setCartItems() {
    this.cartItems = this.cartService.cartItems;

    this.cartService.totalPrice.subscribe(data => this.totalPrice = data);
    this.cartService.totalQuantity.subscribe(data => this.totalQuantity = data);

    this.cartService.calculateCartTotals();
  }
}
