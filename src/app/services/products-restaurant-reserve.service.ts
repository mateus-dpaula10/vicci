import { inject, Injectable } from '@angular/core';
import { addDoc, collection, collectionData, Firestore } from '@angular/fire/firestore';
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
}
