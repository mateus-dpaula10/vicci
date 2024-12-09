import { Component, inject } from '@angular/core';
import { RestaurantSauceService } from '../restaurant-sauce.service';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ButtonComponent } from '../../../../components/utils/button/button.component';

@Component({
  selector: 'app-restaurant-sauce-modal',
  standalone: true,
  imports: [ReactiveFormsModule, MatInputModule, MatButtonModule, MatDialogModule, ButtonComponent,],
  templateUrl: './restaurant-sauce-modal.component.html',
  styleUrl: './restaurant-sauce-modal.component.scss'
})
export class RestaurantSauceModalComponent {
  private fb = inject(FormBuilder);
  private saladService = inject(RestaurantSauceService);
  private snackbar = inject(MatSnackBar);

  formSauce: FormGroup = this.fb.group({
    name: [[], Validators.required],
    weight: [[], Validators.required],
    kcal: [[], Validators.required],
    price: [[], Validators.required],
  });

  constructor(
    public dialogRef: MatDialogRef<RestaurantSauceModalComponent>,
  ) { }

  onSubmit() {
    if (this.formSauce.invalid) {
      this.snackbar.open("Preencha todos os campos")
      return
    }
    const payload = this.formSauce.value
    this.saladService.create(payload)
      .then(result => this.dialogRef.close(result))
      .catch(() => this.snackbar.open("Erro ao cadastrar"));
  }
}