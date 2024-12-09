import { Injectable, inject } from '@angular/core';
import { Firestore, collection, collectionData, addDoc, doc, updateDoc, deleteDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RestaurantSauceService {

  private firestore: Firestore = inject(Firestore);
  sauceCollection = collection(this.firestore, 'sauce');

  get sauce() {
    return collectionData(this.sauceCollection, { idField: 'id' }) as Observable<any[]>;
  }

  create(payload: any) {
    return addDoc(this.sauceCollection, payload)
  }

  update(id: any, payload: any) {
    const saucedRef = doc(this.sauceCollection, id);
    return updateDoc(saucedRef, payload);
  }

  delete(id: any) {
    const saucedRef = doc(this.sauceCollection, id);
    return deleteDoc(saucedRef);

  }
}