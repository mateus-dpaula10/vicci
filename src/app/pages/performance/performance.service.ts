import { Injectable, inject } from '@angular/core';
import { Firestore, addDoc, collection, collectionData, deleteDoc, doc, updateDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PerformanceService {

  private firestore: Firestore = inject(Firestore);
  performanceCollection = collection(this.firestore, 'performances');

  get performances() {
    return collectionData(this.performanceCollection, {idField: 'id'}) as Observable<any[]>;
  }

  create(payload: any){
    return addDoc(this.performanceCollection, payload)
  }

  update(id: any, payload: any){
    const performanceRef = doc(this.performanceCollection, id);
    return updateDoc(performanceRef, payload);
  }

  delete(id: any){
    const performanceRef = doc(this.performanceCollection, id);
    return deleteDoc(performanceRef);
  }
}
