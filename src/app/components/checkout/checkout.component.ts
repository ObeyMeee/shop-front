import {Component, OnInit} from '@angular/core';
import {CartService} from "../../services/cart.service";
import {FormBuilder, FormGroup} from "@angular/forms";
import {ExpirationDateService} from "../../services/expiration-date.service";
import {Country} from "../../common/country";
import {State} from "../../common/state";
import {AddressService} from "../../services/address.service";

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  checkoutFormGroup!: FormGroup;

  totalQuantity!: number;
  totalPrice!: number;

  expirationMonths!: number[];
  expirationYears!: number[];

  countries: Country[] = [];
  shippingAddressStates: State[] = [];
  billingAddressStates: State[] = [];

  constructor(private cartService: CartService,
              private expirationDateService: ExpirationDateService,
              private addressService: AddressService,
              private formBuilder: FormBuilder) {
  }

  ngOnInit(): void {
    this.buildForm();
    this.cartService.totalQuantity.subscribe(data => this.totalQuantity = data);
    this.cartService.totalPrice.subscribe(data => this.totalPrice = data);

    const currentMonth = new Date().getMonth() + 1;

    this.expirationDateService.getCreditCardExpirationMonth(currentMonth).subscribe(data => {
      this.expirationMonths = data;
    })
    this.expirationDateService.getCreditCardExpirationYear().subscribe(data => {
      this.expirationYears = data
    })

    this.addressService.getCountries().subscribe(data => this.countries = data);
  }

  getStates(formGroupName: string) {

    const formGroup = this.checkoutFormGroup.get(formGroupName);
    const countryCode = formGroup?.value.country.code;
    const countryName = formGroup?.value.country.name;

    console.log(`name ==> ${countryName}`);
    console.log(`code ==> ${countryCode}`);
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
    console.log(`Customer data ==> ${this.checkoutFormGroup.get("customer")?.value.firstName}`);
    console.log(`Customer data ==> ${this.checkoutFormGroup.get("customer")?.value.lastName}`);
    console.log(`Customer data ==> ${this.checkoutFormGroup.get("customer")?.value.email}`);
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

  handleMonthsAndYears() {
    const currentYear = new Date().getFullYear();
    const creditCard = this.checkoutFormGroup.get('creditCard');
    const selectedYear = creditCard?.value.expirationYear;
    let startedMonth: number;

    if (currentYear == selectedYear) {
      startedMonth = new Date().getMonth() + 1;
    } else {
      startedMonth = 1;
    }

    this.expirationDateService.getCreditCardExpirationMonth(startedMonth).subscribe(data => {
      this.expirationMonths = data;
    })

  }

  private buildForm() {
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
    });
  }
}
