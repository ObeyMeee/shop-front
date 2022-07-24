import {Component, OnInit} from '@angular/core';
import {CartService} from "../../services/cart.service";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {ExpirationDateService} from "../../services/expiration-date.service";
import {Country} from "../../common/country";
import {State} from "../../common/state";
import {AddressService} from "../../services/address.service";
import {FormValidators} from "../../validators/form-validators";

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

    if (this.checkoutFormGroup.invalid){
      this.checkoutFormGroup.markAllAsTouched();
    }

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
        firstName: new FormControl('', [Validators.required,
                                                          Validators.minLength(2),
                                                          FormValidators.notIncludeWhiteSpaces]),

        lastName: new FormControl('', [Validators.required,
                                                        FormValidators.notIncludeWhiteSpaces,
                                                        Validators.minLength(2)]),

        email: new FormControl('', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')])
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
        cardType: new FormControl('', Validators.required),
        nameOnCard: new FormControl('', [Validators.required,
                                                           Validators.minLength(2),
                                                           FormValidators.notOnlyWhiteSpaces]) ,
        cardNumber: new FormControl('', [Validators.required,
                                                           Validators.pattern('[0-9]{16}')]),
        securityCode: new FormControl('', [Validators.required,
                                                             Validators.pattern('[0-9]{3}')]),
        expirationMonth: [''],
        expirationYear: [''],
      })
    });
  }

  get firstName() { return this.checkoutFormGroup.get('customer.firstName'); }
  get lastName(){ return this.checkoutFormGroup.get('customer.lastName'); }
  get email(){ return this.checkoutFormGroup.get('customer.email'); }

  get shippingAddressCountry(){return this.checkoutFormGroup.get('shippingAddress.country');}
  get shippingAddressState(){ return this.checkoutFormGroup.get('shippingAddress.state'); }
  get shippingAddressCity(){ return this.checkoutFormGroup.get('shippingAddress.city'); }
  get shippingAddressStreet(){ return this.checkoutFormGroup.get('shippingAddress.street'); }
  get shippingAddressZipCode(){ return this.checkoutFormGroup.get('shippingAddress.zipCode'); }

  get billingAddressCountry(){return this.checkoutFormGroup.get('billingAddress.country');}
  get billingAddressState(){ return this.checkoutFormGroup.get('billingAddress.state'); }
  get billingAddressCity(){ return this.checkoutFormGroup.get('billingAddress.city'); }
  get billingAddressStreet(){ return this.checkoutFormGroup.get('billingAddress.street'); }
  get billingAddressZipCode(){ return this.checkoutFormGroup.get('billingAddress.zipCode'); }

  get creditCardType(){ return this.checkoutFormGroup.get('creditCard.cardType'); }
  get nameOnCard(){ return this.checkoutFormGroup.get('creditCard.nameOnCard'); }
  get cardNumber(){ return this.checkoutFormGroup.get('creditCard.cardNumber'); }
  get securityCode(){ return this.checkoutFormGroup.get('creditCard.securityCode'); }
  get expirationMonth(){ return this.checkoutFormGroup.get('creditCard.expirationMonth'); }
  get expirationYear(){ return this.checkoutFormGroup.get('creditCard.expirationYear'); }
}
