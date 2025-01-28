import { Injectable, inject } from '@angular/core';
import { Firestore, collection, collectionData, addDoc, doc, updateDoc, deleteDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmployeesService {

  private firestore: Firestore = inject(Firestore);
  employeeCollection = collection(this.firestore, 'employees');
  usersAll = collection(this.firestore, 'users');

  get employees() {
    return collectionData(this.employeeCollection, { idField: 'id' }) as Observable<any[]>;
  }

  create(payload: any) {
    return addDoc(this.employeeCollection, payload);
  }

  update(id: any, payload: any) {
    const employeeRef = doc(this.usersAll, id);
    return updateDoc(employeeRef, payload);
  }

  delete(id: any) {
    const employeeRef = doc(this.usersAll, id)
    return deleteDoc(employeeRef);
  }

}