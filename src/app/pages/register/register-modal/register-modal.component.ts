import { Component, Inject, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { ButtonComponent } from '../../../components/utils/button/button.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RegisterService } from '../register.service';
import { MatIconModule } from '@angular/material/icon';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';

@Component({
  selector: 'app-register-modal',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule,
    ButtonComponent,
    MatIconModule,
    NgxMaskDirective,
    MatSelectModule,
    MatOptionModule
  ],
  templateUrl: './register-modal.component.html',
  styleUrl: './register-modal.component.scss',
  providers: [provideNgxMask()],
})
export class RegisterModalComponent {
  private fb = inject(FormBuilder);
  private studentService = inject(RegisterService);
  private snackbar = inject(MatSnackBar);
  formStudent: FormGroup
  student: any
  health_plans: any[] = ['Amil', 'Intermédica', 'Unimed', 'Porto Seguro']
  medical_restrictions: any[] = ['Cardiopatias', 'Pré-eclâmpsia']

  constructor(
    public dialogRef: MatDialogRef<RegisterModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.student = this.data.student[0]
    this.formStudent = this.fb.group({
      emergency_contact: [this.student.emergency_contact || '', Validators.required],
      phone_number_emergency_contact: [this.student.phone_number_emergency_contact || '', Validators.required],
      home_address: [this.student.home_address || '', Validators.required],
      preferred_hospital: [this.student.preferred_hospital || '', Validators.required],
      health_plans: [this.student.health_plans || '', Validators.required],
      medical_restrictions: [this.student.medical_restrictions || '', Validators.required]
    });
   }

  ngOnInit(): void {
    
  }

  onSubmit() {
    const payload = this.formStudent.value

    if (this.formStudent.invalid) {
      this.snackbar.open('Preencha todos os campos', 'Fechar', { duration: 3000 })
      return
    }

    this.studentService
      .updateInformations(this.student.id, payload)
      .then((result) => {
        this.dialogRef.close(result)        
        this.snackbar.open("Informações adicionados ao aluno com sucesso!", 'Fechar', { duration: 3000 })
      })
      .catch((error) => {
        this.snackbar.open("Erro ao adicionar informações ao aluno!" + error.message, 'Fechar', { duration: 3000 })
      })
  }
}