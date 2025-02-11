import { inject, Injectable } from '@angular/core';
import { addDoc, collection, collectionData, deleteDoc, doc, Firestore, updateDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductsRestaurantReserveService {
  private firestore: Firestore = inject(Firestore)
  productsRestaurantReserve = collection(this.firestore, 'productsRestaurantReserve')

  get productsReserve() {
    return collectionData(this.productsRestaurantReserve, { idField: 'id'}) as Observable<any[]>
  }

  create(payload: any) {
    return addDoc(this.productsRestaurantReserve, payload)
  }

  update(id: any, payload: any) {
    const productRestaurantReserveRef = doc(this.productsRestaurantReserve, id)
    return updateDoc(productRestaurantReserveRef, payload)
  }

  delete(id: any) {
    const productRestaurantReserveRef = doc(this.productsRestaurantReserve, id)
    return deleteDoc(productRestaurantReserveRef)
  }
}
