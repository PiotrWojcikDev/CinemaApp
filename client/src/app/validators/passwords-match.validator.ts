import { FormGroup, ValidationErrors } from "@angular/forms";

export const passwordsMatchValidator = (formGroup: FormGroup): ValidationErrors | null => {
    const passwordControl = formGroup.get('password');
    const confirmPasswordControl = formGroup.get('confirmPassword');

    if (!passwordControl || !confirmPasswordControl) {
        return null;
    }

    const password = passwordControl.value;
    const confirmPassword = confirmPasswordControl.value;

    if (password !== confirmPassword) {
        confirmPasswordControl.setErrors({ passwordsNotMatch: true });
        return { passwordsNotMatch: true };
    } 
    return null;
};
