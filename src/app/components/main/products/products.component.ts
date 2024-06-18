import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzRateModule } from 'ng-zorro-antd/rate';
import { Product } from '../../../models/product';
import { ProductService } from '../../../services/product.service';
import { NzInputModule } from 'ng-zorro-antd/input';
import { FormsModule } from '@angular/forms';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { AuthService } from '../../../services/auth.service';
import { WishlistService } from '../../../services/wishlist.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { CartService } from '../../../services/cart.service';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [NzCardModule, NzRateModule, CommonModule, NzInputModule, FormsModule, NzIconModule, NzButtonModule, NzToolTipModule, NzPaginationModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css',
  providers: [NzMessageService]
})
export class ProductsComponent implements OnInit{

  constructor(
    private product: ProductService,
    private wishlistService: WishlistService,
    private message: NzMessageService,
    private cartService: CartService
  ){}

  allProducts: Product[]= [];
  filteredProducts: Product[] = [];
  searchQuery: string = '';

  //for pagination:
  currentPage = 1;
  pageSize = 8;
  pagedProducts: Product[] = [];

  userEmail: string | null = '';

  ngOnInit(): void {
    this.getAllProducts();
  }

  getAllProducts(){
    this.product.getAllProducts().subscribe({
      next: res=>{
        this.allProducts = res.map((e: any)=>{
          const data = e.payload.doc.data();
          data.id = e.payload.doc.id;
          return data;
        })
        this.filteredProducts = [...this.allProducts]
        this.updatePagedProducts();
      },
      error: (err)=>{
        alert("Couldn't fetch products");
      }
    })
  }

  actualPrice(price: number, discount: number  ): number{
    return price - ((price * discount)/100);
  }

  onSearch(): void {
    if(this.searchQuery != ''){
      this.filteredProducts = this.allProducts.filter(product =>
        product.name.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    } else {
      this.updatePagedProducts();
    }
  }

  //pagination:
  onPageChange(page: number){
    this.currentPage = page;
    this.updatePagedProducts();
  }

  updatePagedProducts(): void{
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.filteredProducts = this.allProducts.slice(startIndex, endIndex);
  }
  //pagination over

  handleSearch(term: string) {
    this.searchQuery = term;
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

  //add to wishlist:
  addToWishlist(productId: string){
    const userId = localStorage.getItem('userid');

    if(userId){
      this.wishlistService.addToWishlist(userId, productId).then(()=>{
        this.message.success('Item added to wishlist');
      }).catch(error =>{
        if(error === 'Item already exists in the wishlist'){
          this.message.warning('Item already exists in the wishlist');
        } else {
          this.message.error("Error adding item to the wishlist")
        }
      })
    } else {
      this.message.error("User not logged in")
    }
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

}
