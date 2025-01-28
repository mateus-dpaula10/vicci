import { AsyncPipe, CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ButtonComponent } from '../../components/utils/button/button.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RegisterService } from './register.service';
import { RegisterModalComponent } from './register-modal/register-modal.component';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { AuthService } from '../../services/auth.service';
import { filter, map, Observable, take } from 'rxjs';
import { MatOption, MatSelect } from '@angular/material/select';

@Component({
  selector: 'app-register',
  animations: [
    trigger('detailExpand', [
      state('collapsed,void', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
  standalone: true,
  imports: [MatButtonModule, MatTableModule, ButtonComponent, MatIconModule, MatInputModule, FormsModule, NgxMaskDirective, CommonModule, MatSelect, MatOption],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
  providers: [provideNgxMask({ /* opções de cfg */ })]
})
export class RegisterComponent {
  private dialog = inject(MatDialog);
  private studentService = inject(RegisterService);
  private allStudents = inject(AuthService);
  private snackbar = inject(MatSnackBar);

  constructor() {
    this.students$.subscribe(students => {
      this.filteredDataSource.data = students
    })
  }

  imagePreview: any;
  file: any;
  pdf: any;

  displayedColumns: string[] = ['name', 'email', 'phoneNumber', 'cpf', 'birthDate', 'studentConvidated'];
  columnsToDisplayWithExpand = [...this.displayedColumns, 'expand'];
  expandedElement: any;

  students$: Observable<any[]> = this.allStudents.fetchUsers.pipe(
    map(items => items.filter(item => item.role === 'Aluno'))
  )  

  filteredDataSource = new MatTableDataSource<any>();

  roles: string[] = ['Administrador', 'Aluno', 'Recepcionista', 'Instrutor', 'Gerente']
  sizes: string[] = ['P', 'M', 'G', 'GG', 'XG']
  currentUser: any | null = null
  olderAge: boolean = true

  async ngOnInit() {
    this.loadUser()
  }

  async loadUser(): Promise<void> {
    try {
      this.currentUser = await this.allStudents.getCurrentUser()
    } catch (error) {
      console.error('Erro ao carregar usuário logado: ', error)
      this.currentUser = null
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase()

    this.students$.pipe(
      map(students => students.filter(student => student.name.toLowerCase().includes(filterValue)))
    ).subscribe(filteredStudents => {
      this.filteredDataSource.data = filteredStudents
    })
  }

  toDate(date: string) {
    const day = date.slice(0, 2)
    const month = date.slice(2, 4)
    const year = date.slice(4)
    const formatedDate = `${day}/${month}/${year}`
    return formatedDate
  }

  verifyOlderAge(event: Event): void {
    const inputDate = (event.target as HTMLInputElement).value

    if (!/^\d{2}\/\d{2}\/\d{4}$/.test(inputDate)) {
      console.error('Data de nascimento inválida!')
      this.olderAge = false
      return
    }

    const [day, month, year] = inputDate.split('/').map(Number)

    if (day < 1 || day > 31 || month < 1 || month > 12 || year < 1900) {
      console.error('Data de nascimento inválida!')
      this.olderAge = false
      return
    }

    const currentDate = new Date()
    const birthDate = new Date(year, month - 1, day) 

    let age = currentDate.getFullYear() - birthDate.getFullYear()

    if (
      currentDate.getMonth() < birthDate.getMonth() ||
      (currentDate.getMonth() === birthDate.getMonth() &&
      currentDate.getDate() < birthDate.getDate())
    ) {
      age--
    }
    
    this.olderAge = age >= 18
  }

  onSubmit(
    id: any, 
    name: any, 
    email: any, 
    password: any, 
    phoneNumber: any, 
    cpf: any, 
    birthDate: any, 
    responsible: any, 
    cellphone_responsible: any, 
    consent_responsible: any, 
    pdf?: any, 
    photo?: any,
    shirtSize?: any, 
    pantsSize?: any,
    shortsSize?: any,
    shoeSize?: any,
    objective?: any
  ) {
    const payload = {
      name: name.value,
      email: email.value,
      password: password.value,
      phoneNumber: phoneNumber.value,
      cpf: cpf.value,
      birthDate: birthDate.value,
      responsible: responsible.value,
      cellphone_responsible: cellphone_responsible.value,
      consent_responsible: consent_responsible.value,
      pdf: pdf,
      photo: photo,
      shirtSize: shirtSize.value,
      pantsSize: pantsSize.value,
      shortsSize: shortsSize.value,
      shoeSize: shoeSize.value,
      objective: objective.value
    }

    this.studentService.update(id, payload, this.file, this.pdf)
      .then(() => {
        this.snackbar.open("Aluno atualizado com sucesso!", 'Fechar', { duration: 3000 })
      })
      .catch((error) => {
        this.snackbar.open("Favor, preencher todos os campos!", 'Fechar', { duration: 3000 })
      });
  }

  onDelete(id: any, file?: File, pdf?: File) {
    const snackbarRef = this.snackbar.open("Deseja excluir aluno?", "Excluir", { duration: 3000 });
    snackbarRef.onAction().subscribe(() => {
      this.studentService.delete(id, file as File, pdf as File)
        .then(() => this.snackbar.open("Aluno excluído", ))
        .catch(() => this.snackbar.open("Erro ao excluir", ));
    })
  }

  onImageSelected(target: any, element: any) {
    this.file = target.files[0];
    if (this.file) {
      this.generateImagePreview(this.file, element);
    }
  }

  onPdfSelected(target: any) {
    this.pdf = target.files[0]
  }

  generateImagePreview(file: File, element: any) {
    const reader = new FileReader();

    reader.onload = (e: any) => {
      this.imagePreview = e.target.result;
    };

    reader.readAsDataURL(file);
  }

  cleanImagePreview() {
    this.imagePreview = null;
  }

  // formatCpf(cpfNumber: string): string {
  //   const cpfFormatted = `${cpfNumber.slice(0, 3)}.${cpfNumber.slice(3, 6)}.${cpfNumber.slice(6, 9)}-${cpfNumber.slice(9, 11)}` 
  //   return cpfFormatted;
  // }

  // formatphoneNumber(phoneNumber: string): string {
  //   const phoneFormatted = `(${phoneNumber.slice(0, 2)})${phoneNumber.slice(2, 7)}-${phoneNumber.slice(7, 11)}`
  //   return phoneFormatted
  // }

  addPersonalData(id: number) {
    this.students$.pipe(
      map((students) => students.filter((student) => student.id === id)),
      take(1)
    )
    .subscribe((student) => {
      if (student) {
        this.dialog.open(RegisterModalComponent, {
          data: { student }
        })
      }
    })
  }
}
