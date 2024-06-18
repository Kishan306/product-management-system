import { Component } from '@angular/core';
import { CartService } from '../../../services/cart.service';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent {
  constructor(private cartService: CartService, private router: Router, private message: NzMessageService){}

  clearCart(){
      this.cartService.clearCart();
      this.message.success("Order Placed!!")
      this.router.navigate(['products'])
  }

}
