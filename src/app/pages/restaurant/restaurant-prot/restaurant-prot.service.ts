import { Injectable, inject } from '@angular/core';
import { Firestore, collection, collectionData, addDoc, doc, updateDoc, deleteDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RestaurantProtService {

  private firestore: Firestore = inject(Firestore);
  protCollection = collection(this.firestore, 'prot');

  get prot() {
    return collectionData(this.protCollection, { idField: 'id' }) as Observable<any[]>;
  }

  create(payload: any) {
    return addDoc(this.protCollection, payload)
  }

  update(id: any, payload: any) {
    const protRef = doc(this.protCollection, id);
    return updateDoc(protRef, payload);
  }

  delete(id: any) {
    const protRef = doc(this.protCollection, id);
    return deleteDoc(protRef);

  }
}