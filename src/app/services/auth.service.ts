import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, onAuthStateChanged } from '@angular/fire/auth';
import { addDoc, collection, collectionData, deleteDoc, doc, Firestore, getDoc, getDocs, query, setDoc, updateDoc, where } from '@angular/fire/firestore';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { User } from '../modelos/User';
import { v4 as uuidv4 } from 'uuid';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(
    private auth: Auth,
    private firestore: Firestore,
    private snackbar: MatSnackBar,
    private router: Router,
  ) { }
  
  usersAll = collection(this.firestore, 'users')
  
  get fetchUsers() {
    return collectionData(this.usersAll, { idField: 'id' }) as Observable<any[]>;
  }

  async login(email: string, password: string) {
    try {
      const userCollection = collection(this.firestore, 'users')
      const querySnapshot = await getDocs(query(userCollection, where('email', '==', email)))

      if (querySnapshot.empty) {
        this.snackbar.open("Usuário não encontrado!", 'Fechar', { duration: 3000 })
        return
      }

      const userDoc = querySnapshot.docs[0]
      const userData = userDoc.data() as User

      if (userData.password !== password) {
        this.snackbar.open("Senha incorreta!", 'Fechar', { duration: 3000 })
        return
      }

      if (userData.status === 'Aprovado') {
        localStorage.setItem('userId', userDoc.id)
        this.snackbar.open("Logado com sucesso!", 'Fechar', { duration: 3000 })
        this.router.navigate(['/teachers'])
      } else {
        this.snackbar.open("Aguardando aprovação do administrador!", 'Fechar', { duration: 3000 })
      }
    } catch (error) {
      console.error('Erro durante o login: ', error)
      this.snackbar.open("Erro ao realizar login. Tente novamente mais tarde!", 'Fechar', { duration: 3000 })
    }
  }

  async getCurrentUser(): Promise<any | null> {
    const userId = localStorage.getItem('userId')

    if (!userId) {
      return null
    }

    const userDocRef = doc(this.firestore, `users/${userId}`)

    const userDocSnapshot = await getDoc(userDocRef)

    if (!userDocSnapshot.exists()) {
      throw new Error('Usuário não encontrado!')
    }

    return userDocSnapshot.data()
  }

  async registerUser(email: string, password: string) {
    try {
      const userId = uuidv4()
      const userDocRef = doc(this.firestore, `users/${userId}`)
      await setDoc(userDocRef, {
        id: userId,
        email,
        password,
        status: 'Pendente',
        role: null,
        createdAt: new Date()
      })
      this.snackbar.open("Cadastro realizado com sucesso. Aguarde aprovação!", 'Fechar', { duration: 3000 })
    } catch (error) {
      console.error('Erro ao criar usuário: ', error)
      this.snackbar.open("Erro ao cadastrar usuário.", 'Fechar', { duration: 3000 })
    }
  }

  logout(): void {
    localStorage.removeItem('userId')

    this.router.navigate(['/login'])
  }

  update(id: any, payload: any) {
    const user = doc(this.usersAll, id)
    return updateDoc(user, payload)
  }

  delete(id: any) {
    const user = doc(this.usersAll, id)
    return deleteDoc(user)
  }
}