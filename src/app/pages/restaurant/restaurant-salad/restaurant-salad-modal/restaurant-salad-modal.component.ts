import { Component, inject } from '@angular/core';
import { RestaurantSaladService } from '../restaurant-salad.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { ButtonComponent } from '../../../../components/utils/button/button.component';

@Component({
  selector: 'app-restaurant-salad-modal',
  standalone: true,
  imports: [ReactiveFormsModule, MatInputModule, MatButtonModule, MatDialogModule, ButtonComponent,],
  templateUrl: './restaurant-salad-modal.component.html',
  styleUrl: './restaurant-salad-modal.component.scss'
})
export class RestaurantSaladModalComponent {
  private fb = inject(FormBuilder);
  private saladService = inject(RestaurantSaladService);
  private snackbar = inject(MatSnackBar);

  formSalad: FormGroup = this.fb.group({
    name: [[], Validators.required],
    weight: [[], Validators.required],
    kcal: [[], Validators.required],
    price: [[], Validators.required],
  });

  constructor(
    public dialogRef: MatDialogRef<RestaurantSaladModalComponent>,
  ) { }

  onSubmit() {
    if (this.formSalad.invalid) {
      this.snackbar.open("Preencha todos os campos", undefined, { duration: 2000 })
      return
    }
    const payload = this.formSalad.value
    this.saladService.create(payload)
      .then(result => this.dialogRef.close(result))
      .catch(() => this.snackbar.open("Erro ao cadastrar", ));
  }
}