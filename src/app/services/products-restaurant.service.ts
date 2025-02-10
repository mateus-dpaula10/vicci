import { inject, Injectable } from '@angular/core';
import { addDoc, collection, collectionData, deleteDoc, doc, Firestore, updateDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductsRestaurantService {
  private firestore: Firestore = inject(Firestore)
  productsRestaurant = collection(this.firestore, 'productsRestaurant')

  get products() {
    return collectionData(this.productsRestaurant, { idField: 'id' }) as Observable<any[]>
  }

  create(payload: any) {
    return addDoc(this.productsRestaurant, payload)
  }

  update(id: any, payload: any) {
    const productRestaurantRef = doc(this.productsRestaurant, id)
    return updateDoc(productRestaurantRef, payload)
  }
  
  delete(id: any) {
    const productRestaurantRef = doc(this.productsRestaurant, id)
    return deleteDoc(productRestaurantRef)
  }
}
