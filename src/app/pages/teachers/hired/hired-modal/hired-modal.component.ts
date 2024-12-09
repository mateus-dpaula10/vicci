import { Component, inject } from '@angular/core';
import { HiredService } from '../hired.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { ButtonComponent } from '../../../../components/utils/button/button.component';

@Component({
  selector: 'app-hired-modal',
  standalone: true,
  imports: [ReactiveFormsModule, MatInputModule, MatButtonModule, MatDialogModule, ButtonComponent,],
  templateUrl: './hired-modal.component.html',
  styleUrl: './hired-modal.component.scss'
})
export class HiredModalComponent {

  private fb = inject(FormBuilder);
  private hiredService = inject(HiredService);
  private snackbar = inject(MatSnackBar);

  formHired: FormGroup = this.fb.group({
    name: [[], Validators.required],
    expertise: [[], Validators.required],
    schedules: [[], Validators.required],
  });

  constructor(
    public dialogRef: MatDialogRef<HiredModalComponent>,
  ) { }

  onSubmit() {
    if (this.formHired.invalid) {
      this.snackbar.open("Preencha todos os campos")
      return
    }
    const payload = this.formHired.value;
    this.hiredService.create(payload)
      .then(result => this.dialogRef.close(result))
      .catch(() => this.snackbar.open("Erro ao cadastrar"))
  }
}