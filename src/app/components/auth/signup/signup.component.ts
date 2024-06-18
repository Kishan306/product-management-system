import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule, FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { User } from '../../../models/user.model';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, NzCheckboxModule, FormsModule, NzInputModule, NzButtonModule,  ReactiveFormsModule, RouterLink],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
  providers: [ Validators]
})
export class SignupComponent implements OnInit{

  validateForm: FormGroup;

  constructor( private authservice : AuthService, private fb: FormBuilder, private message: NzMessageService ){
    this.validateForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+[\]{};':"\\|,.<>/?]).{6,14}$/)]],
      isSuperAdmin: [false],
    })
  }

  ngOnInit(): void { }

  signup(){
    const user: User = this.validateForm.value;
    
    if(this.validateForm.valid){
      this.authservice.signup(user)
    } else {
      this.message.warning("Enter valid data")
    }
  }

}
