import { Injectable, inject } from '@angular/core';
import { Firestore, addDoc, collection, collectionData, deleteDoc, doc, updateDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

@Injectable({
  providedIn: 'root'
})
export class EquipmentsService {
  private firestore: Firestore = inject(Firestore);

  equipmentCollection = collection(this.firestore, 'equipments');

  get equipments() {
    return collectionData(this.equipmentCollection, { idField: 'id' }) as Observable<any[]>
  }

  async create(payload: any, file?: File) {
    if (!file)
      return addDoc(this.equipmentCollection, payload);

    const storage = getStorage();
    const dotIndex = file.name.lastIndexOf('.');
    const ext = file.name.slice(dotIndex, file.name.length);
    const storageRef = ref(storage, `${Date.now()}-${Math.round(Math.random() * 1E9)}${ext}`)
    const snapshot = await uploadBytes(storageRef, file);

    if (snapshot) {
      const imageUrl = await getDownloadURL(storageRef);
      payload.photo = imageUrl;
    }
    return addDoc(this.equipmentCollection, payload);
  }

  async update(id: any, payload: any, file?: any) {
    const equipmentRef = doc(this.equipmentCollection, id);

    if (!file)
      return updateDoc(equipmentRef, payload);

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
      return updateDoc(equipmentRef, payload);
    }

    else {
      const storage = getStorage();
      const dotIndex = file.name.lastIndexOf('.');
      const ext = file.name.slice(dotIndex, file.name.length);
      const storageRef = ref(storage, `${Date.now()}-${Math.round(Math.random() * 1E9)}${ext}`)
      const snapshot = await uploadBytes(storageRef, file);

      if (snapshot) {
        const imageUrl = await getDownloadURL(storageRef);
        const equipmentImageRef = ref(storage, payload.photo)
        payload.photo = imageUrl;

        await deleteObject(equipmentImageRef);
      }
      return updateDoc(equipmentRef, payload);
    }
  }

  delete(id: any, file?: any) {
    const equipmentRef = doc(this.equipmentCollection, id);
    const storage = getStorage();

    if (!file)
      return deleteDoc(equipmentRef);
    else {
      const equipmentImageRef = ref(storage, file as any)
      deleteObject(equipmentImageRef).then(() => {
      })
      return deleteDoc(equipmentRef);
    }
  }
}
