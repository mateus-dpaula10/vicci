import { inject, Injectable } from '@angular/core';
import { collection, collectionData, deleteDoc, doc, Firestore, setDoc, updateDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InviteService {
  private firestore: Firestore = inject(Firestore)
  inviteCollection = collection(this.firestore, 'invites')

  get invites(): Observable<any[]> {
    return collectionData(this.inviteCollection, { idField: 'id' }) as Observable<any[]>
  }

  submit(payload: any, user: any): Promise<void> {
    const invitDoc = doc(this.inviteCollection)

    if (payload.date) {
      payload.date = payload.date.toLocaleDateString('pt-BR')
    }

    return setDoc(invitDoc, {
      ...payload,
      indicatedBy: user.email,
      createdAt: new Date(),
      status: 'pendente'
    })
  }

  update(id: string, payload: any): Promise<void> {
    const invitDoc = doc(this.inviteCollection, id)
    return updateDoc(invitDoc, payload)
  }

  delete(id: any) {
    const invitDoc = doc(this.inviteCollection, id)
    return deleteDoc(invitDoc)
  }
}
