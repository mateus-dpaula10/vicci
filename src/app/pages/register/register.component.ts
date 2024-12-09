import { AsyncPipe } from '@angular/common';
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
  imports: [MatButtonModule, MatTableModule, ButtonComponent, MatIconModule, MatInputModule, FormsModule, AsyncPipe, NgxMaskDirective],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
  providers: [provideNgxMask({ /* opções de cfg */ })]
})
export class RegisterComponent {

  private dialog = inject(MatDialog);
  private studentService = inject(RegisterService);
  private snackbar = inject(MatSnackBar);
  imagePreview: any;
  file: any;
  pdf: any;

  displayedColumns: string[] = ['name', 'email', 'phoneNumber', 'cpf', 'birthDate', 'pdf', 'photo'];
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  columnsToDisplayWithExpand = [...this.displayedColumns, 'expand'];
  expandedElement: any;

  students$ = this.studentService.students;

  openDialog() {
    const dialogRef = this.dialog.open(RegisterModalComponent)
  }

  onSubmit(id: any, name: any, email: any, phoneNumber: any, cpf: any, birthDate: any, pdf?: any, photo?: any) {
    this.studentService.update(id, {
      name: name.value,
      email: email.value,
      phoneNumber: phoneNumber.value,
      cpf: cpf.value,
      birthDate: birthDate.value,
      // pdf: pdf,
      // photo: photo
    }, this.file, this.pdf)
      .then(() => this.snackbar.open("Aluno atualizado", ))
      .catch((error) => {
        this.snackbar.open("Erro ao atualizar", )
        console.log(error.message);
        
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
}
