import { Injectable, inject } from '@angular/core';
import { Firestore, addDoc, collection, collectionData, deleteDoc, doc, updateDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PlansService {

  private firestore: Firestore = inject(Firestore);
  plansCollection = collection(this.firestore, 'plans');

  get plans() {
    return collectionData(this.plansCollection, { idField: 'id' }) as Observable<any[]>;
  }

  create (payload: any){
    return addDoc(this.plansCollection, payload)
  }

  update(id: any, payload: any){
    const planRef = doc(this.plansCollection, id);
    return updateDoc(planRef, payload);
  }

  delete(id:any){
    const planRef = doc(this.plansCollection, id);
    return deleteDoc(planRef);
    
  }
}