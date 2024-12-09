import { Injectable, inject } from '@angular/core';
import { Firestore, collection, collectionData, addDoc, doc, updateDoc, deleteDoc, query, where } from '@angular/fire/firestore';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AssociateService {

  private firestore: Firestore = inject(Firestore);
  teacherAssociateCollection = collection(this.firestore, 'teachersAssociate');

  get teachersAssociate() {
    return collectionData(this.teacherAssociateCollection, { idField: 'id' }) as Observable<any[]>;
  }

  create(payload: any) {
    return addDoc(this.teacherAssociateCollection, payload);
  }

  update(id: any, payload: any) {
    const teacherAssociateRef = doc(this.teacherAssociateCollection, id);
    return updateDoc(teacherAssociateRef, payload);
  }

  delete(id: any) {
    const teacherAssociateRef = doc(this.teacherAssociateCollection, id)
    return deleteDoc(teacherAssociateRef);
  }

  getFieldNames(fieldName: string): Observable<string[]> {
    const queryRef = query(this.teacherAssociateCollection, where(fieldName, '!=', null));
    return collectionData(queryRef, { idField: 'id' }).pipe(
      map(teachers => teachers.map(teacher => teacher[fieldName]))
    );
  }

}