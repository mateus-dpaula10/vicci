import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { ButtonComponent } from '../../../components/utils/button/button.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PlansService } from '../plans.service';

@Component({
  selector: 'app-plans-modal',
  standalone: true,
  imports: [ReactiveFormsModule, MatInputModule, MatButtonModule, MatDialogModule, ButtonComponent,],
  templateUrl: './plans-modal.component.html',
  styleUrl: './plans-modal.component.scss'
})
export class PlansModalComponent {

  private fb = inject(FormBuilder);
  private plansService = inject(PlansService);
  private snackbar = inject(MatSnackBar);

  formPlan: FormGroup = this.fb.group({
    name: [[], Validators.required],
    price: [[], Validators.required],
    days: [[], Validators.required],
  });

  constructor(
    public dialogRef: MatDialogRef<PlansModalComponent>,
  ) { }

  onSubmit() {
    if (this.formPlan.invalid) {
      this.snackbar.open("Preencha todos os campos", undefined, { duration: 2000 })
      return
    }
    const payload = this.formPlan.value
    this.plansService.create(payload)
      .then(result => this.dialogRef.close(result))
      .catch(() => this.snackbar.open("Erro ao cadastrar", ));
  }
}