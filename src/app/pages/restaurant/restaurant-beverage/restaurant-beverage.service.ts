import { Injectable, inject } from '@angular/core';
import { Firestore, collection, collectionData, addDoc, doc, updateDoc, deleteDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RestaurantBeverageService {
  private firestore: Firestore = inject(Firestore);
  beverageCollection = collection(this.firestore, 'beverage');

  get beverage() {
    return collectionData(this.beverageCollection, { idField: 'id' }) as Observable<any[]>;
  }

  create(payload: any) {
    return addDoc(this.beverageCollection, payload)
  }

  update(id: any, payload: any) {
    const beverageRef = doc(this.beverageCollection, id);
    return updateDoc(beverageRef, payload);
  }

  delete(id: any) {
    const beverageRef = doc(this.beverageCollection, id);
    return deleteDoc(beverageRef);

  }
}