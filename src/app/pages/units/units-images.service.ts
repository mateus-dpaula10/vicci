import { Injectable, inject } from '@angular/core';
import { Firestore, addDoc, collection, collectionData, deleteDoc, doc } from '@angular/fire/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UnitsImagesService {
  private firestore: Firestore = inject(Firestore);

  unitImagesCollection = collection(this.firestore, 'unitsImages')

  get unitsImages() {
    return collectionData(this.unitImagesCollection, { idField: 'id' }) as Observable<any[]>
  }

  async createImages(file: any, unitId: any) {
      
      const storage = getStorage();
      const dotIndex = file.name.lastIndexOf('.');
      const ext = file.name.slice(dotIndex, file.name.length);
      const storageRef = ref(storage, `${Date.now()}-${Math.round(Math.random() * 1E9)}${ext}`)
      const snapshot = await uploadBytes(storageRef, file);
      let addDocResult;
  
      if (snapshot) {
        const imageUrl = await getDownloadURL(storageRef);

        const imageData = {
          unitId: unitId,
          photo: imageUrl
        };

        addDocResult = addDoc(this.unitImagesCollection, imageData);
      }
      return addDocResult
  }

  async deleteAllImages(id: any, file: any ) {
    const imageRef = doc(this.unitImagesCollection, id)
    const storage = getStorage();
    const unitImageRef = ref (storage, file as any)

    deleteObject(unitImageRef).then(() => {
      console.log("entrou no delete object");
      
    })

    return deleteDoc(imageRef);
  }
}
