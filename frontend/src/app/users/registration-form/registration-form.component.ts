import { Component, OnInit } from '@angular/core';
import { faAsterisk, faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from "../../user.service";

@Component({
  selector: 'app-registration-form',
  templateUrl: './registration-form.component.html',
  styleUrls: ['./registration-form.component.css']
})
export class RegistrationFormComponent implements OnInit {
  registrationReactiveForm: FormGroup;

  faAsterisk = faAsterisk;
  faUserCircle = faUserCircle;

  errorMessage;

  constructor(private fb: FormBuilder, private userService: UserService) {
  }

  onSubmit() {
    const controls = this.registrationReactiveForm.controls;

    if (this.registrationReactiveForm.invalid) {
      Object.keys(controls)
        .forEach(controlName => controls[controlName].markAsTouched());

      return;
    }

    this.userService.register(this.registrationReactiveForm.value).subscribe(
      (res: any) => {
        console.log(res)
      },
      (error) => {
        this.errorMessage = error.error.message;
      })
  }

  ngOnInit(): void {
    this.registrationReactiveForm = this.fb.group({
      email: ['', [
        Validators.required,
        Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")
      ]
      ],
      login: ['', [
        Validators.required,
        Validators.pattern(/^[a-zA-Z0-9_]+$/)
      ]
      ],
      password: ['', [
        Validators.required,
        Validators.pattern(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{5,32}/)
      ]
      ]
    })
  }

  isLoginValid(login: string): boolean {
    const loginControl = this.registrationReactiveForm.controls[login]

    return loginControl.invalid && loginControl.touched
  }

  isPasswordValid(password: string): boolean {
    const passwordControl = this.registrationReactiveForm.controls[password]

    return passwordControl.invalid && passwordControl.touched
  }

  isEmailValid(email: string): boolean {
    const emailControl = this.registrationReactiveForm.controls[email]

    return emailControl.invalid && emailControl.touched;
  }

}
