import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Product} from 'src/app/common/product';
import {ProductService} from 'src/app/services/product.service';
import {CartService} from "../../services/cart.service";
import {CartItem} from "../../common/cart-item";

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {

  product!: Product;


  constructor(private productService: ProductService,
              private cartService: CartService,
              private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => this.handleProductDetails());
  }

  handleProductDetails() {
    const id = +this.route.snapshot.paramMap.get("id")!;
    this.productService.getProductById(id).subscribe((data: Product) => this.product = data);
  }

  addToCart() {
    console.log(`Added product ==> ${this.product.name} ${this.product.unitPrice}`);
    let cartItem = new CartItem(this.product);
    this.cartService.addToCart(cartItem);
  }
}
