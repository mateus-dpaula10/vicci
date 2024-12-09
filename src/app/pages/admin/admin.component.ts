import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, inject } from '@angular/core';
import { collection, doc, Firestore, getDoc, getDocs, query, updateDoc, where } from '@angular/fire/firestore';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { AuthService } from '../../services/auth.service';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatButtonModule } from '@angular/material/button';
import { ButtonComponent } from '../../components/utils/button/button.component';

@Component({
  selector: 'app-admin',
  animations: [
    trigger('detailExpand', [
      state('collapsed,void', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
  standalone: true,
  imports: [CommonModule, MatIconModule, MatTableModule, MatInputModule, FormsModule, MatButtonModule, ButtonComponent],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AdminComponent {
  constructor(
    private firestore: Firestore
  ) {}

  private usersAll = inject(AuthService)
  private snackbar = inject(MatSnackBar)

  pendingUsers: any[] = []
  approvedUsers: any[] = []  

  // usuarios$ = this.usersAll.fetchUsers

  displayedColumns: string[] = ['email', 'password', 'role', 'status'];
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  columnsToDisplayWithExpand = [...this.displayedColumns, 'expand'];
  expandedElement: any;  

  async ngOnInit() {
    await this.getPendingUsers()
    await this.getApprovedUsers()
  } 

  async getPendingUsers() {
    const usersCollection = collection(this.firestore, 'users')
    const pendingQueryUsers = query(usersCollection, where('status', '==', 'Pendente'))
    const snapshot = await getDocs(pendingQueryUsers)
    this.pendingUsers = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
  }

  async getApprovedUsers() {
    const usersCollection = collection(this.firestore, 'users')
    const approvedQueryUsers = query(usersCollection, where('status', '==', 'Aprovado'))
    const snapshot = await getDocs(approvedQueryUsers)
    this.approvedUsers = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
  }

  async approveUser(userId: string, role: string): Promise<void> {
    try {
      const userDocRef = doc(this.firestore, `users/${userId}`)
      const userDocSnapshot = await getDoc(userDocRef)

      if (!userDocSnapshot.exists()) {
        console.error('Documento não encontrado:', userId)
        return
      }

      await updateDoc(userDocRef, { status: 'Aprovado', role })
      console.log(`Usuário ${userId} aprovado com sucesso como ${role}`)
      this.pendingUsers = this.pendingUsers.filter(user => user.id !== userId)
      await this.getApprovedUsers()
    } catch (error) {
      console.error('Erro ao aprovar usuário:', error)
    }
  }

  onSubmit(id: any, email: any, password: any, role: any, status: any) {
    this.usersAll.update(id, {
      email: email.value,
      password: password.value,
      role: role.value,
      status: status.value
    })
      .then(() => {
        this.snackbar.open("Usuário atualizado!")
        this.getApprovedUsers()
        this.getPendingUsers()
      })
      .catch(() => this.snackbar.open("Erro ao atualizar!"))
  }

  onDelete(id: any) {
    const snackbarRef = this.snackbar.open("Deseja excluir usuário?", "Excluir", { duration: 3000 });
    snackbarRef.onAction().subscribe(() => {
      this.usersAll.delete(id)
        .then(() => {
          this.snackbar.open("Usuário excluído!")
          this.getApprovedUsers()
          this.getPendingUsers()
        })
        .catch(() => this.snackbar.open("Erro ao excluir!"))
    })
  }
}