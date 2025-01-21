import { Injectable, inject } from '@angular/core';
import { Firestore, collection, collectionData, addDoc, doc, updateDoc, deleteDoc, query, where } from '@angular/fire/firestore';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HiredService {

  private firestore: Firestore = inject(Firestore);
  teacherHiredCollection = collection(this.firestore, 'teachersHired');
  usersAll = collection(this.firestore, 'users')

  get teachersHired() {
    return collectionData(this.teacherHiredCollection, { idField: 'id' }) as Observable<any[]>;
  }

  create(payload: any) {
    return addDoc(this.teacherHiredCollection, payload);
  }

  update(id: any, payload: any) {
    const teacherHiredRef = doc(this.teacherHiredCollection, id);
    return updateDoc(teacherHiredRef, payload);
  }

  delete(id: any) {
    const teacherHiredRef = doc(this.teacherHiredCollection, id)
    return deleteDoc(teacherHiredRef);
  }

  getFieldNames(fieldName: string): Observable<string[]> {
    const queryRef = query(this.usersAll, 
      where(fieldName, '!=', null),
      where('role', '==', 'Instrutor'),
    );
    return collectionData(queryRef, { idField: 'id' }).pipe(
      map(teachers => teachers.map(teacher => teacher[fieldName]))
    );
  }

}