import { Component, afterNextRender, afterRender, ChangeDetectorRef } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/layout/header/header.component';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'product-management-system';

  constructor(private authService: AuthService, private cdr: ChangeDetectorRef) {
    if (!localStorage.getItem('token')) {
      this.authService.logout(); // Redirect to login if no token on refresh
    }
    afterRender(()=>{
      this.authService.isLoggedIn();
      this.loginStatus = this.authService.isLoggedInVar;
      this.userMail = this.authService.userMail;
      this.authService.isAdmin();
      this.isAdmin = this.authService.isAdminVar;
      this.authService.fetchAvatar();
      this.avatar = this.authService.avatar;
      this.cdr.detectChanges()
    })
  }

  loginStatus!: boolean;
  isAdmin!: boolean;
  avatar!: string;
  userMail!: string;

  ngOnInit():void{

  }
}
