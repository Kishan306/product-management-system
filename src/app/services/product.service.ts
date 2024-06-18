import { Injectable } from '@angular/core';
import { Product } from '../models/product';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage} from '@angular/fire/compat/storage';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs';
import { CartService } from './cart.service';
import { WishlistService } from './wishlist.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  
  constructor(private firestore: AngularFirestore, private storage: AngularFireStorage, private cartService: CartService, private wishlistService: WishlistService){}

  //create product function:
  createProduct(product: Product, imageFile: File): Promise<any>{
    const filePath = `product-images/${imageFile.name}`;
    const storageRef = this.storage.ref(filePath);
    const uploadTask = this.storage.upload(filePath, imageFile);

    return uploadTask.snapshotChanges().pipe(
      finalize(()=>storageRef.getDownloadURL().subscribe((downloadUrl: string)=>{
        product.imageUrl = downloadUrl;
        this.saveProductData(product);
      }))
    ).toPromise();
  }

  //save data in firebase collection:
  saveProductData(product: Product): void{
    this.firestore.collection('products').add(product);
  }

  getAllProducts(){
    return this.firestore.collection('products').snapshotChanges();
  }

  getProductById(productId: string): Observable<Product | undefined>{
    return this.firestore.collection('products').doc<Product>(productId).valueChanges({idField:"id"});
  }

  updateProduct(productId: string, data: any): Promise<void>{
    return this.firestore.collection('products').doc(productId).update(data);
  }

  deleteProduct(productId: string): Promise<void>{
    return this.firestore.collection('products').doc(productId).ref.get().then((doc)=>{
      if(doc.exists){
        const productData = doc.data() as Product;
        this.firestore.collection('products').doc(productId).delete();
        this.cartService.clearItemFromEveryCart(productId);
        this.wishlistService.clearItemFromEveryWishlist(productId);
      } else {
        console.error("product not found")
      }
    }).catch((error)=>{
      console.error("error in fetching product: ", error)
    })
  }
}
