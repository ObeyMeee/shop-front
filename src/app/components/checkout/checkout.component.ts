import {Component, OnInit} from '@angular/core';
import {CartService} from "../../services/cart.service";
import {FormBuilder, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  checkoutFormGroup!: FormGroup;

  totalQuantity!: number;
  totalPrice!: number;

  constructor(private cartService: CartService,
              private formBuilder: FormBuilder) {
  }

  ngOnInit(): void {
    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: [""],
        lastName: [""],
        email: [""]
      }),
      shippingAddress: this.formBuilder.group({
        country: [""],
        state: [""],
        city: [""],
        street: [""],
        zipCode: [],
      }),
      billingAddress: this.formBuilder.group({
        country: [""],
        state: [""],
        city: [""],
        street: [""],
        zipCode: [],
      }),
      creditCard: this.formBuilder.group({
        cardType: [""],
        nameOnCard: [""],
        cardNumber: [""],
        securityCode: [""],
        expirationMonth: [""],
        expirationYear: [""],
      })
    })
    this.cartService.totalQuantity.subscribe(data => this.totalQuantity = data);
    this.cartService.totalPrice.subscribe(data => this.totalPrice = data);
  }

  onSubmit() {
    console.log(`Customer data ==> ${this.checkoutFormGroup.get("customer")?.value.firstName}`);
    console.log(`Customer data ==> ${this.checkoutFormGroup.get("customer")?.value.lastName}`);
    console.log(`Customer data ==> ${this.checkoutFormGroup.get("customer")?.value.email}`);
  }

  copyShippingAddressToBillingAddress(event: Event) {
    if((event.target as HTMLInputElement).checked){
      this.checkoutFormGroup.controls['billingAddress']
        .setValue(this.checkoutFormGroup.controls['shippingAddress'].value);
    }else{
      this.checkoutFormGroup.controls['billingAddress'].reset();
    }
  }
}
