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

@Component({
  selector: 'app-productform',
  standalone: true,
  imports: [NzFormLabelComponent, NzFormItemComponent, NzFormControlComponent, NzFormModule, NzRateModule, CommonModule,  FormsModule, ReactiveFormsModule],
  templateUrl: './productform.component.html',
  styleUrl: './productform.component.css',
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
export class ProductformComponent {

  validateForm: FormGroup;

  constructor(
    private productService: ProductService,
    private fb: FormBuilder,
    private message: NzMessageService,
  ){
    this.validateForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(34)]],
      imageUrl: ['', Validators.required],
      price: ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
      discount: ['', [Validators.required]],
      totalstock: ['', [Validators.required]],
      description: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(96)]],
      rating: ['', [Validators.required, Validators.pattern("^[0-5]$")]]
    })
  }

  submitForm(){
    const product: Product = this.validateForm.value;
    const imageFile = this.validateForm.get('imageUrl')!.value;
    
    if(this.validateForm.valid){
      if(imageFile){
        this.productService.createProduct(product, imageFile).then(()=>{
          this.message.create('success', 'Product Created');
          this.validateForm.reset();
        }).catch(error => {
          this.message.error("Error while creating product");
        });
      } else {
        this.message.warning("No image selected");
      }
    } else {
      Object.values(this.validateForm.controls).forEach(control =>{
        if(control.invalid){
          control.markAsDirty();
          control.updateValueAndValidity({onlySelf: true});
        }
      })
    }
  }

  onResetForm(){
    this.validateForm.reset();
  }

  onFileChange(event: any){
    const file = event.target.files[0];

    if(file){
      this.validateForm.get('imageUrl')!.setValue(file);
    }
  }

}
