import { Component } from '@angular/core';
import { CartService } from '../../../services/cart.service';
import { ProductService } from '../../../services/product.service';
import { Product } from '../../../models/product';
import { NzMessageService } from 'ng-zorro-antd/message';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent {

  constructor(
    private cartService: CartService,
    private productService: ProductService,
    private message: NzMessageService,
    private router: Router
  ){}

  cartItemIds: any[] = [];
  cartItems: Product[] = [];
  quantities: number[] = [];
  grandTotal = 0;
  saved = 0;

  ngOnInit(): void{
    const userId = localStorage.getItem('userid');
    if(userId){
      this.cartService.getProductIdByUserId(userId).subscribe( (items: any) =>{
        this.cartItemIds = items;
        this.cartItems = [];
        this.fetchCartById();
      })
    } else {
      this.message.error("User not logged in")
    }
  }

  fetchCartById(){
    this.quantities = new Array(this.cartItemIds.length).fill(1);
    this.cartItemIds.forEach(productId =>{
      this.productService.getProductById(productId).subscribe((product: any)=>{
        this.cartItems.push(product)
        this.calculateTotal();
      }, (error: any)=>{
        console.error("error fetching products", error)
      })
    })
  }

  calculateTotal(){
    this.grandTotal = 0;
    this.saved = 0;
    this.cartItems.forEach((product, index)=>{
      const quantity = this.quantities[index];
      this.grandTotal += this.actualPrice(product.price, product.discount || 0) * quantity;
      this.saved += (product.price  - this.actualPrice(product.price, product.discount || 0) )* quantity;
    })
  }

  removeItemFromCart(productId: string): void{
    this.cartService.removeFromCart(productId)
      .then(()=>{
        this.message.success("Item Removed from Cart");
      })
      .catch(error => {
        console.error("Error while removing item");
      })
  }

  actualPrice(price: number, discount: number  ): number{
    return price - ((price * discount)/100);
  }

  incrementQuantity(index: number){
    this.quantities[index]++;

      this.calculateTotal();

  }

  decrementQuantity(index: number){
    this.quantities[index]--;
    this.calculateTotal();
  }

  goToCheckout(){
    this.router.navigate(['checkout'])
  }

}
