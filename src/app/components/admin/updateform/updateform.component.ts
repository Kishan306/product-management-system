import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Product } from '../../../models/product';
import { ProductService } from '../../../services/product.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzFormModule, NzFormControlComponent, NzFormLabelComponent, NzFormItemComponent } from 'ng-zorro-antd/form';
import { NzRateModule } from 'ng-zorro-antd/rate';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-updateform',
  standalone: true,
  imports: [NzFormLabelComponent, NzFormItemComponent, NzFormControlComponent, NzFormModule, NzRateModule, CommonModule,  FormsModule, ReactiveFormsModule],
  templateUrl: './updateform.component.html',
  styleUrl: './updateform.component.css',
  providers: [
    FormBuilder, 
    Validators, 
    ProductService, 
    NzMessageService,
    NzMenuModule,
    NzFormModule, 
    NzFormControlComponent, 
    NzFormLabelComponent, 
    NzFormItemComponent,
    NzCheckboxModule,
    NzButtonModule
  ]
})
export class UpdateformComponent {

  productId!: string;
  product!: Product;
  editForm!: FormGroup;

  constructor(
    private productService: ProductService,
    private fb: FormBuilder,
    private message: NzMessageService,
    private route: ActivatedRoute,
    private router: Router
  ){}

  ngOnInit():void{
    this.route.paramMap.subscribe((params: any)=>{
      this.productId = params.get('id')!;
      this.loadProduct();
    });

    this.editForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(34)]],
      totalstock: ['',Validators.required],
      description: ['', [Validators.required, Validators.minLength(20), Validators.maxLength(96)]],
      price: ['', Validators.required],
      discount: ['', Validators.required],
      rating: ['', [Validators.required, Validators.pattern("^[0-5]$")]]
    })
  }

  loadProduct(): void {
    this.productService.getProductById(this.productId)
      .subscribe((product: Product | undefined) => {
        if (product) {
          this.product = product;
          this.editForm.patchValue({
            name: product.name,
            totalstock: product.totalstock,
            description: product.description,
            price: product.price,
            discount: product.discount, 
            rating: product.rating          
          });
        } else {
          console.error('Product not found');
        }
      });
  }

  submitForm(){
    const updatedProduct: Product = { ...this.product, ...this.editForm.value};
    this.productService.updateProduct(this.productId, updatedProduct)
      .then(()=>{
        this.message.create('success', 'Product updated successfully')
        this.router.navigate(['/adminproductslist'])
      })
      .catch(error =>{
        this.message.create('danger', 'Something went wrong!')
        console.error(error)
      })
  }

}
