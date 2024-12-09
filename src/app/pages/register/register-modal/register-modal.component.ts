import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { ButtonComponent } from '../../../components/utils/button/button.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RegisterService } from '../register.service';
import { MatIconModule } from '@angular/material/icon';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';

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
  ],
  templateUrl: './register-modal.component.html',
  styleUrl: './register-modal.component.scss',
  providers: [provideNgxMask()],
})
export class RegisterModalComponent {
  private fb = inject(FormBuilder);
  private studentService = inject(RegisterService);
  private snackbar = inject(MatSnackBar);
  private file: File | undefined;
  private pdf: File | undefined;
  imagePreview: any;

  formStudent: FormGroup = this.fb.group({
    name: [[], Validators.required],
    email: [[], Validators.email],
    phoneNumber: [[], Validators.required],
    cpf: [[], Validators.required],
    password: [[], Validators.required],
    birthDate: [[], Validators.required],
    pdf: [],
    photo: [],
  });

  constructor(public dialogRef: MatDialogRef<RegisterModalComponent>) {}

  onSubmit() {
    const payload = this.formStudent.value;

    if (this.formStudent.invalid) {
      this.snackbar.open('Preencha todos os campos', undefined, {
        duration: 2000,
      });
      return;
    }
    this.studentService
      .create(payload, this.file as File, this.pdf as File)
      .then((result) => {

        this.dialogRef.close(result);
      })
      .catch(() => {
        this.snackbar.open('Erro ao cadastrar', );
      });
  }

  onImageSelected(target: any) {
    this.file = target.files[0];
    if (this.file) {
      this.generateImagePreview(this.file);
    }
  }

  generateImagePreview(file: File) {
    const reader = new FileReader();

    reader.onload = (e: any) => {
      this.imagePreview = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  onPdfSelected(target: any) {
    this.pdf = target.files[0];
  }
}
