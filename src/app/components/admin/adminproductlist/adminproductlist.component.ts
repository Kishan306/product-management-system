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
import { NzMessageService } from 'ng-zorro-antd/message';
import { Router } from '@angular/router';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';

@Component({
  selector: 'app-adminproductlist',
  standalone: true,
  imports: [NzCardModule, NzRateModule, CommonModule,NzPaginationModule,  NzInputModule, FormsModule, NzIconModule, NzButtonModule, NzToolTipModule],
  templateUrl: './adminproductlist.component.html',
  styleUrl: './adminproductlist.component.css',
  providers: [NzMessageService]
})
export class AdminproductlistComponent implements OnInit{

  constructor(private product: ProductService, private message: NzMessageService, private router: Router){}

  allProducts: Product[]= [];
  filteredProducts: Product[] = [];
  searchQuery: string = '';

    //for pagination:
    currentPage = 1;
    pageSize = 8;
    pagedProducts: Product[] = [];

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
        this.updatePagedProducts()
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

  handleSearch(term: string) {
    this.searchQuery = term;
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

  deleteProduct(productId: string): void{
    this.product.deleteProduct(productId).then(()=>{
      this.message.create('success', 'Product deleted successfully!!')
    }).catch((error)=>{
      this.message.create('danger', 'Something went wrong!!')
    })
  }

  confirmDelete(productId ?: string):void{
    if(confirm("Are you sure you want to delete this product?")){
      this.deleteProduct(productId!)
    }
  }

  editProduct(productId: string){
    this.router.navigate(['updateproduct', productId])
  }

}
