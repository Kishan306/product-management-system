import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NzInputModule } from 'ng-zorro-antd/input';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, NzInputModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent{

  email: string = '';
  password: string = '';

  constructor(private authservice: AuthService, private router: Router, private message: NzMessageService){}

  login(){
    if(this.email == '' || this.password == ''){
      alert("Please enter all values");
      return;
    }

    this.authservice.login(this.email, this.password);
    this.authservice.getUserByEmail(this.email);
    this.email='';
    this.password='';
  }

  signInWithGoogle(){
    this.authservice.googleSignIn();
  }
}
