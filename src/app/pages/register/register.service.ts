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
import * as bcrypt from 'bcryptjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class RegisterService {
  private firestore: Firestore = inject(Firestore);
  private snackbar = inject(MatSnackBar);
  studentsCollection = collection(this.firestore, 'students');
  usersAll = collection(this.firestore, 'users')

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
    const studentRef = doc(this.usersAll, id)

    try {
      if (payload.password) {       
        if (payload.password.length < 6)  {
          throw new Error("A senha precisa conter pelo menos 6 caracteres.")
        } 
        payload.password = await bcrypt.hash(payload.password, 10)
      }

      if (!pdf) {
        delete payload.pdf
      }

      if (file) {
        payload.photo = await this.uploadFile(file, payload.file)
      }

      if (pdf) {
        payload.pdf = await this.uploadFile(file, payload.pdf)
      }

      await updateDoc(studentRef, payload)
    } catch (error) {
      console.error("Erro ao atualizar upload:", error)
      throw error
    }
  }

  async updateInformations(id: any, payload: any) {
    const studentRef = doc(this.usersAll, id)
    await updateDoc(studentRef, payload)
  }

  private async uploadFile(file: any, existingPath?: string): Promise<string> {
    const storage = getStorage()
    const dotIndex = file.name.lastIndexOf('.')
    const ext = file.name.slice(dotIndex)
    const storageRef = ref(storage, `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`)

    const snapshot = await uploadBytes(storageRef, file)

    if (!snapshot) {
      throw new Error("Erro ao realizar upload do arquivo.")
    }

    const fileUrl = await getDownloadURL(storageRef)

    if (existingPath) {
      const existingRef = ref(storage, existingPath)
      await deleteObject(existingRef).catch((err) => console.warn("Erro ao deletar arquivo anterior:", err))
    }

    return fileUrl
  }

  delete(id: any, file?: any, pdf?: any) {
    const studentRef = doc(this.usersAll, id);
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
