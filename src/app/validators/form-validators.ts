import {FormControl, ValidationErrors} from "@angular/forms";

export class FormValidators {

  static notOnlyWhiteSpaces(control: FormControl): ValidationErrors {
    if (control.value != null && control.value.trim().length == 0) {
      return {'notOnlyWhiteSpaces': true};
    }
    return null;
  }

  static notIncludeWhiteSpaces(control: FormControl): ValidationErrors {
    if (control.value.includes(' ')) {
      return {'notIncludeWhiteSpaces': true}
    }
    return null;
  }
}
