import { Injectable, inject } from '@angular/core';
import { Firestore, addDoc, collection, collectionData, deleteDoc, doc, query, where } from '@angular/fire/firestore';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SchedulesService {

  private firestore: Firestore = inject(Firestore)
  scheduleCollection = collection(this.firestore, 'schedules')

  get schedules() {
    return collectionData(this.scheduleCollection, { idField: 'id' }) as Observable<any[]>;
  }

  create(payload: any) {

    return addDoc(this.scheduleCollection, payload)
  }

  delete(id: any) {
    const scheduleRef = doc(this.scheduleCollection, id)
    return deleteDoc(scheduleRef)
  }
}
