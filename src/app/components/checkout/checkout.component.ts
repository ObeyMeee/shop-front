import {Component, OnInit} from '@angular/core';
import {CartService} from "../../services/cart.service";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {ExpirationDateService} from "../../services/expiration-date.service";
import {Country} from "../../common/country";
import {State} from "../../common/state";
import {AddressService} from "../../services/address.service";
import {FormValidators} from "../../validators/form-validators";
import {CheckoutService} from "../../services/checkout.service";
import {Router} from "@angular/router";
import {Purchase} from "../../common/purchase";
import {Order} from "../../common/order";
import {OrderItem} from "../../common/order-item";
import {environment} from "../../../environments/environment";
import {PaymentInfo} from "../../common/payment-info";

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  checkoutFormGroup!: FormGroup;

  stripe = Stripe(environment.stripePublishableKey);
  cardElement: any;
  displayError: any = "";
  paymentInfo = new PaymentInfo();

  isDisabled: boolean = false;

  storage: Storage = sessionStorage;

  totalQuantity!: number;
  totalPrice!: number;

  countries: Country[] = [];
  shippingAddressStates: State[] = [];
  billingAddressStates: State[] = [];

  constructor(private cartService: CartService,
              private expirationDateService: ExpirationDateService,
              private addressService: AddressService,
              private checkoutService: CheckoutService,
              private router: Router,
              private formBuilder: FormBuilder) {
  }

  get firstName() {
    return this.checkoutFormGroup.get('customer.firstName');
  }

  get lastName() {
    return this.checkoutFormGroup.get('customer.lastName');
  }

  get email() {
    return this.checkoutFormGroup.get('customer.email');
  }

  get shippingAddressCountry() {
    return this.checkoutFormGroup.get('shippingAddress.country');
  }

  get shippingAddressState() {
    return this.checkoutFormGroup.get('shippingAddress.state');
  }

  get shippingAddressCity() {
    return this.checkoutFormGroup.get('shippingAddress.city');
  }

  get shippingAddressStreet() {
    return this.checkoutFormGroup.get('shippingAddress.street');
  }

  get shippingAddressZipCode() {
    return this.checkoutFormGroup.get('shippingAddress.zipCode');
  }

  get billingAddressCountry() {
    return this.checkoutFormGroup.get('billingAddress.country');
  }

  get billingAddressState() {
    return this.checkoutFormGroup.get('billingAddress.state');
  }

  get billingAddressCity() {
    return this.checkoutFormGroup.get('billingAddress.city');
  }

  get billingAddressStreet() {
    return this.checkoutFormGroup.get('billingAddress.street');
  }

  get billingAddressZipCode() {
    return this.checkoutFormGroup.get('billingAddress.zipCode');
  }


  ngOnInit(): void {
    this.buildForm();
    this.setupStripePaymentForm();
    this.addressService.getCountries().subscribe(data => this.countries = data);
    this.reviewTotals();
  }

  private buildForm() {
    const userEmail = sessionStorage.getItem('userEmail');
    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: new FormControl('', [Validators.required,
          Validators.minLength(2),
          FormValidators.notIncludeWhiteSpaces]),

        lastName: new FormControl('', [Validators.required,
          FormValidators.notIncludeWhiteSpaces,
          Validators.minLength(2)]),

        email: new FormControl(userEmail, [Validators.required, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')])
      }),
      shippingAddress: this.formBuilder.group({
        country: new FormControl('', Validators.required),
        state: new FormControl('', Validators.required),
        city: new FormControl('', [Validators.required,
          Validators.minLength(2),
          FormValidators.notOnlyWhiteSpaces]),

        street: new FormControl('', [Validators.required,
          Validators.minLength(2),
          FormValidators.notOnlyWhiteSpaces]),

        zipCode: new FormControl('', [Validators.required,
          Validators.minLength(2),
          FormValidators.notOnlyWhiteSpaces]),
      }),

      billingAddress: this.formBuilder.group({
        country: new FormControl('', Validators.required),
        state: new FormControl('', Validators.required),
        city: new FormControl('', [Validators.required,
          Validators.minLength(2),
          FormValidators.notOnlyWhiteSpaces]),

        street: new FormControl('', [Validators.required,
          Validators.minLength(2),
          FormValidators.notOnlyWhiteSpaces]),

        zipCode: new FormControl('', [Validators.required,
          Validators.minLength(2),
          FormValidators.notOnlyWhiteSpaces]),
      }),

      creditCard: this.formBuilder.group({

      })
    });
  }

  private setupStripePaymentForm() {
    let elements = this.stripe.elements();
    this.cardElement = elements.create('card', {hidePostalCode: true});
    this.cardElement.mount('#card-element');

    this.cardElement.on('change', (event) => {
      this.displayError = document.getElementById('card-errors');
      if (event.complete) {
        this.displayError.textContent = ""
      } else if (event.error) {
        this.displayError.textContent = event.error.message;
      }
    })

  }

  getStates(formGroupName: string) {

    const formGroup = this.checkoutFormGroup.get(formGroupName);
    const countryCode = formGroup?.value.country.code;

    this.addressService.getStatesByCountryCode(countryCode).subscribe(data => {
      if (formGroupName == 'shippingAddress') {
        this.shippingAddressStates = data;
      } else {
        this.billingAddressStates = data;
      }
      formGroup?.get(formGroupName)?.setValue(data[0]);
    })

  }

  onSubmit() {

    if (this.checkoutFormGroup.invalid) {
      this.checkoutFormGroup.markAllAsTouched();
      return;
    }

    const purchase = new Purchase();

    let order = new Order();
    order.totalPrice = this.totalPrice;
    order.totalQuantity = this.totalQuantity;
    purchase.order = order;

    this.setDataFromCheckout(purchase);
    this.copyOrderItemsFromCartItemsToPurchase(purchase);

    this.paymentInfo.amount = Math.round(this.totalPrice * 100); // dollars ==> cents
    this.paymentInfo.currency = "USD";
    this.paymentInfo.receiptEmail = purchase.customer.email;
    if (this.displayError.textContent === '' && this.checkoutFormGroup.valid) {
      this.isDisabled = true;
      this.checkoutService.createPaymentIntent(this.paymentInfo).subscribe(
        paymentInfoResponse => {
          this.stripe.confirmCardPayment(paymentInfoResponse.client_secret,
            {
              payment_method: {
                card: this.cardElement,
                billing_details: {
                  email: purchase.customer.email,
                  name: `${purchase.customer.firstName} ${purchase.customer.lastName}`,
                  address: {
                    line1: purchase.billingAddress.street,
                    country: this.billingAddressCountry.value.code,
                    state: purchase.billingAddress.state,
                    city: purchase.billingAddress.city,
                    postal_code: purchase.billingAddress.zipCode,
                  }
                }
              }
            }, {handleActions: false})
            .then(function (result) {
              const error = result.error;
              if (error) {
                this.isDisabled = false;
                alert(`Something went wrong: ${error.message}`)
              } else {
                this.checkoutService.addOrder(purchase).subscribe({
                  next: response => {
                    alert(`Your order has been successfully received.\n Tracking number ==> ${response.orderTrackingNumber}`);
                    this.isDisabled = false;
                    this.resetCart();
                  },
                  error: err => {
                    alert(`There was an error: ${err.message}`);
                    this.isDisabled = false;
                  }
                })
              }
            }.bind(this))
        }
      )
    }
  }

  copyShippingAddressToBillingAddress(event: Event) {
    if ((event.target as HTMLInputElement).checked) {
      this.checkoutFormGroup.controls['billingAddress']
        .setValue(this.checkoutFormGroup.controls['shippingAddress'].value);

      this.billingAddressStates = this.shippingAddressStates;
    } else {
      this.checkoutFormGroup.controls['billingAddress'].reset();

      this.billingAddressStates = [];
    }
  }

  private setDataFromCheckout(purchase: Purchase) {
    purchase.shippingAddress = this.checkoutFormGroup.controls['shippingAddress'].value;
    const shippingState: State = JSON.parse(JSON.stringify(purchase.shippingAddress.state));
    const shippingCountry: Country = JSON.parse(JSON.stringify(purchase.shippingAddress.country));
    purchase.shippingAddress.state = shippingState.name;
    purchase.shippingAddress.country = shippingCountry.name;

    purchase.billingAddress = this.checkoutFormGroup.controls['billingAddress'].value;
    const billingState: State = JSON.parse(JSON.stringify(purchase.billingAddress.state));
    const billingCountry: Country = JSON.parse(JSON.stringify(purchase.billingAddress.country));
    purchase.billingAddress.state = billingState.name;
    purchase.billingAddress.country = billingCountry.name;

    purchase.customer = this.checkoutFormGroup.controls['customer'].value;
  }

  private copyOrderItemsFromCartItemsToPurchase(purchase: Purchase) {
    const cartItems = this.cartService.cartItems;
    purchase.orderItems = cartItems.map<OrderItem>(cartItem => new OrderItem(cartItem));
  }

  private resetCart() {
    this.cartService.cartItems = [];
    this.cartService.totalQuantity.next(0);
    this.cartService.totalPrice.next(0);
    this.cartService.persistCartItems();

    this.router.navigateByUrl("/products");
  }

  private reviewTotals() {
    this.cartService.totalPrice.subscribe(data => this.totalPrice = data);
    this.cartService.totalQuantity.subscribe(data => this.totalQuantity = data);
  }
}
