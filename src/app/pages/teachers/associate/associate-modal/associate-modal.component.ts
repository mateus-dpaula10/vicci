import { Component, inject } from '@angular/core';
import { AssociateService } from '../associate.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { ButtonComponent } from '../../../../components/utils/button/button.component';

@Component({
  selector: 'app-associate-modal',
  standalone: true,
  imports: [ReactiveFormsModule, MatInputModule, MatButtonModule, MatDialogModule, ButtonComponent,],
  templateUrl: './associate-modal.component.html',
  styleUrl: './associate-modal.component.scss'
})
export class AssociateModalComponent {

  private fb = inject(FormBuilder);
  private associateService = inject(AssociateService);
  private snackbar = inject(MatSnackBar);

  formAssociate: FormGroup = this.fb.group({
    name: [[], Validators.required],
    expertise: [[], Validators.required],
    schedules: [[], Validators.required],
  });

  constructor(
    public dialogRef: MatDialogRef<AssociateModalComponent>,
  ) { }

  onSubmit() {
    if (this.formAssociate.invalid) {
      this.snackbar.open("Preencha todos os campos")
      return
    }
    const payload = this.formAssociate.value;
    this.associateService.create(payload)
      .then(result => this.dialogRef.close(result))
      .catch(() => this.snackbar.open("Erro ao cadastrar"))
  }

}