import { Injectable, inject } from '@angular/core';
import { Firestore, collection, collectionData, addDoc, doc, updateDoc, deleteDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ExercisesService {

  private firestore: Firestore = inject(Firestore);
  exerciseCollection = collection(this.firestore, 'exercises');

  get exercises() {
    return collectionData(this.exerciseCollection, {idField: 'id'}) as Observable<any[]>;
  }

  create(payload: any){
    return addDoc(this.exerciseCollection, payload)
  }

  update(id: any, payload: any){
    const exerciseRef = doc(this.exerciseCollection, id);
    return updateDoc(exerciseRef, payload);
  }

  delete(id: any){
    const exerciseRef = doc(this.exerciseCollection, id);
    return deleteDoc(exerciseRef);
  }
}
