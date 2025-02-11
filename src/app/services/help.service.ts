import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { addDoc, collection, collectionData, deleteDoc, doc, Firestore, updateDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HelpService {
  private apiUrl = 'https://vicci-email-api.onrender.com/send-email'
  private firestore: Firestore = inject(Firestore)
  helpCollection = collection(this.firestore, 'helps')

  constructor(private http: HttpClient) { }

  get helps() {
    return collectionData(this.helpCollection, { idField: 'id'}) as Observable<any[]>
  }

  create(payload: any) {
    return addDoc(this.helpCollection, payload)
  }

  update(id: any, payload: any) {
    const helpRef = doc(this.helpCollection, id)
    return updateDoc(helpRef, payload)
  }

  delete(id: any) {
    const helpRef = doc(this.helpCollection, id)
    return deleteDoc(helpRef)
  }

  sendEmail(to: string, subject: string, body: string): Observable<any> {
    const payload = { to, subject, body }
    return this.http.post(this.apiUrl, payload)
  }
}
