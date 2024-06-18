import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Wishlist } from '../models/wishlist.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {

  constructor(private firestore: AngularFirestore ) { }

  addToWishlist(userId: string, productId: string): Promise<any>{
    const wishlistItem = { userId, productId};
    return this.isProductInWishlist(userId, productId).then(exists => {
      if(!exists){
        return this.firestore.collection('wishlists').add(wishlistItem);
      } else {
        console.log("Item already exists in the wishlist");
        return Promise.reject("Item already exists in the wishlist")
      }
    })
  }

  getProductByUserId(userId: string): Observable<string[]>{
    return this.firestore.collection('wishlists', ref => ref.where('userId', '==', userId))
      .snapshotChanges().pipe(
        map((actions: any) => (actions.map((a: any) => {
          const data = a.payload.doc.data() as any;
          return data.productId;
        })))
      )
  }

  //check if product is in wishlist
  isProductInWishlist(userId: string, productId: string): Promise<boolean>{
    return this.firestore.collection('wishlists', ref => 
      ref.where('userId', '==', userId).where('productId', '==', productId))
      .get().toPromise().then(snapshot =>{
        return !snapshot?.empty;
      })
  }

  //delete item from wishlist
  deleteWishlistItem(productId: string): Promise<void>{
    const userId = localStorage.getItem('userid');

    return this.firestore.collection<Wishlist>('wishlists', ref => ref.where('userId', '==', userId).where('productId', '==', productId))
      .get()
      .toPromise()
      .then((querySnapshot : any) => {
        querySnapshot.forEach((doc: any)=>{
          doc.ref.delete();
        })
      })
      .catch((error: any)=>{
        console.error('Error deleting wishlist item: ', error)
      })
  }

  clearItemFromEveryWishlist(productId: string): Promise<void>{
    return this.firestore.collection<Wishlist>('wishlists', ref => ref.where('productId', '==', productId))
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
