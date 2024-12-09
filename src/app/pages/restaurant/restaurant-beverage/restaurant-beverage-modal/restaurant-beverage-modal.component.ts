import { Component, inject } from '@angular/core';
import { RestaurantBeverageService } from '../restaurant-beverage.service';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ButtonComponent } from '../../../../components/utils/button/button.component';

@Component({
  selector: 'app-restaurant-beverage-modal',
  standalone: true,
  imports: [ReactiveFormsModule, MatInputModule, MatButtonModule, MatDialogModule, ButtonComponent,],
  templateUrl: './restaurant-beverage-modal.component.html',
  styleUrl: './restaurant-beverage-modal.component.scss'
})
export class RestaurantBeverageModalComponent {

  private fb = inject(FormBuilder);
  private beverageService = inject(RestaurantBeverageService);
  private snackbar = inject(MatSnackBar);

  formBeverage: FormGroup = this.fb.group({
    name: [[], Validators.required],
    weight: [[], Validators.required],
    kcal: [[], Validators.required],
    price: [[], Validators.required],
  });

  constructor(
    public dialogRef: MatDialogRef<RestaurantBeverageModalComponent>,
  ) { }

  onSubmit() {
    if (this.formBeverage.invalid) {
      this.snackbar.open("Preencha todos os campos", undefined, { duration: 2000 })
      return
    }
    const payload = this.formBeverage.value
    this.beverageService.create(payload)
      .then(result => this.dialogRef.close(result))
      .catch(() => this.snackbar.open("Erro ao cadastrar", ));
  }
}

