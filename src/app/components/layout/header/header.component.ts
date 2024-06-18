import { Component, HostListener, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { AuthService } from '../../../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { AvatarModule } from 'primeng/avatar';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [ CommonModule, NzIconModule, NzDropDownModule, NzMenuModule, NzButtonModule, NzBadgeModule, RouterLink, NzToolTipModule, NzAvatarModule, AvatarModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
  providers: [Router]
})
export class HeaderComponent implements OnInit{
  
  menu: any;
  menuopen: boolean = false;
  currentUser = localStorage.getItem('token') //used in tooltip in html file
  role = localStorage.getItem('isAdmin') == "true" ? 'Admin' : 'Customer'

  constructor(private authservice: AuthService, private router: Router, private message: NzMessageService){}

  @Input() loginStatus: any;
  @Input() isAdmin: any;
  @Input() avatar!: string;
  @Input() userMail!: string;
  
  ngOnInit(): void {

  }

  onUserMenuClick(){
    this.menuopen = !this.menuopen;
    this.isCollapsed = false;
  }

  //to close user menu when clicked anywhere on the screen except the button itself
  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent) {
    // Check if the click event target is not the specific button
    const isButtonClick = (event.target as HTMLElement).closest('.exclude');
    if (!isButtonClick) {
      // Update the value of variableToChange if the click did not occur on the button
      this.menuopen = false;
      this.isCollapsed = false;
    }
  } 

  onLogOutClick(){
    if(window.confirm("Are you sure you want to log out?")){
      this.authservice.logout();
      this.menuopen = false;
      setTimeout(() => {
        window.location.reload()
      }, 500);
    } else {
      this.menuopen = false;
    }
  }

  onLoginClick(){
    this.router.navigate(['/login'])
  }
  
  onSignUpClick(){
    this.router.navigate(['/signup'])
  }

  isCollapsed = false;

  toggleCollapsed(): void {
    this.isCollapsed = !this.isCollapsed;
    this.menuopen = false;
  }
}
