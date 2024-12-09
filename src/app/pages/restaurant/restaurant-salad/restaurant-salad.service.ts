import { Injectable, inject } from '@angular/core';
import { Firestore, collection, collectionData, addDoc, doc, updateDoc, deleteDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RestaurantSaladService {

  private firestore: Firestore = inject(Firestore);
  saladCollection = collection(this.firestore, 'salad');

  get salad() {
    return collectionData(this.saladCollection, { idField: 'id' }) as Observable<any[]>;
  }

  create(payload: any) {
    return addDoc(this.saladCollection, payload)
  }

  update(id: any, payload: any) {
    const saladRef = doc(this.saladCollection, id);
    return updateDoc(saladRef, payload);
  }

  delete(id: any) {
    const saladRef = doc(this.saladCollection, id);
    return deleteDoc(saladRef);

  }
}