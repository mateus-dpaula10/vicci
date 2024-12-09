import { Injectable, inject } from '@angular/core';
import { Firestore, addDoc, collection, collectionData, deleteDoc, doc, updateDoc } from '@angular/fire/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UnitServiceService {
  private firestore: Firestore = inject(Firestore);

  unitCollection = collection(this.firestore, 'units')

  get units() {
    return collectionData(this.unitCollection, { idField: 'id' }) as Observable<any[]>
  }

  async create(payload: any, file?: File) {
    if (!file)
      return addDoc(this.unitCollection, payload);

    const storage = getStorage();
    const dotIndex = file.name.lastIndexOf('.');
    const ext = file.name.slice(dotIndex, file.name.length);
    const storageRef = ref(storage, `${Date.now()}-${Math.round(Math.random() * 1E9)}${ext}`)
    const snapshot = await uploadBytes(storageRef, file);

    if (snapshot) {
      const imageUrl = await getDownloadURL(storageRef);
      payload.photo = imageUrl;
    }
    return addDoc(this.unitCollection, payload);
  }

  async update(id: any, payload: any, file?: any) {
    const unitRef = doc(this.unitCollection, id);

    if (!file)
      return updateDoc(unitRef, payload);

    if (!payload.photo) {
      const storage = getStorage();
      const dotIndex = file.name.lastIndexOf('.');
      const ext = file.name.slice(dotIndex, file.name.length);
      const storageRef = ref(storage, `${Date.now()}-${Math.round(Math.random() * 1E9)}${ext}`)
      const snapshot = await uploadBytes(storageRef, file);

      if (snapshot) {
        const imageUrl = await getDownloadURL(storageRef);
        payload.photo = imageUrl;
      }
      return updateDoc(unitRef, payload);
    }

    const storage = getStorage();
    const dotIndex = file.name.lastIndexOf('.');
    const ext = file.name.slice(dotIndex, file.name.length);
    const storageRef = ref(storage, `${Date.now()}-${Math.round(Math.random() * 1E9)}${ext}`)
    const snapshot = await uploadBytes(storageRef, file);

    if (snapshot) {
      const imageUrl = await getDownloadURL(storageRef);
      const unitImageRef = ref(storage, payload.photo)
      payload.photo = imageUrl;

      await deleteObject(unitImageRef);
    }
    return updateDoc(unitRef, payload);
  }

  delete(id: any, file?: any) {
    const unitRef = doc(this.unitCollection, id);
    const storage = getStorage();

    if (!file)
      return deleteDoc(unitRef);
    else {
      const unitImageRef = ref(storage, file as any)
      deleteObject(unitImageRef).then(() => {
      })
      return deleteDoc(unitRef);
    }
  }
}