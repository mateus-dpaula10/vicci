import { inject, Injectable } from '@angular/core';
import { addDoc, collection, collectionData, deleteDoc, doc, Firestore, updateDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {
  private firestore: Firestore = inject(Firestore)
  feedbackCollection = collection(this.firestore, 'feedbacks')

  get feedbacks() {
    return collectionData(this.feedbackCollection, { idField: 'id' }) as Observable<any[]>
  }

  create(payload: any) {
    if (payload.date) {
      payload.date = payload.date.toLocaleDateString()
    }

    return addDoc(this.feedbackCollection, payload)
  }

  update(id: any, payload: any) {
    const feedbackCollection = doc(this.feedbackCollection, id)
    return updateDoc(feedbackCollection, payload)
  }

  delete(id: any) {
    const feedbackCollection = doc(this.feedbackCollection, id)
    return deleteDoc(feedbackCollection)
  }
}
