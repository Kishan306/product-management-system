import { Component, HostListener } from '@angular/core';
import { WishlistService } from '../../../services/wishlist.service';
import { ProductService } from '../../../services/product.service';
import { Product } from '../../../models/product';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzRateModule } from 'ng-zorro-antd/rate';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { CommonModule } from '@angular/common';
import { CartService } from '../../../services/cart.service';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [NzCardModule, NzRateModule, NzIconModule, NzButtonModule, NzToolTipModule, CommonModule],
  templateUrl: './wishlist.component.html',
  styleUrl: './wishlist.component.css',
  providers: [NzMessageService]
})
export class WishlistComponent {

  wishlistItemIds: any[]= [];
  wishlistItems: Product[] = [];


  constructor(
    private wishlistService: WishlistService, 
    private productService: ProductService,
    private message: NzMessageService,
    private cartService: CartService
  ){}

  ngOnInit(): void{
    const userId = localStorage.getItem('userid');
    if(userId){
      this.wishlistService.getProductByUserId(userId).subscribe(items =>{
        this.wishlistItemIds = items;
        this.wishlistItems = [];
        this.fetchProductsById()
      })
    } else {
      this.message.error("user not logged in")
    }
  }

  fetchProductsById(){
    this.wishlistItemIds.forEach(productId => {
      this.productService.getProductById(productId).subscribe((product: any)=>{
        this.wishlistItems.push(product)
      }, (error: any)=>{
        console.error("error fetching products", error)
      })
    })
  }

  removeItemFromWishlist(productId: string): void{
    this.wishlistService.deleteWishlistItem(productId)
      .then(()=>{ 
        this.message.success('Item removed from wishlist');
      })
      .catch(error =>{
        console.error('Error while removing item');
      })
  }

  actualPrice(price: number, discount: number  ): number{
    return price - ((price * discount)/100);
  }

    //add to cart: 
    addToCart(productId: string){
      const userId = localStorage.getItem('userid');
  
      if(userId){
        this.cartService.addToCart(userId, productId).then(()=>{
          this.message.success("Added to Cart");
        }).catch(error => {
          if(error === "Already exists"){
            this.message.warning("Item Already exists in cart")
          } else {
            this.message.error("Error adding item to the cart");
          }
        })
      } else {
        this.message.error("User ID not found!");
      }
    }

  showGoTopButton = false;

  @HostListener('window:scroll', [])
  onWindowScroll() {
    // Check the scroll position
    const scrollPosition = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    
    // Show/hide the "Go to Top" button based on the scroll position
    this.showGoTopButton = scrollPosition > 100; // Change 100 to any value you prefer
  }

  goToTop() {
    // Scroll to the top of the page
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
