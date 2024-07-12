import { FormGroup, AbstractControl, ValidationErrors } from "@angular/forms";

export const fileExtensionValidator = (allowedExtensions: string[]) => {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }

    const fileInput = control.value as File;
    const fileExtension = fileInput.name.split('.').pop()?.toLowerCase() || '';

    if (!allowedExtensions.includes(fileExtension)) {
      return { invalidExtension: true };
    }

    return null;
  };
};
