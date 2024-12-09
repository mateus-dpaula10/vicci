import { Injectable, inject } from '@angular/core';
import { Firestore, collection, collectionData, addDoc, doc, updateDoc, deleteDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RestaurantCarboService {
  private firestore: Firestore = inject(Firestore);
  carboCollection = collection(this.firestore, 'carbo');

  get carbo() {
    return collectionData(this.carboCollection, { idField: 'id' }) as Observable<any[]>;
  }

  create(payload: any) {
    return addDoc(this.carboCollection, payload)
  }

  update(id: any, payload: any) {
    const carboRef = doc(this.carboCollection, id);
    return updateDoc(carboRef, payload);
  }

  delete(id: any) {
    const carboRef = doc(this.carboCollection, id);
    return deleteDoc(carboRef);

  }
}