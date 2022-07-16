import { Component, OnInit } from '@angular/core';
import {CartService} from "../../services/cart.service";

@Component({
  selector: 'app-cart-status',
  templateUrl: './cart-status.component.html',
  styleUrls: ['./cart-status.component.css']
})
export class CartStatusComponent implements OnInit {

  totalQuantity = 0;
  totalPrice = 0;
  constructor( private cartService: CartService) {}

  ngOnInit(): void {
    this.updateCartService();
  }

  private updateCartService() {
    this.cartService.totalPrice
                    .subscribe(totalPrice => this.totalPrice = totalPrice);

    this.cartService.totalQuantity
                    .subscribe(totalQuantity => this.totalQuantity = totalQuantity);
  }
}
