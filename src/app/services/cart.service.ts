import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Cart } from '../models/cart.model';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  constructor( private firestore: AngularFirestore) { }

  addToCart(userId: string, productId: string): Promise<any>{
    const cartItem = {userId, productId, quantity: 1}
    return this.isProductInCart(userId, productId).then(exists => {
      if(!exists){
        return this.firestore.collection('carts').add(cartItem);
      } else {
        console.log("item already exists in cart");
        return Promise.reject("Already exists")
      }
    })
  }

  getProductIdByUserId(userId: string): Observable<string[]>{
    return this.firestore.collection('carts', ref => ref.where('userId', '==', userId))
      .snapshotChanges().pipe(
        map((actions: any) => actions.map((a: any) => {
          const data = a.payload.doc.data() as any;
          return data.productId;
        }))
      )
  }

  isProductInCart(userId: string, productId: string): Promise<boolean>{
    return this.firestore.collection('carts', ref => 
      ref.where('userId', '==', userId).where('productId', '==', productId))
      .get().toPromise().then(snapshot => {
        return !snapshot?.empty;
      })
  }

  removeFromCart(productId: string): Promise<void>{
    const userId = localStorage.getItem('userid');

    return this.firestore.collection<Cart>('carts', ref => ref.where('userId', '==', userId).where('productId', '==', productId))
      .get().toPromise()
      .then((querySnapshot: any)=>{
        querySnapshot.forEach((doc: any)=>{
          doc.ref.delete();
        })
      })
      .catch((error: any)=>{
        console.error('Error deleteing wishlist item:', error);
      })
  }

  clearCart(): Promise<void>{
    const userId = localStorage.getItem('userid');

    return this.firestore.collection<Cart>('carts', ref => ref.where('userId', '==', userId))
    .get().toPromise()
    .then((querySnapshot: any) => {
      querySnapshot.forEach((doc: any)=>{
        doc.ref.delete();
      })
    })
    .catch((error: any)=>{
      console.error("Error while clearing cart", error)
    })
  }

  clearItemFromEveryCart(productId: string): Promise<void>{
    return this.firestore.collection<Cart>('carts', ref => ref.where('productId', '==', productId))
    .get().toPromise()
    .then((querySnapshot: any)=>{
      querySnapshot.forEach((doc: any)=>{
        doc.ref.delete()
      })
    })
    .catch((error: any)=>{
      console.error("Error while Erasing item", error);
    })
  }
}
