import { inject, Injectable } from '@angular/core';
import { addDoc, collection, Firestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {

  constructor() { }

  private firestore: Firestore = inject(Firestore)

  feedbackCollection = collection(this.firestore, 'feedbacks')

  create(payload: any) {
    return addDoc(this.feedbackCollection, payload)
  }

}
