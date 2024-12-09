import { Injectable, inject } from '@angular/core';
import { Firestore, collection, collectionData, addDoc, doc, updateDoc, deleteDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RestaurantOmeletService {
  private firestore: Firestore = inject(Firestore);
  omeletCollection = collection(this.firestore, 'omelet');

  get omelet() {
    return collectionData(this.omeletCollection, { idField: 'id' }) as Observable<any[]>;
  }

  create(payload: any) {
    return addDoc(this.omeletCollection, payload)
  }

  update(id: any, payload: any) {
    const omeletRef = doc(this.omeletCollection, id);
    return updateDoc(omeletRef, payload);
  }

  delete(id: any) {
    const omeletRef = doc(this.omeletCollection, id);
    return deleteDoc(omeletRef);

  }
}