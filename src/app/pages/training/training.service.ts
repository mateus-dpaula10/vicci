import { Injectable, inject } from '@angular/core';
import { Firestore, collection, collectionData, addDoc, doc, updateDoc, deleteDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TrainingService {

  private firestore: Firestore = inject(Firestore);
  trainingCollection = collection(this.firestore, 'trainings');

  get trainings() {
    return collectionData(this.trainingCollection, {idField: 'id'}) as Observable<any[]>;
  }

  create(payload: any){
    return addDoc(this.trainingCollection, payload)
  }

  update(id: any, payload: any){
    const trainingRef = doc(this.trainingCollection, id);
    return updateDoc(trainingRef, payload);
  }

  delete(id: any){
    const trainingRef = doc(this.trainingCollection, id);
    return deleteDoc(trainingRef);
  }
}
