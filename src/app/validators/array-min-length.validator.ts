import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function arrayMinLength(minLength: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (control.value && control.value.length < minLength) {
      return { minLength: { requiredLength: minLength, actualLength: control.value.length } };
    }
    return null;
  };
}
