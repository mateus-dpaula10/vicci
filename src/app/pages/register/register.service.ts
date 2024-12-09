import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  addDoc,
  collection,
  collectionData,
  deleteDoc,
  doc,
  updateDoc,
} from '@angular/fire/firestore';
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RegisterService {
  private firestore: Firestore = inject(Firestore);
  studentsCollection = collection(this.firestore, 'students');

  get students() {
    return collectionData(this.studentsCollection, { idField: 'id', }) as Observable<any[]>;
  }

  async create(payload: any, file?: File, pdf?: File) {
    if (!file && !pdf) {

      return addDoc(this.studentsCollection, payload);
    } else {
      const storage = getStorage();
      let imageUrl: string | undefined;
      let pdfUrl: string | undefined;

      if (file) {
        const dotIndex = file.name.lastIndexOf('.');
        const ext = file.name.slice(dotIndex, file.name.length);
        const storageRef = ref(
          storage,
          `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`
        );
        const snapshot = await uploadBytes(storageRef, file);

        if (snapshot) {
          imageUrl = await getDownloadURL(storageRef);
          payload.photo = imageUrl;
        }
      }

      if (pdf) {
        const dotIndexPdf = pdf.name.lastIndexOf('.');
        const extPdf = pdf.name.slice(dotIndexPdf, pdf.name.length);
        const storageRefPdf = ref(
          storage,
          `${Date.now()}-${Math.round(Math.random() * 1e9)}${extPdf}`
        );
        const snapshotPdf = await uploadBytes(storageRefPdf, pdf);

        if (snapshotPdf) {
          pdfUrl = await getDownloadURL(storageRefPdf);
          payload.pdf = pdfUrl;
        }
      }

      return addDoc(this.studentsCollection, payload);
    }
  }

  async update(id: any, payload: any, file?: any, pdf?: any | undefined) {
    const studentRef = doc(this.studentsCollection, id);

    if (!file && !pdf) {
      return updateDoc(studentRef, payload);
    } else {
      const storage = getStorage();
      let imageUrl: string | undefined;
      let pdfUrl: string | undefined;

      if (file) {
        const dotIndex = file.name.lastIndexOf('.');
        const ext = file.name.slice(dotIndex, file.name.length);
        const storageRef = ref(storage, `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`);
        const snapshot = await uploadBytes(storageRef, file);

        if (snapshot) {
          imageUrl = await getDownloadURL(storageRef);
          const studentImageRef = ref(storage, payload.photo);
          payload.photo = imageUrl;
          await deleteObject(studentImageRef);
        }
      }

      if (pdf) {
        const dotIndexPdf = pdf.name.lastIndexOf('.');
        const extPdf = pdf.name.slice(dotIndexPdf, pdf.name.length);
        const storageRefPdf = ref(
          storage,
          `${Date.now()}-${Math.round(Math.random() * 1e9)}${extPdf}`
        );
        const snapshotPdf = await uploadBytes(storageRefPdf, pdf);

        if (snapshotPdf) {
          pdfUrl = await getDownloadURL(storageRefPdf);
          const pdfRef = ref(storage, payload.pdf);
          payload.pdf = pdfUrl;
          await deleteObject(pdfRef);
        }
      }
      return updateDoc(studentRef, payload);
    }
  }

  delete(id: any, file?: any, pdf?: any) {
    const studentRef = doc(this.studentsCollection, id);
    const storage = getStorage();

    if (!file && !pdf) {
      return deleteDoc(studentRef);
    } else {
      if (file) {
        const studentImageRef = ref(storage, file as any);
        deleteObject(studentImageRef).then(() => { });
      }

      if (pdf) {
        const studentPdfRef = ref(storage, pdf as any);
        deleteObject(studentPdfRef).then(() => { });
      }

      return deleteDoc(studentRef);
    }
  }
}
